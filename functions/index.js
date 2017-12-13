const Promise = require('bluebird');
const functions = require('firebase-functions');
const rp = require('request-promise');
const admin = require('firebase-admin');
const helpers = require('./helpers');

admin.initializeApp(functions.config().firebase);

const rootRef = admin.database().ref();
const firestore = admin.firestore();

exports.ufwBlockEvents = functions.https.onRequest((req, res) => {
  const { secret } = req.query;
  const { events } = JSON.parse(req.body.payload);
  const savedSearch = JSON.parse(req.body.payload).saved_search;

  return rootRef.child('config').once('value').then((data) => {
    const config = data.val();
    if (config.secret !== secret) {
      return res.status(404);
    }

    if (savedSearch.name !== 'UFW Blocks') {
      return res.status(404);
    }

    return Promise.map(events, (event) => {
      const firestoreEvent = {
        time: event.received_at,
        hostname: event.hostname,
        rawLog: event.message,
      };
      const strToParse = event.message;
      const segments = strToParse.split(' ');
      return Promise.map(segments, (segment) => {
        const parsed = helpers.parseUfwSegment(segment);
        if (!parsed) { return; }

        const [field, value] = parsed;
        firestoreEvent[field] = value;
      }).then(() => firestore.doc(`/ufwBlocks/${event.id}`).set(firestoreEvent));
    });
  }).then(() => res.send('ok'));
});

exports.onNewUfwBlock = functions.firestore.document('/ufwBlocks/{id}').onCreate((event) => {
  const block = event.data.data();
  const geoIPUrl = `https://freegeoip.net/json/${block.src_ip}`;
  const asnUrl = `https://api.iptoasn.com/v1/as/ip/${block.src_ip}`;

  const options = {
    uri: geoIPUrl,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
    timeout: 10000,
  };

  let geoip = {};
  let asn = {};

  return rp(options).then((g) => {
    geoip = g;
    options.uri = asnUrl;
    return rp(options).then((a) => {
      asn = a;
    });
  }).finally(() => {
    const geo = new admin.firestore.GeoPoint(geoip.latitude || null, geoip.longitude || null);
    const city = geoip.city || null;
    const country = geoip.country_name || null;
    const subcountry = geoip.region_name || null;

    const number = asn.as_number || null;
    const description = asn.as_description || null;
    const countryCode = asn.as_country_code || null;
    const range = `${asn.first_ip || '0.0.0.0'} - ${asn.last_ip || '0.0.0.0'}`;

    const blk = {
      country,
      subcountry,
      city,
      geo,
      asn: {
        number,
        description,
        countryCode,
        range,
      },
    };
    return event.data.ref.set(blk, { merge: true });
  });
});
