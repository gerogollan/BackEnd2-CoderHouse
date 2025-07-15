import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  thumbnails: { type: [String], default: [] }, // Cambio aquí
  code: { type: String, unique: true, required: true },
  stock: { type: Number, required: true },
  category: String,
  status: { type: Boolean, default: true }
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;

