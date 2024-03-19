var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
const { GoogleSpreadsheet } = require('google-spreadsheet');
var {google} = require('googleapis');
// File handling package
// maybe add cors code here?
const fs = require('fs');
const { INSPECT_MAX_BYTES } = require('buffer');
const RESPONSES_SHEET_ID = '1xwhYVhmQjnEZsFlsUqqb4ejq_DZcFXsNzW1F8RLNgfk'; //Artwork 2


const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);
const CREDENTIALS = JSON.parse(fs.readFileSync('./credentials.json'));
const getServerSide = async() => {
  const auth = await google.auth.getClient({scopes: ['https://www.googleapis.com/auth/spreadsheets']});
  const sheets = google.sheets({ version: 'v4', auth });
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  await doc.useServiceAccountAuth({
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key
  });
  res.header("Access-Control-Allow-Origin", "https://langenheim-a07134ab155c.herokuapp.com");
  res.header("Access-Control-Allow-Headers", "*");
  res.render('loadUnity', { title: 'The Langenheim', 
                        layout: 'layout'});
});

module.exports = router;