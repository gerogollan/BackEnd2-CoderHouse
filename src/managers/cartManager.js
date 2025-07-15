import Cart from '../models/cart.model.js'; // ruta según tu proyecto
import ProductModel from '../models/product.model.js'; 

class CartManager {
  async createCart() {

    const newCart = new Cart({ products: [] });
    await newCart.save();
    console.log("carrito creado", newCart);
    
    return newCart;
  }

  async getCartById(cid) {
    return Cart.findById(cid).populate('products.product').lean();
  }

  async addProductToCart(cid, pid) {

      const productExist = await ProductModel.findById(pid);
      if (!productExist) {
        throw new Error('Product not found');
      }



    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error("Cart not found");

  cart.products = cart.products.filter(p => p.product.toString() !== productId);
  await cart.save();
  return cart;




  
}
 async updateProductQuantity(cartId, productId, quantity) {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error("Cart not found");

  const productInCart = cart.products.find(p => p.product.toString() === productId);
  if (!productInCart) throw new Error("Product not in cart");

  productInCart.quantity = quantity;
  await cart.save();
  return cart;
}
async replaceCartProducts(cartId, newProducts) {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error("Cart not found");

  cart.products = newProducts;
  await cart.save();
  return cart;
}


async clearCart(cartId) {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error("Cart not found");

  cart.products = [];
  await cart.save();
  return cart;
}

}

export default CartManager;
