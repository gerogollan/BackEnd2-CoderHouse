import { Router } from "express";
import CartManager from "../managers/cartManager.js";
import ProductModel from "../models/product.model.js"; 

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error creando carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error buscando carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid} = req.params;
  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  }catch (error){
    console.error("Error en addProductToCart", error);
    if (error.message === "Product not found"){
      return res.status(404).json({ error: "product not found"});
    }
   

    if (error.message === "Cart not found"){
      return res.status(404).json({ error: "cart not found" });
    }
    res.status(400).json({ error: "Error at adding the product in the cart, check the id's" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error eliminando producto del carrito:", error);
    res.status(500).json({ error: "Error eliminando producto del carrito" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error actualizando cantidad:", error);
    res.status(500).json({ error: "Error actualizando cantidad del producto" });
  }
})

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body; // [{ product: pid, quantity: n }, ...]

  try {
    const updatedCart = await cartManager.replaceCartProducts(cid, products);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error reemplazando productos:", error);
    res.status(500).json({ error: "Error reemplazando productos del carrito" });
  }
});


router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const updatedCart = await cartManager.clearCart(cid);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error vaciando carrito:", error);
    res.status(500).json({ error: "Error vaciando carrito" });
  }
});


  // Sumar cantidad
router.post("/:cid/product/:pid/increase", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartManager.addProductToCart(cid, pid);
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).send("Error al aumentar cantidad");
  }
});

// Restar cantidad
router.post("/:cid/product/:pid/decrease", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    const productInCart = cart.products.find(p => p.product._id.toString() === pid);

    if (!productInCart) return res.redirect(`/carts/${cid}`);

    if (productInCart.quantity > 1) {
      await cartManager.updateProductQuantity(cid, pid, productInCart.quantity - 1);
    } else {
      await cartManager.removeProductFromCart(cid, pid);
    }

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).send("Error al disminuir cantidad");
  }
});




export default router;
