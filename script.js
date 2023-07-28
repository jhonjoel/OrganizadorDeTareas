const FECHA = document.getElementById('inputFecha');
const DESCRIP_TAREA = document.getElementById('descripTarea'); //tomar elemento por id
const NOM_TAREA = document.getElementById('nombreTarea');
const BTN_AGREGAR = document.getElementById('formAgregar');
const BTN_TEMA = document.getElementById('btnTema');
const ELEMENTS = document.getElementById("elements");
const FORM_AGREGAR = document.getElementById("agregarTarea");
const BTN_CERRAR = document.getElementById("btnCerrar");
let contadorID = 0;
let tema;
let fechaInicio = new Date();
let datosGuardados = [];
cargarDesdeLocalStorage();

// Mediante este event listener desplegamos el formulario para crear una tarea
FORM_AGREGAR.addEventListener('click', () => {
    setearFechaMinima();
    document.getElementById('contenedorFormulario').style.display = 'block';
    NOM_TAREA.focus();
    BTN_CERRAR.addEventListener('click', () => {
        document.getElementById('contenedorFormulario').style.display = 'none';
    })
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            document.getElementById('contenedorFormulario').style.display = 'none';

        }
    });
});

// Mediante este event listener podremos cambiar de tema cada vez que hacemos click
// en nuestro boton de cambiar tema
BTN_TEMA.addEventListener('click', () => {
    cambiarTema();
});

// Este event listener muestra el mensaje listo una vez que 
// se haya hecho el submit correctamente.
BTN_AGREGAR.addEventListener('submit', (evt) => {
    evt.preventDefault();
    agregarTarea(FECHA.value, DESCRIP_TAREA.value, NOM_TAREA.value);
    mostrarMensajeListo();
})

// Mediante esta funcion declaramos todas las variables que necesitamos
// y convertimos las fechas
// para luego guardar los datos
function agregarTarea(fecha, descripTarea, nombre) {
    fechaFin = new Date(fecha);
    let faltanDias = Math.abs(fechaFin - fechaInicio);
    faltanDias = Math.floor(faltanDias / (1000 * 3600 * 24));
    faltanHoras = fechaFin.getTime() - fechaInicio.getTime();
    faltanHoras = (Math.floor(faltanHoras / 3600000)) - (faltanDias * 24);
    guardarDatos(nombre, descripTarea, faltanDias, faltanHoras);
    FECHA.value = '';
    DESCRIP_TAREA.value = '';
    NOM_TAREA.value = '';
    document.getElementById('contenedorFormulario').style.display = 'none';
}

// Con esta funcion guardamos los datos que obtenemos de nuestros inputs en un arreglo
// y luego mediante la funcion actualizamos nuestro local storage.
function guardarDatos(nombre, descripTarea, fecha, horas) {
    let datos = {
        Id: contadorID,
        Nombre: nombre,
        Descripcion: descripTarea,
        Dias_Restantes: fecha,
        Horas_Restantes: horas,
    }
    datosGuardados.push(datos);
    contadorID++;
    actualizarLocalStorage();
    mostrarDato(datos);
}

// Esta funcion se utiliza al refrescar la pagina, para cargar los datos
// desde el localStorage, pregunta si el localStorage esta cargado y si es asi entonces muestra en pantalla
// los elementos
function cargarDesdeLocalStorage() {
    if (JSON.parse(localStorage.getItem('Datos')) !== null && JSON.parse(localStorage.getItem('ContadorID')) !== null) {
        datosGuardados = JSON.parse(localStorage.getItem('Datos'));
        contadorID = JSON.parse(localStorage.getItem('ContadorID'));
    }
    if (JSON.parse(localStorage.getItem('Tema')) !== null) {
        tema = JSON.parse(localStorage.getItem('Tema'));

    } else {
        tema = true;
        guardarTemaEnLS();
    }
    ponerTema();
    imprimirTareasEnPantalla();
}

// Mediante esta funcion imprimimos en pantalla las tareas guardadas que agregamos
function imprimirTareasEnPantalla() {
    datosGuardados.forEach(elements => {
        mostrarDato(elements);
    });
}

// Mediante esta funcion guardamos los datos en nuestro localStorage
function actualizarLocalStorage() {
    localStorage.setItem('Datos', JSON.stringify(datosGuardados));
    localStorage.setItem('ContadorID', JSON.stringify(contadorID));
}

// Esta funcion recibe "datos" como parametro, es el encargado de imprimir
// en nuestra web las tareas que vamos agregando
function mostrarDato(datos) {
    const DIV = document.createElement("div");
    const P_ELMNT = document.createElement("p");
    const TITULO = document.createElement("h3");
    const DESCRIPCION = document.createElement("h4");
    const BTN_BORRAR = document.createElement("button");
    DIV.className = "datosMostrados";
    BTN_BORRAR.id = datos.Id;
    DIV.id = datos.Id;
    TITULO.innerHTML = `${datos.Nombre}`;
    DESCRIPCION.innerHTML = `${datos.Descripcion}`;
    P_ELMNT.innerHTML = `Vence en ${datos.Dias_Restantes} dias y <br/> ${datos.Horas_Restantes} hs.`
    BTN_BORRAR.innerHTML = '<svg class="colorsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M7 6V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5zm6.414 8l1.768-1.768-1.414-1.414L12 12.586l-1.768-1.768-1.414 1.414L10.586 14l-1.768 1.768 1.414 1.414L12 15.414l1.768 1.768 1.414-1.414L13.414 14zM9 4v2h6V4H9z"/></svg>'
    DIV.appendChild(TITULO);
    DIV.appendChild(DESCRIPCION);
    DIV.appendChild(P_ELMNT);
    DIV.appendChild(BTN_BORRAR);
    BTN_BORRAR.onclick = eliminarID;
    // DIV.onclick = eliminarID;
    let inicial = document.querySelector('.datosMostrados');
    ELEMENTS.insertBefore(DIV, inicial);
}

// Con esta funcion removemos de pantalla el elemento seleccionado
// mostrando un mensaje de confirmacion, si se confirma, se borra
// y si no se mantiene en pantalla.
function eliminarID() {
    Swal.fire({
        title: 'Deseas eliminar la tarea?',
        text: "No podrás revertir los cambios!",
        icon: 'warning',
        background: "var(--color-Fondo)",
        color: "var(--color-Letras)",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminar(this.id);
            const divID = document.getElementById(this.id);
            ELEMENTS.removeChild(divID);
            Swal.fire({
                title: 'Tarea Eliminada',
                background: "var(--color-Fondo)",
                color: "var(--color-Letras)",
            })
        }
    })
}

// Con esta funcion podemos eliminar la tarea que seleccionamos
// mediante un ID y luego guardamos en nuestro LocalStorage
function eliminar(id) {
    let index = -1;
    for (let este = 0; este < datosGuardados.length; este++) {
        if (datosGuardados[este].Id == id) {
            index = este;
        }
    }
    datosGuardados.splice(index, 1);
    actualizarLocalStorage();
}

// Esta funcion utiliza un script de Sweet Alert y mediante el 
// creamos mensajes esteticos
function mostrarMensajeListo() {
    Swal.fire({
        icon: 'success',
        title: 'La tarea se agregó correctamente',
        showConfirmButton: false,
        timer: 2000,
        background: "var(--color-Fondo)",
        color: "var(--color-Letras)",
    })
}

// Mediante esta funcion seteamos los colores para el tema Claro
function temaClaro() {
    document.documentElement.style.setProperty("--color-Fondo", "#e7e7e7");
    document.documentElement.style.setProperty("--color-Header", "#fff");
    document.documentElement.style.setProperty("--color-Letras", "#333");
    document.documentElement.style.setProperty("--color-Sombras", "#000000");
}

// Mediante esta funcion seteamos los colores para el tema Oscuro
function temaOscuro() {
    document.documentElement.style.setProperty("--color-Fondo", "#121212");
    document.documentElement.style.setProperty("--color-Header", "#333");
    document.documentElement.style.setProperty("--color-Letras", "#fff");
    document.documentElement.style.setProperty("--color-Sombras", "#ffffff");
}

// Mediante esta funcion cambiamos el tema, y guardamos en nuestro localStorage
function cambiarTema() {
    tema = !(tema);
    ponerTema();
    guardarTemaEnLS();
}

// Esta funcion se encarga de corroborar si el tema actual es el claro o el oscuro
// para luego intercambiar de tema
function ponerTema() {
    if (tema == true) temaClaro();
    else if (tema == false) temaOscuro();
}

// Esta funcion utilizamos para guardar el tema actual en el Local Storage
function guardarTemaEnLS() {
    localStorage.setItem('Tema', tema);
}


// creamos nuestra constante BUSCADOR donde almacenamos el elemento InputBuscar
const BUSCADOR = document.getElementById("inputBuscar");
// Mediante un eventListener leemos los datos que se escribe en el buscador
// y luego buscamos en nuestra lista de tareas
BUSCADOR.addEventListener('input', () => { buscar(BUSCADOR.value) });

// En esta funcion pasamos como parametro la palabra que queremos buscar
// en nuestra lista y luego filtramos e imprimimos en la pantalla el resultado
function buscar(palabra) {
    if (palabra.length == 0) {
        ELEMENTS.innerHTML = '';
        imprimirTareasEnPantalla();
    }
    else filtrarTareasEnPantalla(filtrarTareas(palabra));
}

// Mediante esta funcion recibimos la palabra a filtrar y agregamos a un arreglo auxiliar
// por el cual usaremos luego para imprimir los resultados de la busqueda
function filtrarTareas(nombre) {
    let listaFiltrada = [];
    for (let este = 0; este < datosGuardados.length; este++) {
        if (datosGuardados[este].Nombre.toUpperCase().includes(nombre.toUpperCase())) {
            listaFiltrada.push(datosGuardados[este]);
        }
    }
    return listaFiltrada;
}

// Con esta funcion mostramos en pantalla la nueva lista auxiliar
// que generamos mediante la busqueda con la funcion de arriba.
function filtrarTareasEnPantalla(tareas) {
    ELEMENTS.innerHTML = '';
    tareas.forEach(elements => {
        mostrarDato(elements);
    });
}

// Mediante esta funcion seteamos la fecha minima que podemos poner en nuestro
// input de fecha. Y tambien seteamos que este seleccionada por defecto con el dia y tiempo actual
function setearFechaMinima() {
    let fechaInicio = new Date();
    mes = (fechaInicio.getMonth() + 1);
    dia = fechaInicio.getDate();
    anho = fechaInicio.getFullYear();
    horas = fechaInicio.toLocaleTimeString();
    if (dia < 10) dia = '0' + dia;
    let fechaMinima = `${anho}-${mes}-${dia}T${horas}`;
    FECHA.value = fechaMinima;
    FECHA.min = fechaMinima;
}