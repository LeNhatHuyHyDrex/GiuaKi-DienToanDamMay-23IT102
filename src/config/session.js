const session = require('express-session');
const { MongoStore } = require('connect-mongo');

function configureSession(app) {
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_SESSION_URI || process.env.MONGODB_WRITE_URI,
      collectionName: 'sessions',
      ttl: 86400,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
    },
  }));
}

module.exports = configureSession;
