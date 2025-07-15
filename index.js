import express from "express";
import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/cart.router.js";
import productDetailRouter from "./src/routes/productDetailRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import viewRouter from "./src/routes/view.router.js";
import mongoose from "mongoose";
import exphbs from 'express-handlebars';

const app = express();
const PORT = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



mongoose.connect('mongodb+srv://gerogollan123:gerogollan123@cluster0.soppn4w.mongodb.net/mi_base?retryWrites=true&w=majority')
  .then(() => console.log('Conectado a MongoDB' , mongoose.connection.name))
  .catch(err => console.error('Error conectando a Mongo', err))

//middleware
app.use(express.json()); //configuracion de express para poder usar json y urlencoded
app.use(express.urlencoded({ extended: true }));


//configuracion de handlebars

app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  helpers: {
    eq: (a, b) => a === b
  }
}));


app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/src/views"));
app.use(express.static("public")); //para psoder usar archivos estaticos como css, js, img, etc




//fin de configuracion de handlebarsÑ


//rutas
app.use("/api/products", productsRouter); 
app.use("/api/carts", cartsRouter); 
app.use("/", viewRouter) 
app.use("/product", productDetailRouter)


app.listen(PORT, () => {
  console.log(`Server working on port | http://localhost:${PORT} `);
});

