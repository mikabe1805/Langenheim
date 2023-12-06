var express = require('express');
var router = express.Router();
// if you have any issues, get rid of the following code:
// const app = express();
// const port = 8080;

// app.get('/', (req,res)=>{
//   res.send('Hello World');
// });

// app.listen(port, ()=>{
//   console.log(`App is listening at http://localhost:${port}`);
// });
// up until here

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Langenheim', 
                        layout: 'layout'});
});

module.exports = router;