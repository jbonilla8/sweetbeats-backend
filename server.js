const express = require('express');
const authRoutes = require('./routes/auth-routes');
const apiRoutes = require('./routes/api-routes');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// set up cookies session
app.use(
  cookieSession({
    maxAge: process.env.COOKIE_AGE,
    keys: [process.env.COOKIE_KEY]
  })
);

// initialize passport
app.use(passport.initialize());

// passport cookie
app.use(passport.session());

// connect to mongoDB
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to mongoDB.');
  }
);

//set up routes

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/auth', authRoutes);

app.use('/api', apiRoutes);
 
// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 8888;

app.listen(port, () =>
  console.log(
    `Listening on port ${port}. Go to /login to initiate authentication.`
  )
);
