var express = require('express');
var router = express.Router();
var data = require('../data/data')

/* GET home page. */
router.get('/', async function(req, res, next) {
//   let maxID = await data.getMaxID();
//   let artID = Math.random() * maxID;
  // let artID = 1;
  let art = await data.getRandomArtwork();
  // let art = await data.getArtwork("3");
  console.log(art);
  res.render('index', { title: 'The Langenheim', 
                        art: art,
                        layout: 'layout'});
});

module.exports = router;