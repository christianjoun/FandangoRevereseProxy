var frisby = require('frisby');
var config = require('./config');

// ----- tests from previous project here

let postResponse  = { sendpurchaseinviteresponse: { data: { invitesent: { type: 'email', value: 'True' } } } };

frisby.create('Wrong endpoint gives 404')
  .get(config.proxyUrl + '/hakumatata')
  .expectStatus(404)
  .expectHeader('Content-Type', 'text/html; charset=utf-8')
  .expectBodyContains('404 Not found')
.toss();

frisby.create('testing other route ‘/‘')
  .get(config.proxyUrl + '/')
  .expectStatus(200)
  .expectHeader('Content-Type', 'text/html; charset=utf-8')
  .inspectBody()
  .expectBodyContains('Fandango ES6 Proxy')
.toss();

frisby.create('get request with missing api key should return `no apikey`')
  .get(config.proxyUrl + '/api.fandango.com/v1?verbosity=4&op=videolookup&movieid=159267&relations=true&datarate=1500')
  .expectStatus(403)
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectJSON({ error: 'no apikey' })
  .toss();

frisby.create('get request should work: videolookup&movieid&relations')
  .get(config.proxyUrl + '/api.fandango.com/v1?verbosity=4&op=videolookup&movieid=159267&relations=true&datarate=1500&apikey=3awe5sdsv2nwawef9facjeej')
  .expectStatus(200)
  .expectHeader('Access-Control-Allow-Origin', '*')
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectBodyContains('videolookupresponse')
  .expectBodyContains('data')
  .expectBodyContains('movies')
  .toss();

frisby.create('get request should work: videolookup&movieid')
  .get(config.proxyUrl + '/api.fandango.com/v1?verbosity=4&op=videolookup&movieid=154536&apikey=3awe5sdsv2nwawef9facjeej')
  .expectStatus(200)
  .expectHeader('Access-Control-Allow-Origin', '*')
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectBodyContains('videolookupresponse')
  .expectBodyContains('data')
  .expectBodyContains('movies')
  .toss();

frisby.create('get request should work: theatersbypostalcodesearch&postalcode')
  .get(config.proxyUrl + '/api.fandango.com/v1?op=theatersbypostalcodesearch&postalcode=94105&apikey=3awe5sdsv2nwawef9facjeej')
  .expectStatus(200)
  .expectHeader('Access-Control-Allow-Origin', '*')
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectBodyContains('theatersbypostalcodesearchresponse')
  .expectBodyContains('data')
  .expectBodyContains('location')
  .toss();

frisby.create('get request with invalid operation should fail gracefully')
  .get(config.proxyUrl + '/api.fandango.com/v1?op=theatersbypostalcodesearch2&postalcode=94105&apikey=3awe5sdsv2nwawef9facjeej')
  .expectStatus(200)
  .expectHeader('Access-Control-Allow-Origin', '*')
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectBodyContains('ERRORresponse')
  .expectBodyContains('InvalidOperation')
  .toss();

frisby.create('post request should work')
  .post(config.proxyUrl + '/api.fandango.com/v1', {
  op: 'sendpurchaseinvite',
  theatertmsid: 'AAWTY',
  showid: '52485069',
  affiliateid: '12949',
  date: '2014-07-17',
  time: '10:45pm',
  apikey: '3awe5sdsv2nwawef9facjeej',
  email: 'rachmcnamara@gmail.com',
  movieid: '156265',
})
  .expectStatus(200)
  .expectHeader('Access-Control-Allow-Origin', '*')
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectJSON(postResponse)
  .toss();

frisby.create('post request with missing theatremsid parameter should fail gracefully')
  .post(config.proxyUrl + '/api.fandango.com/v1', {
  op: 'sendpurchaseinvite',

  //theatertmsid: 'AAWTY',
  showid: '52485069',
  affiliateid: '12949',
  date: '2014-07-17',
  time: '10:45pm',
  apikey: '3awe5sdsv2nwawef9facjeej',
  email: 'rachmcnamara@gmail.com',
  movieid: '156265',
})
  .expectStatus(200)
  .expectHeader('Access-Control-Allow-Origin', '*')
  .expectHeader('Content-Type', 'application/json; charset=utf-8')

  //.expectJSON(errorResponseForMissingTheatertmsid)
  .expectBodyContains('EmptyParameter')
  .toss();

frisby.create('post request with missing op parameter should fail gracefully')
  .post(config.proxyUrl + '/api.fandango.com/v1', {
  /*op: 'sendpurchaseinvite',*/
  theatertmsid: 'AAWTY',
  showid: '52485069',
  affiliateid: '12949',
  date: '2014-07-17',
  time: '10:45pm',
  apikey: '3awe5sdsv2nwawef9facjeej',
  email: 'rachmcnamara@gmail.com',
  movieid: '156265',
})
  .expectStatus(200)
  .expectHeader('Access-Control-Allow-Origin', '*')
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectJSON({})
  .toss();

frisby.create('post request with invalidOperation should fail gracefully')
  .post(config.proxyUrl + '/api.fandango.com/v1', {
  op: 'sendpurchaseinvite2',
  theatertmsid: 'AAWTY',
  showid: '52485069',
  affiliateid: '12949',
  date: '2014-07-17',
  time: '10:45pm',
  apikey: '3awe5sdsv2nwawef9facjeej',
  email: 'rachmcnamara@gmail.com',
  movieid: '156265',
})
  .expectStatus(200)
  .expectHeader('Access-Control-Allow-Origin', '*')
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectBodyContains('ERRORresponse')
  .expectBodyContains('InvalidOperation')
  .toss();

frisby.create('post request with missing api key should return `no apikey`')
  .post(config.proxyUrl + '/api.fandango.com/v1', {
  op: 'sendpurchaseinvite',
  theatertmsid: 'AAWTY',
  showid: '52485069',
  affiliateid: '12949',
  date: '2014-07-17',
  time: '10:45pm',
  /*apikey: '3awe5sdsv2nwawef9facjeej',*/
  email: 'rachmcnamara@gmail.com',
  movieid: '156265',
})
  .expectStatus(403)
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectJSON({ error: 'no apikey' })
  .toss();
