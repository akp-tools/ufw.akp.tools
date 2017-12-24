const Promise = require('bluebird');
const functions = require('firebase-functions');
const rp = require('request-promise');
const admin = require('firebase-admin');
const helpers = require('./helpers');

admin.initializeApp(functions.config().firebase);

const rootRef = admin.database().ref();
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
    return event.data.ref.set(blk, { merge: true }).then(() => firestore.collection('geopoints').add({ geo, country, subcountry }))
      .then(() => {
        const cityRef = firestore.collection('cities').doc(city);
        const subcountryRef = firestore.collection('regions').doc(subcountry);
        const countryRef = firestore.collection('countries').doc(country);
        const geoRef = firestore.collection('geopoints').doc(`${geo.latitude}/${geo.longitude}`);
        return firestore.runTransaction((t) => {
          let cityCount = 0;
          let subcountryCount = 0;
          let countryCount = 0;
          let geoCount = 0;

          return t.get(cityRef)
            .then((doc) => {
              cityCount = doc.data() || cityCount;
              cityCount += 1;
              return t.get(subcountryRef);
            })
            .then((doc) => {
              subcountryCount = doc.data() || subcountryCount;
              subcountryCount += 1;
              return t.get(countryRef);
            })
            .then((doc) => {
              countryCount = doc.data() || countryCount;
              countryCount += 1;
              return t.get(geoRef);
            })
            .then((doc) => {
              geoCount = doc.data() || geoCount;
              geoCount += 1;
            })
            .then(() => {
              t.update(cityRef, cityCount)
                .update(subcountryRef, subcountryCount)
                .update(countryRef, countryCount)
                .update(geoRef, geoCount);
            });
        })
          .then((res) => {
            console.log('Transaction success', res);
          })
          .catch((err) => {
            console.log('Transaction failure:', err);
          });
      });
  });
});
