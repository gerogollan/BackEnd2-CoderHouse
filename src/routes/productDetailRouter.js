import { Router } from "express";

import ProductModel from "../models/product.model.js"; // agregamos el modelo

const router = Router(); 

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await ProductModel.findById(pid).lean(); // buscamos el producto

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", {
      product, // pasamos el objeto completo a la vista
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el producto");
  }
});

export default router;