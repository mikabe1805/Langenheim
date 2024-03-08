var express = require('express');
var router = express.Router();
// // const cors=require("cors");
// // const corsOptions ={
// //    origin:'*', 
// //    credentials:true,            //access-control-allow-credentials:true
// //    optionSuccessStatus:200,
// // }

// // app.use(cors(corsOptions)) // Use this after the variable declaration

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('loadUnity', { title: 'BCAVAM', 
                        layout: 'layout'});
});

module.exports = router;

var x = new XMLHttpRequest();
x.open('GET', 'https://mysterious-citadel-11464-8a0e45efb7c9.herokuapp.com/https://langenheim-a07134ab155c.herokuapp.com/loadUnity');
// I put "XMLHttpRequest" here, but you can use anything you want.
x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
x.onload = function() {
    alert(x.responseText);
};
x.send();