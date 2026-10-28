const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/skb_travels';
const BACKUP_DIR = path.join(__dirname, '../../../database_backup');

async function exportDb() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const conn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('Connected to local MongoDB');

  const collections = await conn.db.listCollections().toArray();
  for (const c of collections) {
    if (c.name.startsWith('system.')) continue;
    const docs = await conn.db.collection(c.name).find({}).toArray();
    const filePath = path.join(BACKUP_DIR, `${c.name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8');
    console.log(`Exported ${docs.length} records from [${c.name}] -> ${filePath}`);
  }

  await conn.close();
  console.log('All local collections exported successfully to database_backup folder!');
}

exportDb().catch(console.error);
