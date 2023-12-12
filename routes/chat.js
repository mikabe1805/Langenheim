var express = require('express');
var router = express.Router();
var data = require('../data/data');

/* GET home page. */
router.get('/index', async function(req, res, next) {
  let art = await data.getArtwork(req.query.room);

  res.render('chat', { title: 'The Langenheim',
                        layout: 'layout',
                        art_source: art['art_source']});
});

module.exports = router;
