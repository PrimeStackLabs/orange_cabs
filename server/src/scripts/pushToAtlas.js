const mongoose = require('mongoose');

// Source local MongoDB
const LOCAL_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/skb_travels';

// Target Atlas MongoDB URI passed as argument or env var
const TARGET_URI = process.argv[2] || process.env.ATLAS_MONGODB_URI;

if (!TARGET_URI) {
  console.error('\n[Error] Please provide your MongoDB Atlas connection string:');
  console.error('Usage: node server/src/scripts/pushToAtlas.js "<your_atlas_connection_string>"\n');
  process.exit(1);
}

async function migrate() {
  console.log(' Connecting to local MongoDB...');
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log(' Connected to local database: skb_travels');

  console.log(' Connecting to MongoDB Atlas...');
  const atlasConn = await mongoose.createConnection(TARGET_URI).asPromise();
  console.log(' Connected to MongoDB Atlas target cluster');

  const collections = await localConn.db.listCollections().toArray();
  console.log(`\n Found ${collections.length} collections to transfer:\n`);

  for (const col of collections) {
    const colName = col.name;
    if (colName.startsWith('system.')) continue;

    const docs = await localConn.db.collection(colName).find({}).toArray();
    console.log(`📦 Collection [${colName}]: found ${docs.length} documents locally.`);

    if (docs.length > 0) {
      const targetCol = atlasConn.db.collection(colName);
      
      // Clear target collection first to avoid duplicates
      await targetCol.deleteMany({});
      
      // Insert docs
      const result = await targetCol.insertMany(docs);
      console.log(`   Successfully pushed ${result.insertedCount} documents to Atlas [${colName}].`);
    } else {
      // Ensure empty collection exists
      await atlasConn.db.createCollection(colName).catch(() => {});
      console.log(`   Created empty collection [${colName}] on Atlas.`);
    }
  }

  console.log('\n All collections & data successfully migrated to MongoDB Atlas!');
  
  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('\n Migration failed:', err.message);
  process.exit(1);
});
