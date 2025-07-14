document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const socket =io();
    const productlist = document.getElementById("product-list");


    if (!form) {
      console.error('No se encontró el formulario con id="form"');
      return;
    }

  
    form.addEventListener('submit', (event) => {
      event.preventDefault(); 

      const product={
        title: form.title.value,
        description: form.description.value,
        code: form.code.value,
        price: form.price.value,
        status: form.status.checked ? "on" : "off",
        stock: form.stock.value,
        category: form.category.value,
        thumbnails: [form.thumbnails.value]
      };

     socket.emit("new-product", product)
     console.log("PRODUCTO EMITIDO DESDE REALTIME.JS");
     form.reset()

   });
   
   socket.on("update-products", (products)=>{
    console.log("RECIBIDOS", product.length, "PRODUCTTOS");

   
  

   })


  form.reset()
})  