var express = require('express');
var router = express.Router();
var data = require('../data/data')

/* GET home page. */
router.get('/', async function(req, res, next) {
  let artID = Math.random() * data.maxID;
  let art = await data.getArtwork(artID);
  res.render('index', { title: 'The Langenheim', 
                        art: art,
                        layout: 'layout'});
});

module.exports = router;