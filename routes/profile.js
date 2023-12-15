var express = require('express');
var router = express.Router();

// const { requiresAuth } = require('express-openid-connect');

// router.get('/profile', requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('profile', { title: 'The Langenheim', 
                        layout: 'layout'});
});

module.exports = router;