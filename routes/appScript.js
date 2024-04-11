var express = require('express');
var router = express.Router();
var data = require('../data/data');

/* GET home page. */
router.get('/', async function(req, res, next) {
    // I DID IT!!
  let content = await data.getJSON();
//   content.then();
  res.render('appScript', { title: 'The Langenheim',
                            content: content,
                        layout: 'layout2'});
});

module.exports = router;