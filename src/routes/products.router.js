import { Router } from "express";
import ProductModel from "../models/product.model.js";
import ProductManager from "../managers/productManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;
    const query = req.query.query || null; 

    let filter = {};
    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true"; 
      } else {
        filter.category = query; 
      }
    }

    const options = {
      page,
      limit,
      lean: true,
    };

    if (sort) {
      options.sort = { price: sort };
    }

    const result = await ProductModel.paginate(filter, options);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
    const makeLink = (pageNum) =>
      `${baseUrl}?limit=${limit}&page=${pageNum}${sort ? `&sort=${req.query.sort}` : ""}${query ? `&query=${query}` : ""}`;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? makeLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? makeLink(result.nextPage) : null,
    });
  } catch (error) {
    console.error("Error en GET /api/products:", error);
    res.status(500).json({ status: "error", error: "Error al obtener productos" });
  }
});

// Ruta POST para crear productos
router.post("/", async (req, res) => {
  try {
    console.log("Recibido:", req.body);

    const existing = await ProductModel.findOne({ code: req.body.code });
    if (existing) {
      return res.status(400).json({ error: "El código ya existe. Usá uno distinto." });
    }

    // Validar y convertir tipos si llegan como string
    req.body.price = Number(req.body.price);
    req.body.stock = Number(req.body.stock);

    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
    
  } catch (error) {
    console.error("Error en POST /api/products:", error);
    res.status(500).json({ error: "Error al agregar el producto" }); 
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await productManager.deleteProduct(pid);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});


export default router;
