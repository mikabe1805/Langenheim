var express = require('express');
var router = express.Router();
var data = require('../data/data');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let artworks = await data.getArtwork3();
//   content.then();
  res.render('imageScript', { title: 'The Langenheim',
                            artworks: artworks,
                        layout: 'layout2'});
});

module.exports = router;