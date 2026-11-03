import 'dotenv/config';
import mongoose from 'mongoose';
import Service from '../models/Service.js';
import defaultServices from '../data/defaultServices.js';
import { connectDB } from '../config/db.js';

try {
  await connectDB();

  const result = await Service.bulkWrite(
    defaultServices.map((service) => ({
      updateOne: {
        filter: { slug: service.slug },
        update: { $setOnInsert: service },
        upsert: true
      }
    }))
  );

  console.log(`[Services] Added ${result.upsertedCount} missing default services. Existing services were left unchanged.`);
} finally {
  await mongoose.disconnect();
}
