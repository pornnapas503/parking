const mongoose = require('mongoose');
const { mongo, env } = require('./vars');

mongoose.Promise = Promise;

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

if (env === 'development') {
  mongoose.set('debug', true);
}

exports.connect = () => {
  console.log('mongo.uri: ', mongo.uri);
  mongoose.connect(mongo.uri, {
    useNewUrlParser: true,
    connectTimeoutMS: 30000,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  return mongoose.connection;
};
