const restify = require("restify");
const port = process.env.PORT || 8080
const server = restify.createServer({
  name: 'Test Restify Server',
});
const lowEndBoxScrapingController = require("./controllers/webScrapingController");
const lowEndBoxScrapingControllerClass = new lowEndBoxScrapingController;

var nodeCouchDB = require("node-couchdb");
const couch = new nodeCouchDB({
    host: '66.228.52.110',
    port: 5984
});
server.listen(port, function(){
    console.log(`listening on port ${port}`);
});


// GET Request that actually posts the local JSON file to Couch
server.get('/v1/parse/:dbResults', function(req, res){
  // website title parsed = DB ID && _uid
  let uid = lowEndBoxScrapingControllerClass.parseFromFile()[0].title
  // Creates a DB in Couch named from the parsed JSON file
  // Currently only passing in the local low end JSON results
  couch.createDatabase(uid).then(() => { }, err => {
    console.log("create db error", err);
  })

  // Inserts the parsed HTML into the UID titled DB.  Field is an array of results.
  couch.insert(uid, {
    _id: uid,
    mappedHtmlData: lowEndBoxScrapingControllerClass.parseFromFile()
  }).then(({data, headers, status}) => {
}, err => {
  console.log('err', err);
  });
});
