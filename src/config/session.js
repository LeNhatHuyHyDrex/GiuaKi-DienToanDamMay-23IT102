const session = require('express-session');
const MongoStore = require('connect-mongo');

function configureSession(app) {
  const sessionUri = process.env.MONGODB_SESSION_URI || process.env.MONGODB_WRITE_URI;
  if (!sessionUri) {
    console.warn('Warning: Neither MONGODB_SESSION_URI nor MONGODB_WRITE_URI is configured.');
    return;
  }

  app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_23IT102',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: sessionUri,
      collectionName: 'sessions',
      ttl: 86400,
      mongoOptions: {
        serverSelectionTimeoutMS: 10000,
      },
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
    },
  }));
}

module.exports = configureSession;
