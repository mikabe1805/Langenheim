var express = require('express');
var router = express.Router();
var data = require('../data/data');

// const { requiresAuth } = require('express-openid-connect');

// router.get('/profile', requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

/* GET home page. */
router.get('/', async function(req, res, next) {
  let art = await data.getArtwork2('Mika Be');
  res.render('profile', { title: 'The Langenheim', 
                        art: art,
                        layout: 'layout'});
});

module.exports = router;