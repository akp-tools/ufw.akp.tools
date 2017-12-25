const Promise = require('bluebird');
const functions = require('firebase-functions');
const rp = require('request-promise');
const admin = require('firebase-admin');
const helpers = require('./helpers');

admin.initializeApp(functions.config().firebase);

const rootRef = admin.database().ref();
const dataRef = rootRef.child('data');
const firestore = admin.firestore();

exports.rawUfwLine = functions.https.onRequest((req, res) => {
  const { secret } = req.query;
  const line = req.body;

  return rootRef.child('config').once('value').then((data) => {
    const config = data.val();
    if (config.secret !== secret) {
      return res.status(404);
    }

    const firestoreEvent = {
      time: Date.now(),
      rawLog: line,
    };
    const strToParse = line;
    const segments = strToParse.split(' ');
    return Promise.map(segments, (segment) => {
      const parsed = helpers.parseUfwSegment(segment);
      if (!parsed) { return; }

      const [field, value] = parsed;
      firestoreEvent[field] = value;
    }).then(() => firestore.doc(`/ufwBlocks/${firestoreEvent.time}`).set(firestoreEvent));
  }).then(() => res.send('ok\n'));
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

    const b64 = Buffer.from(`${blk.geo.latitude}|${blk.geo.longitude}`).toString('base64');

    return event.data.ref.set(blk, { merge: true }).then(() => dataRef.child(`geopoints/${b64}`).set({ geo, country, subcountry })).then(() => {
      let countryRef;
      let regionRef;
      let cityRef;
      let geoRef;
      let countryKey;
      let regionKey;
      let cityKey;
      const promises = [];

      if (blk.country) {
        countryKey = blk.country.replace(/\./g, '');
        countryRef = dataRef.child('byCountry').child(countryKey);
      }

      if (blk.subcountry) {
        regionKey = blk.subcountry.replace(/\./g, '');
        regionRef = dataRef.child('byRegion').child(`${regionKey}, ${countryKey}`);
      }

      if (blk.city) {
        cityKey = blk.city.replace(/\./g, '');
        cityRef = dataRef.child('byCity').child(`${cityKey}, ${regionKey}, ${countryKey}`);
      }

      if (b64) {
        geoRef = dataRef.child('byLatLng').child(b64);
      }

      if (countryRef) {
        promises.push(countryRef.transaction((cntry) => {
          let c = cntry || 0;
          c += 1;
          return c;
        }));
      }

      if (regionRef) {
        promises.push(regionRef.transaction((region) => {
          let r = region || 0;
          r += 1;
          return r;
        }));
      }

      if (cityRef) {
        promises.push(cityRef.transaction((cty) => {
          let c = cty || 0;
          c += 1;
          return c;
        }));
      }

      if (geoRef) {
        promises.push(geoRef.transaction((go) => {
          let g = go || 0;
          g += 1;
          return g;
        }));
      }

      return Promise.all(promises);
    });
  });
});
