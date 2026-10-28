const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uris = [
  'mongodb://127.0.0.1:27017/skb_travels',
  'mongodb+srv://HMS:PrimePro%40749822@cluster0.hvtljh4.mongodb.net/skb_tours_and_travels?retryWrites=true&w=majority'
];

async function updatePassword() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin@123', salt);

  for (const uri of uris) {
    try {
      const conn = await mongoose.createConnection(uri).asPromise();
      const res = await conn.db.collection('adminusers').updateOne(
        { email: 'admin@skbtravels.com' },
        { 
          $set: { 
            password: hashedPassword,
            isActive: true 
          } 
        },
        { upsert: true }
      );
      const hostLabel = uri.includes('@') ? uri.split('@')[1] : 'local 127.0.0.1:27017';
      console.log(`Updated admin@skbtravels.com password on [${hostLabel}] (modified: ${res.modifiedCount}, upserted: ${res.upsertedCount})`);
      await conn.close();
    } catch (err) {
      console.error(`Error on ${uri}:`, err.message);
    }
  }
}

updatePassword().then(() => {
  console.log('Admin password updated to admin@123 successfully!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
