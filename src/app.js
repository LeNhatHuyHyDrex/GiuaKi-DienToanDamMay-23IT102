require('dotenv').config();

const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const configureSession = require('./config/session');
const bookRoutes = require('./routes/bookRoutes');

const required = ['MSSV', 'FULL_NAME', 'MONGODB_READ_URI', 'MONGODB_WRITE_URI', 'SESSION_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) console.warn(`Missing environment variables: ${missing.join(', ')}`);

const app = express();
app.set('trust proxy', 1);
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
configureSession(app);
app.use('/', bookRoutes);

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}
module.exports = app;
