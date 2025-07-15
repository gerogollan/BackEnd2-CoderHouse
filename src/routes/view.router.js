import { Router } from "express";
import ProductModel from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    let filter = {};
    if (query) {
      filter = {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
      lean: true,
    };

    const result = await ProductModel.paginate(filter, options);

    res.render("home", {
      products: result, query,           // Solo el array de productos
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
      },
      query,
      sort,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error cargando productos");
  }
});


router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid).populate("products.product").lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cart", { cart });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el carrito");
  }
});

export default router;


