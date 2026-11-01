import mongoose from 'mongoose';

const mongoCache = globalThis.__orangeCarsMongoCache || {
  promise: null
};
globalThis.__orangeCarsMongoCache = mongoCache;

export const connectDB = async () => {
  const isProductionRuntime = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const uri = process.env.MONGODB_URI
    || (isProductionRuntime ? '' : 'mongodb://127.0.0.1:27017/orangecab');

  if (!uri) {
    const error = new Error('MONGODB_URI must be configured before database-backed API requests can be served.');
    error.statusCode = 503;
    throw error;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!mongoCache.promise) {
    mongoCache.promise = mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000
    })
      .then((connection) => {
        console.info(`[MongoDB] Connected successfully: ${connection.connection.host}/${connection.connection.name}`);
        return connection;
      })
      .catch((error) => {
        mongoCache.promise = null;
        throw error;
      });
  }

  return mongoCache.promise;
};
