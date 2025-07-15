
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');
  if (!form) {
    console.error('No se encontró el formulario con id="productForm"');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log("formulario recibido y enviado");

    const formData = new FormData(event.target);
    const productData = {};

    formData.forEach((value, key) => {
      productData[key] = value;
    });

    // Convertir thumbnails a array
    if (productData.thumbnails) {
      if (productData.thumbnails.indexOf(',') !== -1) {
        productData.thumbnails = productData.thumbnails.split(',').map(s => s.trim());
      } else {
        productData.thumbnails = [productData.thumbnails];
      }
    } else {
      productData.thumbnails = [];
    }

    productData.price = Number(productData.price);
    productData.stock = Number(productData.stock);

    try {
      console.log("Datos del producto a enviar:", productData);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const newProduct = await response.json();
        console.log('Producto agregado:', newProduct);
         window.location.reload()
        
      } else {
        
        const text = await response.text();
        try {
          const json = JSON.parse(text);
          console.error('Error al agregar el producto:', json.error);
          alert('Error: ' + json.error);
        } catch (err) {
          console.error('Respuesta no válida:', text);
          alert('Error desconocido al agregar el producto');
        }
      }
    } catch (error) {
      alert('Hubo un error al intentar agregar el producto');
      console.error(error);
    }

    form.reset();
  });

});
