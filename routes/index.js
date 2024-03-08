var express = require('express');
var router = express.Router();
var data = require('../data/data')

/* GET home page. */
router.get('/', async function(req, res, next) {
  // let artID = Math.random() * data.maxID;
  // let artID = 1;
  let artt = await data.getArtwork(1);
  res.render('index', { title: 'The Langenheim', 
                        art: artt,
                        layout: 'layout'});
});

module.exports = router;