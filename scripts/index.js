'use strict';

// Array de productos
let productos = [
    { id: 1, nombre: 'Auriculares Inalámbricos JBL Tune 510BT', descripcion: 'Auriculares inalámbricos con sonido JBL Pure Bass, hasta 40 horas de reproducción continua y carga rápida. Diseño cómodo y plegable.', precio: 79999, imagen: 'images/auriculares-inalambricos-jbl-tune-510bt.jpg', categoria: 'Auriculares'},
    { id: 2, nombre: 'Cámara Web Logitech C920 HD Pro', descripcion: 'Cámara web Full HD 1080p con enfoque automático, micrófono estéreo y montaje universal para mejorar todas tus videollamadas.', precio: 127799, imagen: 'images/camara-web-logitech-c920-hd-pro.jpg', categoria: 'Camaras'},
    { id: 3, nombre: 'Teclado Inalámbrico Logitech K380', descripcion: 'Teclado Bluetooth multi-dispositivo, compacto y compatible con distintos sistemas operativos. Perfecto para trabajar desde cualquier lugar.', precio: 48979, imagen: 'images/teclado-inalámbrico-logitech-k380.jpg', categoria: 'Teclados'},
    { id: 4, nombre: 'Cámara profesional Canon EOS 90D', descripcion: 'Cámara réflex digital con sensor APS-C de 32.5 megapíxeles, grabación 4K y enfoque automático de alta velocidad. Ideal para fotografía profesional.', precio: 2548999, imagen: 'images/camara-profesional-Canon-EOS-90D.jpg', categoria: 'Camaras'},
    { id: 5, nombre: 'Teclado mecánico Logitech G Pro X', descripcion: 'Teclado mecánico compacto y personalizable con interruptores intercambiables, ideal para jugadores profesionales.', precio: 251499, imagen: 'images/teclado-mecánico-Logitech-G-Pro-X.jpg', categoria: 'Teclados'},
    { id: 6, nombre: 'Auriculares inalámbricos Sony WH-1000XM5', descripcion: 'Auriculares de diadema con cancelación de ruido activa, sonido Hi-Res, y hasta 30 horas de batería para una experiencia de audio envolvente.', precio: 689999, imagen: 'images/auriculares-inalámbricos-Sony WH-1000XM5.jpg', categoria: 'Auriculares'},
    { id: 7, nombre: 'Teclado Razer Huntsman 60% Mini', descripcion: 'Teclado mecánico de 60%, compacto y con switches ópticos Razer, ideal para gamers y usuarios que buscan una experiencia de escritura rápida y precisa.', precio: 137449, imagen: 'images/teclado-Razer-Huntsman-Mini.jpg', categoria: 'Teclados'},
    { id: 8, nombre: 'Cámara compacta Sony Cyber-shot RX100 VII', descripcion: 'Cámara compacta con sensor de 1 pulgada y lente de 24-200mm, ideal para videografía y fotografía de alta calidad en un cuerpo pequeño.', precio: 2899499, imagen: 'images/camara-compacta-Sony-Cyber-shot-RX100-VII.jpg', categoria: 'Camaras'},
    { id: 9, nombre: 'Auriculares gaming HyperX Cloud II', descripcion: 'Auriculares con sonido envolvente 7.1 virtual, micrófono desmontable y diseño de diadema ajustable. Perfectos para gaming.', precio: 139299, imagen: 'images/auriculares-gaming-HyperX-Cloud-II.jpg', categoria: 'Auriculares'},
];

// Clase para manejar el carrito de compras
class Carrito {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    // Agregar producto al carrito
    agregarProducto(producto) {
        const existe = this.productos.find(item => item.id === producto.id);
        if (existe) {
            existe.cantidad++;
        } else {
            this.productos.push({ ...producto, cantidad: 1 });
        }

        this.actualizarCarrito();
    }

    // Eliminar producto del carrito
    eliminarProducto(id) {
        this.productos = this.productos.filter(item => item.id !== id);
        this.actualizarCarrito();
    }

    // Incrementar cantidad de un producto
    incrementarCantidad(id) {
        const producto = this.productos.find(item => item.id === id);
        producto.cantidad++;
        this.actualizarCarrito();
    }

    // Reducir cantidad de un producto
    reducirCantidad(id) {
        const producto = this.productos.find(item => item.id === id);
        if (producto && producto.cantidad > 1) {
            producto.cantidad--;
        } else if (producto && producto.cantidad === 1) {
            this.eliminarProducto(id); // Si llega a 1 y se reduce, se elimina
            return;
        }
        this.actualizarCarrito();
    }

    // Vaciar carrito
    vaciarCarrito() {
        this.productos = [];
        this.actualizarCarrito();
    }

    // Actualizar el carrito en la interfaz y guardar en localStorage
    actualizarCarrito() {
        const totalItems = this.productos.reduce((acc, item) => acc + item.cantidad, 0);
        const totalPrecio = this.productos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        // Actualizar cantidad y total del carrito
        const carritoCantidad = document.querySelector('#carrito .cantidad');
        const carritoTotal = document.querySelector('#carrito .total');

        if (carritoCantidad && carritoTotal) {
            carritoCantidad.textContent = totalItems;
            carritoTotal.textContent = totalPrecio.toFixed(2);
        }

        // Guardar en el localStorage
        localStorage.setItem('carrito', JSON.stringify(this.productos));

        // Actualizar el total en el modal del carrito
        const montoTotalModal = document.getElementById('monto-total');
        if (montoTotalModal) {
            montoTotalModal.textContent = `Total: $${totalPrecio.toFixed(2)}`;
        }

        // Actualizar la lista de productos en el modal del carrito
        this.actualizarModalCarrito();
    }

    // Actualizar el modal con los productos actuales
    actualizarModalCarrito() {
        const contenidoCarrito = document.getElementById('contenido-carrito');
        contenidoCarrito.innerHTML = ''; // Limpiar el contenido antes de volver a cargarlo

        // Si el carrito está vacío...
        if (this.productos.length === 0) {
            const mensajeVacio = document.createElement('p');
            mensajeVacio.textContent = 'No hay ningún producto en el carrito.';
            contenidoCarrito.appendChild(mensajeVacio);
        } else {
            // Sino...
            this.productos.forEach(producto => {
                const itemCarrito = document.createElement('li');
                itemCarrito.classList.add('item-carrito');
                
                // Productos agregados al carrito
                const nombre = document.createElement('h3');
                nombre.textContent = producto.nombre;

                const precio = document.createElement('p');
                precio.textContent = `$${producto.precio}`;

                const botonRestar = document.createElement('button');
                botonRestar.textContent = '-';
                botonRestar.addEventListener('click', () => this.reducirCantidad(producto.id));

                const cantidad = document.createElement('p');
                cantidad.id = 'cantidad-item';
                cantidad.textContent = `${producto.cantidad}`;

                const botonSumar = document.createElement('button');
                botonSumar.textContent = '+';
                botonSumar.addEventListener('click', () => this.incrementarCantidad(producto.id));

                const subtotal = document.createElement('p');
                subtotal.textContent = `$${producto.precio * producto.cantidad}`;

                const botonEliminar = document.createElement('button');
                botonEliminar.textContent = 'X';
                botonEliminar.setAttribute('data-id', producto.id);
                botonEliminar.classList.add('eliminar-producto');

                itemCarrito.appendChild(nombre);
                itemCarrito.appendChild(precio);
                itemCarrito.appendChild(botonRestar);
                itemCarrito.appendChild(cantidad);
                itemCarrito.appendChild(botonSumar);
                itemCarrito.appendChild(subtotal);
                itemCarrito.appendChild(botonEliminar);

                contenidoCarrito.appendChild(itemCarrito);

                // Agregar evento para eliminar el producto
                itemCarrito.querySelector('.eliminar-producto').addEventListener('click', (e) => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    this.eliminarProducto(id);
                });
            });
        }
    }

    mostrarCheckout() {
        const modalContenido = document.getElementById('modal-contenido');
        modalContenido.innerHTML = ''; // Limpiar el contenido 

        const titulo = document.createElement('h2');
        titulo.textContent = 'Checkout';
        modalContenido.appendChild(titulo);
        
        const formulario = document.createElement('form');
        formulario.id = 'form-checkout';
        
        const campos = [
            { label: 'Nombre completo', id: 'nombre', type: 'text', required: true },
            { label: 'Teléfono', id: 'telefono', type: 'tel', required: true },
            { label: 'Email', id: 'email', type: 'email', required: true },
            { label: 'Domicilio', id: 'domicilio', type: 'text', required: true },
            { label: 'Fecha de entrega', id: 'fecha-entrega', type: 'date', required: true },
        ];
        
        campos.forEach(campo => {
            const label = document.createElement('label');
            label.setAttribute('for', campo.id);
            label.textContent = campo.label;
    
            const input = document.createElement('input');
            input.id = campo.id;
            input.name = campo.id;
            input.type = campo.type;
            if (campo.required) input.required = true;
    
            formulario.appendChild(label);
            formulario.appendChild(input);
        });
        
        const labelMetodoPago = document.createElement('label');
        labelMetodoPago.setAttribute('for', 'metodo-pago');
        labelMetodoPago.textContent = 'Método de pago';
    
        const selectMetodoPago = document.createElement('select');
        selectMetodoPago.id = 'metodo-pago';
        selectMetodoPago.name = 'metodo-pago';
        selectMetodoPago.required = true;
    
        const opcionesMetodoPago = [
            { value: '', text: 'Seleccionar' },
            { value: 'credito', text: 'Tarjeta de crédito' },
            { value: 'debito', text: 'Tarjeta de débito' },
            { value: 'efectivo', text: 'Efectivo' },
        ];
    
        opcionesMetodoPago.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion.value;
            option.textContent = opcion.text;
            selectMetodoPago.appendChild(option);
        });
    
        formulario.appendChild(labelMetodoPago);
        formulario.appendChild(selectMetodoPago);
        
        const divCuotas = document.createElement('div');
        divCuotas.id = 'opciones-cuotas';
        divCuotas.style.display = 'none';
    
        const labelCuotas = document.createElement('label');
        labelCuotas.setAttribute('for', 'cuotas');
        labelCuotas.textContent = 'Cuotas';
    
        const selectCuotas = document.createElement('select');
        selectCuotas.id = 'cuotas';
        selectCuotas.name = 'cuotas';
    
        const opcionesCuotas = [
            { value: '1', text: '1 cuota sin interés' },
            { value: '3', text: '3 cuotas sin interés' },
            { value: '6', text: '6 cuotas sin interés' },
            { value: '12', text: '12 cuotas sin interés' },
        ];
    
        opcionesCuotas.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion.value;
            option.textContent = opcion.text;
            selectCuotas.appendChild(option);
        });
    
        divCuotas.appendChild(labelCuotas);
        divCuotas.appendChild(selectCuotas);
        formulario.appendChild(divCuotas);
    
        // Mostrar cuotas solo si el método de pago es tarjeta de crédito
        selectMetodoPago.addEventListener('change', () => {
            divCuotas.style.display = selectMetodoPago.value === 'credito' ? 'block' : 'none';
        });
    
        // Botones del formulario
        const divBotones = document.createElement('div');
        divBotones.id = 'botones-checkout';
    
        const botonCancelar = document.createElement('button');
        botonCancelar.type = 'button';
        botonCancelar.id = 'cancelar-compra';
        botonCancelar.textContent = 'Cancelar';
    
        const botonConfirmar = document.createElement('button');
        botonConfirmar.type = 'submit';
        botonConfirmar.id = 'confirmar-compra';
        botonConfirmar.textContent = 'Confirmar';
    
        divBotones.appendChild(botonCancelar);
        divBotones.appendChild(botonConfirmar);
        formulario.appendChild(divBotones);
    
        modalContenido.appendChild(formulario);
    
        // Evento para cancelar el checkout
        botonCancelar.addEventListener('click', () => {
            document.getElementById('modal-carrito').style.display = 'none';
        });
    
        // Evento para confirmar la compra
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
    
            const datosCliente = {
                nombre: formulario.nombre.value,
                telefono: formulario.telefono.value,
                email: formulario.email.value,
                lugarEntrega: formulario['domicilio'].value,
                fechaEntrega: formulario['fecha-entrega'].value,
                metodoPago: formulario['metodo-pago'].value,
                cuotas: formulario['cuotas'] ? formulario['cuotas'].value : '1',
            };
    
            if (!datosCliente.nombre || !datosCliente.telefono || !datosCliente.email || !datosCliente.lugarEntrega || !datosCliente.fechaEntrega || !datosCliente.metodoPago) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }
    
            // Mostrar mensaje de confirmación de compra
            while (modalContenido.firstChild) {
                modalContenido.removeChild(modalContenido.firstChild);
            }

            const mensajeConfirmacion = document.createElement('div');
            mensajeConfirmacion.id = 'mensaje-confirmacion';
    
            const tituloExito = document.createElement('h3');
            tituloExito.textContent = `¡Muchas gracias por tu compra ${datosCliente.nombre}!`;
    
            const descripcionExito = document.createElement('p');
            descripcionExito.textContent = `Podrás hacer el seguimiento del envío con el código enviado a tu mail: ${datosCliente.email}`;
    
            modalContenido.appendChild(tituloExito);
            modalContenido.appendChild(descripcionExito);
    
            const botonCerrar = document.createElement('button');
            botonCerrar.textContent = 'Cerrar';
            botonCerrar.addEventListener('click', () => {
                const modal = document.getElementById('modal-carrito');
                if (modal) modal.style.display = 'none';
                carrito.vaciarCarrito();
            });
    
            modalContenido.appendChild(mensajeConfirmacion);
            mensajeConfirmacion.appendChild(botonCerrar);
        });
    }
    
}

// Inicializar carrito
const carrito = new Carrito();

// Mostrar el modal 
document.getElementById('ver-carrito').addEventListener('click', () => {
    const modal = document.getElementById('modal-carrito');
    modal.style.display = 'flex'; 
    carrito.actualizarCarrito(); 
});

// Cerrar el modal
document.getElementById('cerrar-modal').addEventListener('click', () => {
    document.getElementById('modal-carrito').style.display = 'none';
});

// Vaciar el carrito
document.getElementById('vaciar-carrito').addEventListener('click', () => {
    carrito.vaciarCarrito();
});

// Mostrar checkout
document.getElementById('finalizar-compra').addEventListener('click', () => {
    if (carrito.productos.length === 0) {
        return;
    }
    carrito.mostrarCheckout();
});  

// Cargar productos
function cargarProductos(listaProductos = productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';

    listaProductos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto');

        const img = document.createElement('img');
        img.setAttribute('src', producto.imagen);
        img.setAttribute('alt', producto.nombre);
        card.appendChild(img);

        const categoria = document.createElement('p');
        const categoriaTexto = document.createTextNode(producto.categoria);
        categoria.className += 'categoria';
        categoria.appendChild(categoriaTexto);
        card.appendChild(categoria);

        const nombre = document.createElement('h2');
        const nombreTexto = document.createTextNode(producto.nombre);
        nombre.appendChild(nombreTexto);
        card.appendChild(nombre);

        const descripcion = document.createElement('p');
        const descripcionTexto = document.createTextNode(producto.descripcion);
        descripcion.appendChild(descripcionTexto);
        card.appendChild(descripcion);

        const precio = document.createElement('p');
        const precioTexto = document.createTextNode(`$${producto.precio}`);
        const precioFuerte = document.createElement('strong');
        precioFuerte.appendChild(precioTexto);
        precio.appendChild(precioFuerte);
        card.appendChild(precio);

        const boton = document.createElement('button');
        const botonTexto = document.createTextNode('Agregar al carrito');
        boton.appendChild(botonTexto);
        boton.setAttribute('data-id', producto.id);
        card.appendChild(boton);

        // Agregar evento al botón de agregar al carrito
        boton.addEventListener('click', () => {
            carrito.agregarProducto(producto);
        });

        contenedor.appendChild(card);
    });
}

let productosFiltrados = productos; // Esta variable guarda la lista de productos filtrados
let ordenActual = true; // Esta variable guarda el orden actual

// Filtrar productos por categoría
document.getElementById('filtrar-por').addEventListener('change', (e) => {
    const categoria = e.target.value;
    if (categoria === 'todos') {
        productosFiltrados = productos;
    } else {
        productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    }

    // Aplicar el orden actual después de filtrar
    if (ordenActual === 'precio-ascendente') {
        ordenarPorPrecio(true);
    } else if (ordenActual === 'precio-descendente') {
        ordenarPorPrecio(false);
    } else {
        ordenarPorRelevancia();
    }
});

// Ordenar productos por...
document.getElementById('ordenar-por').addEventListener('change', (e) => {
    const orden = e.target.value;
    ordenActual = orden; 

    if (orden === 'precio-ascendente') {
        ordenarPorPrecio(true);
    } else if (orden === 'precio-descendente') {
        ordenarPorPrecio(false);
    } else if (orden === 'mas-relevante') {
        ordenarPorRelevancia();
    }
});

// Ordenar los productos por precio
function ordenarPorPrecio(ascendente = true) {
    productosFiltrados.sort((a, b) => (ascendente ? a.precio - b.precio : b.precio - a.precio));
    cargarProductos(productosFiltrados); // Cargar productos ordenados
}

// Ordenar los productos por mayor relevancia (se hace por orden de ID ascendente)
function ordenarPorRelevancia() {
    productosFiltrados.sort((a, b) => a.id - b.id);
    cargarProductos(productosFiltrados); // Cargar productos ordenados
}

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    carrito.actualizarCarrito();
});