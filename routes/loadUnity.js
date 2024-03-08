var express = require('express');
var router = express.Router();
// const cors=require("cors");
// const corsOptions ={
//    origin:'*', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }

// app.use(cors(corsOptions)) // Use this after the variable declaration

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('loadUnity', { title: 'BCAVAM', 
                        layout: 'layout'});
});

module.exports = router;