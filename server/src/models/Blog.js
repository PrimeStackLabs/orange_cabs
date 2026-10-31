import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Orange Cab Editorial' },
  category: { type: String, default: 'Travel Tips' },
  image: { type: String, required: true },
  readTime: { type: String, default: '4 min read' },
  published: { type: Boolean, default: true },
  tags: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
