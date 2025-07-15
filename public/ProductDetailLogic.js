document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addToCartForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cid = document.getElementById("cid").value.trim();
    const pid = form.dataset.pid; // ✅ Obtenemos el pid del atributo data

    if (!cid) {
      return alert("Por favor ingresá un ID de carrito.");
    }

    try {
      const res = await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: "POST"
      });

      if (res.ok) {
        alert("✅ Producto agregado al carrito.");
        window.location.href = `/carts/${cid}`;
      } else {
        const error = await res.json();
        alert("❌ Error: " + error.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error inesperado.");
    }
  });
});
