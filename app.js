var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { GoogleSpreadsheet } = require('google-spreadsheet');
var {google} = require('googleapis');
//var data = require('../data/data'); <- this is the code breaker
// File handling package
const fs = require('fs');
const Filter = require('bad-words');
const RESPONSES_SHEET_ID = '1xwhYVhmQjnEZsFlsUqqb4ejq_DZcFXsNzW1F8RLNgfk'; //Artwork 2
//const RESPONSES_SHEET_ID = '11dCOw0eFFKVXmPo1alL-G006VF7_xHL0VLrYNVsnkGM'; //Artwork 1
// const cors = require("cors");

const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
var indexRouter = require('./routes/index');
var appScriptRouter = require('./routes/appScript');
var imageScriptRouter = require('./routes/imageScript');
var artworkRouter = require('./routes/artwork');
var aboutRouter = require('./routes/about');
var creditsRouter = require('./routes/credits');
var loginRouter = require('./routes/login2');
var launchRouter = require('./routes/loadUnity');
var submitRouter = require('./routes/submission');
var chatRouter = require('./routes/chat');
var profileRouter = require('./routes/profile');
var jsonRouter = require('./routes/json');
var data = require('./data/data');
var http = require('http');
var app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// var cors = require('cors');
var originsWhitelist = [
  'http://localhost:3101',
  'https://langenheim-a07134ab155c.herokuapp.com'
];
// var corsOptions = {
//   origin: function(origin, callback){
//         console.log(origin);
//         var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
//         console.log(isWhitelisted);
//         callback(null, isWhitelisted);
//   },
//   credentials:true
// }
// app.use(cors(corsOptions))
// app.use(cors());
var server = http.createServer(app);
var io = require('socket.io')(server, {
  cors: {
    origin: "https://mysterious-citadel-11464-8a0e45efb7c9.herokuapp.com/https://langenheim-a07134ab155c.herokuapp.com",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3101;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

const botName = 'Gallery Hall';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Gallery Hall '+ user.username + "!!!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined our chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: user.username
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    const filter = new Filter()
    if (filter.isProfane(msg)) {
            io.to(user.room).emit('message', formatMessage(botName, 'No bad words here '+ user.username + '!!! Wash your mouth with some soap'));
    }
    else{
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    }

  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/appScript', appScriptRouter);
app.use('/imageScript', imageScriptRouter);
app.use('/callback', profileRouter);
app.use('/artwork', artworkRouter);
app.use('/about', aboutRouter);
app.use('/credits', creditsRouter);
app.use('/login2', loginRouter);
// app.use('/profile', profileRouter);
app.use('/loadUnity',launchRouter);
app.use('/submission',submitRouter);
app.use('/chat',chatRouter);
app.use('/json',jsonRouter);
// app.use(
//   cors({
//    origin: "https://mysterious-citadel-11464-8a0e45efb7c9.herokuapp.com/",
//   })
//  );

const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: '2J_MLL73ZRau4hVOi07x8mc3DOA2KtIizOrVWTrhdGLYD8hLEf9GFR6dmFP5FUNX',
  baseURL: 'https://langenheim-a07134ab155c.herokuapp.com',
  clientID: 'UqJEsDHOoCyWQNb1UXBpM7kZXjP3L4kb',
  issuerBaseURL: 'https://dev-lkgc5j11.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

const { requiresAuth } = require('express-openid-connect');

// THIS IS THE FINAL THING! got rid for now for experiments
app.get('/profile', requiresAuth(), async function(req, res) {
  //res.send(JSON.stringify(req.oidc.user));
  let user = req.oidc.user;
  let art = await data.getArtwork2(user.name);
  res.render('profile', { title: 'The Langenheim', 
                        layout: 'layout',
                        art: art,
                        profile: user });
});

// Route to handle proxying Google Drive links
app.get('/proxy-google-drive', async (req, res) => {
  const { googleDriveLink } = req.query;

  if (!googleDriveLink) {
      return res.status(400).json({ error: 'Google Drive link is required' });
  }

  try {
      // Proxy the request to the Google Drive link
      const response = await axios.get(googleDriveLink, {
          responseType: 'stream', // Ensure response is streamed
          headers: {
              'User-Agent': 'UnityPlayer/5.3.5f1',
              'Accept': '*/*'
          }
      });

      // Pipe the response back to the Unity WebGL client
      response.data.pipe(res);
  } catch (error) {
      console.error('Error proxying Google Drive link:', error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
});


var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {;});
hbs.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.get("/json",function(req,res){
  res.json({"message":"hello"});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//cors handler
app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "https://langenheim-a07134ab155c.herokuapp.com"); // update to match the domain you will make the request from
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
});

// app.get('/', function(req, res, next) {
//   // Handle the get for this route
// });

// app.post('/', function(req, res, next) {
//  // Handle the post for this route
// });

module.exports = app;
