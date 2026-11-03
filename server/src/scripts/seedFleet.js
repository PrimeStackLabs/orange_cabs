import 'dotenv/config';
import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';
import defaultVehicles from '../data/defaultVehicles.js';
import { connectDB } from '../config/db.js';

try {
  await connectDB();

  const result = await Vehicle.bulkWrite(
    defaultVehicles.map((vehicle) => ({
      updateOne: {
        filter: { registrationNumber: vehicle.registrationNumber },
        update: { $setOnInsert: vehicle },
        upsert: true
      }
    }))
  );

  console.log(`[Fleet] Added ${result.upsertedCount} missing default vehicles. Existing vehicles were left unchanged.`);
} finally {
  await mongoose.disconnect();
}
