

import ProductModel from "../models/product.model.js";

export default class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
      lean: true
    };

    let filter = {};
    if (query) {
      filter = {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } }
        ]
      };
    }

    return await ProductModel.paginate(filter, options);
  }

  async getProductById(id) {
    return await ProductModel.findById(id);
  }

  async addProduct(productData) {
    return await ProductModel.create(productData);
  }

  async updateProduct(id, updatedData) {
    return await ProductModel.findByIdAndUpdate(id, updatedData, { new: true });
  }

  async deleteProduct(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}

