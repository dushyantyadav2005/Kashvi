import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['styling', 'fabric-care', 'fashion-trends'], required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Blog', BlogSchema);