import mongoose from 'mongoose';

const expectedAtlasHost = 'cluster0.hvtljh4.mongodb.net';

const mongoCache = globalThis.__orangeCarsMongoCache || {
  promise: null
};
globalThis.__orangeCarsMongoCache = mongoCache;

export const getMongoUriDiagnostics = (uri = process.env.MONGODB_URI) => {
  let parsedUri;

  try {
    if (uri) parsedUri = new URL(uri);
  } catch {
    parsedUri = null;
  }

  return {
    envLoaded: Boolean(uri),
    correctProtocol: parsedUri?.protocol === 'mongodb+srv:',
    hostnameCorrect: parsedUri?.hostname === expectedAtlasHost
  };
};

const getMongoConnectionUri = () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI must be configured before the server can start.');
  }

  let parsedUri;

  try {
    parsedUri = new URL(uri);
  } catch {
    throw new Error('MONGODB_URI is not a valid MongoDB connection URI.');
  }

  if (parsedUri.protocol !== 'mongodb+srv:') {
    throw new Error('MONGODB_URI must use the mongodb+srv:// protocol for Atlas.');
  }

  if (parsedUri.hostname !== expectedAtlasHost || parsedUri.port) {
    throw new Error('MONGODB_URI must use the configured MongoDB Atlas hostname.');
  }

  if (!parsedUri.username || !parsedUri.password) {
    throw new Error('MONGODB_URI must include the Atlas database username and password.');
  }

  let username;
  let password;

  try {
    username = decodeURIComponent(parsedUri.username);
    password = decodeURIComponent(parsedUri.password);
  } catch {
    throw new Error('MONGODB_URI contains invalid URL-encoding in its credentials.');
  }

  parsedUri.searchParams.set('authSource', 'admin');

  const credentials = `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`;
  return `${parsedUri.protocol}//${credentials}${parsedUri.host}${parsedUri.pathname}${parsedUri.search}`;
};

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!mongoCache.promise) {
    mongoCache.promise = mongoose.connect(getMongoConnectionUri(), {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000
    })
      .then(() => {
        console.info('[MongoDB] Connected successfully');
        const connection = mongoose.connection;
        return connection;
      })
      .catch((error) => {
        mongoCache.promise = null;
        throw error;
      });
  }

  return mongoCache.promise;
};
