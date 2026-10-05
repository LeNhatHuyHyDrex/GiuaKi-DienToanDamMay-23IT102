const mongoose = require('mongoose');

const readConnection = mongoose.createConnection(process.env.MONGODB_READ_URI, {
  serverSelectionTimeoutMS: 10000,
});

const writeConnection = mongoose.createConnection(process.env.MONGODB_WRITE_URI, {
  serverSelectionTimeoutMS: 10000,
});

for (const [name, connection] of [['READ', readConnection], ['WRITE', writeConnection]]) {
  connection.on('connected', () => console.log(`${name} MongoDB connection ready`));
  connection.on('error', (error) => console.error(`${name} MongoDB error:`, error.message));
}

module.exports = { readConnection, writeConnection };
