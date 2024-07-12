let productosCarrito = loadCarritoFromLocalStorage();
let productos = [];
function addToCarrito(productoid, cantidad) {
    const producto = productos.find((p => p.id === productoid));
    if(!producto){
        mensajeDeError(productoid)
        return;
    };
    const carritoItem = productosCarrito.find(item => item.id === productoid);
    const disponibilidad = carritoItem ? producto.stock - carritoItem.cantidad : producto.stock
    if(cantidad > disponibilidad){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "No hay Stock",
            showConfirmButton: false,
            timer: 1500
          });
        return;  
    }
    if(carritoItem) {
        carritoItem.cantidad += cantidad;
        carritoItem.subTotal = carritoItem.cantidad * carritoItem.precio;
    }
    else{
        productosCarrito.push(
            {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                stock: producto.stock,
                cantidad: cantidad,
                subTotal: cantidad * producto.precio
            }
        )
    }
    saveCarritoToLocalStorage();
    renderCarrito();
    Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Agregaste un Producto al carrito",
        showConfirmButton: false,
        timer: 1500
      });  
}
function renderProductos () {
    const productoLista = document.getElementById('lista');
    productoLista.innerHTML = '';
    const peticion = async () => {
        const respuesta = await fetch ('/productos.json');
        const datos = await respuesta.json ();
        productos = datos;
        datos.forEach(producto => {
            const productoDiv = document.createElement('div');
                productoDiv.innerHTML = `
                <div class= "cart">
                   <img src= ${producto.imagen} alt=${producto.nombre}</img>
                   <h3>${producto.nombre}</h3>
                   <p>Precio: $${producto.precio}</p>
                   <p>Stock: ${producto.stock}</p>
                   <button onclick="addToCarrito(${producto.id}, 1)">Agregar Producto</button>
                </div>    
            `;
                productoLista.appendChild(productoDiv);
        });
    };
    peticion();
};
function renderCarrito (){
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = '';
    productosCarrito.forEach((item, index) => {
        const carritoItemDiv = document.createElement('div');
        carritoItemDiv.innerHTML = `
           <div class = "cart">
              <img src= ${item.imagen} alt=${item.nombre}</img>
              <h3>${item.nombre}</h3>
              <p>Seleccionadas: ${item.cantidad}</p>
              <p>Precio: $${item.subTotal}</p>
              <button onclick="eliminarCarrito(${index})">Comprar</button>
           </div>   
        `;
        carritoDiv.appendChild(carritoItemDiv);
    });
};

function saveCarritoToLocalStorage () {
    localStorage.setItem('carrito', JSON.stringify(productosCarrito));
}
function loadCarritoFromLocalStorage () {
    const carritoData = localStorage.getItem('carrito');
    return carritoData ? JSON.parse(carritoData) :[];
}
function eliminarCarrito(index) {
    productosCarrito.splice(index, 1);
    Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Gracias por su compra",
        showConfirmButton: false,
        timer: 1500
      });
    const subir = (subirDeCategoria) => {
       return new Promise((resolve, reject) => {
           setTimeout(() => {
            subirDeCategoria ? resolve ("Subiste de Nivel") : reject ("No subiste de Nivel");
           }, 1000)
        });
    };
    subir(true)
    .then((res) => {
        Toastify({

            text: res,
            
            duration: 3000
            
            }).showToast();
    })
    .catch((error) => {
        document.getElementById('finalizar').innerHTML = error;
    })
    .finally(() => {
        document.getElementById('finalizar').innerText = "Gracias Por su compra !!!";
    });
    saveCarritoToLocalStorage();
    renderCarrito();
}
document.addEventListener('DOMContentLoaded', () => {
    renderProductos();
    renderCarrito();
});