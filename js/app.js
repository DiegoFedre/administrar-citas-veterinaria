// VARIABLES - CAMPOS DEL FORMULARIO
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// VARIABLES UI DONDE SE MUESTRA LA INFO
const formulario = document.querySelector('#nueva-cita');
const contenedorCita = document.querySelector('#citas');

// Utilizo esta variable para generar el modo edicion
let editando;


// CLASES
class Citas {
    constructor() { // constructor
        this.citas = [];
    }

    agregarCita(cita) { // Metodo
        this.citas = [...this.citas, cita]; // Tomo una copia de this.citas y agrego la cita actual
        
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id)
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita); // Map va a recorrer todos los elementos y si el id de la cita coincide con el id en el que estoy editando, si es asi entonces reescribo lo que tenga esa cita, caso contrario retorno la cita actual  
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en base al tipo de error
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita')); //insertBefore('lo que quiero agregar', 'la clase anterior a la cual quiero agreagarlo')

        // Quitar la alerta despues de 5 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 5000);
        
    }

    imprimirCitas({citas}) { // Aplico destructuring

        this.limpiarHTML();

        citas.forEach( cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita; // Extraigo de cita

            const divCita = document.createElement('div');// Creo el div donde voy a mostrar la cita
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class="font-weight-bolder">Telefono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
            `;

            // Boton para eliminar esta cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            btnEliminar.onclick = () => eliminarCita(id);// Cuando de click en el boton eliminar voy a ejecutar la funcion 'eliminarCita'

            // Añade un boton de editar citas
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>';
            btnEditar.onclick = () => cargarEdicion(cita);// Cuand haga click en el boton editar voy a ejecutar la funcion 'cargarEdicion'


            // Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // Agregar las citas al HTML
            contenedorCita.appendChild(divCita);

        })
    }

    limpiarHTML() {
        while(contenedorCita.firstChild) {
            contenedorCita.removeChild(contenedorCita.firstChild)
        }
    }
}

// INSTANCIO AMBAS CLASES DE FORMA GLOBAL
const ui = new UI();
const administrarCitas = new Citas();

// REGISTRAR EVENTOS
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// OBJETO CON LA INFORMACION DE LA CITA
const citaObj = { // Creo un objeto de cita donde cada propiedad tendra el nombre del 'name' de cada input, para luego irlo llenando con los datos que ingresa el usuario
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// FUNCIONES
function datosCita(e) { //Agrega datos al objeto "citaObj"
    citaObj[e.target.name] = e.target.value; // Accedo a las propíedades del objeto y le asigno lo que el usuario escribe a la propiedad que corresponde
    
}

function nuevaCita(e) { // Valida y agrega una nueva cita a la clase de "Citas"
    e.preventDefault();

    // Extraer la informacion del objeto "citaObj"
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return; // El return hace que no se ejecute la siguiente linea por mas que este dentro de un If
    }

    // La primera vez no va a entrar pero cuando presione el boton 'Editar' entonces ahi si va e entrar en modo edicion
    if(editando) {
        ui.imprimirAlerta('Editado Correctamente');

        // Pasar el objeto de la cita a edicion
        administrarCitas.editarCita({...citaObj});

        formulario.querySelector('button[type="submit"]').textContent= 'Crear Cita';// Volvemos a poner el texto original en el boton
        editando = false; //Quitamos el modo idicion para que se reinicie el formulario

    } else {
        // Generar un ID unico
        citaObj.id = Date.now(); // Eso nos va a dar un id

        // Creando una nueva cita
        administrarCitas.agregarCita({...citaObj}); //a la funcion agregarCita le paso una copia de citaObj para que no tome a todas las citas como la ultima y me duplique los datos

        // Mensaje de agreagdo correctamente
        ui.imprimirAlerta('La cita se agregó correctamente !');

    }

    
    // Reiniciar el objeto para la validacion
    reiniciarObjeto();


    // Reiniciar el formulario
    formulario.reset();

    // Mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas);
}


function reiniciarObjeto() {
    citaObj.mascota = '',
    citaObj.propietario = '',
    citaObj.telefono = '',
    citaObj.fecha = '',
    citaObj.hora = '',
    citaObj.sintomas = ''
}

function eliminarCita(id) {
    // Eliminar la cita
    administrarCitas.eliminarCita(id);

    // Mostrar un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente!');

    // Resfrescar las citas
    ui.imprimirCitas(administrarCitas);
}


// Carga los datos y el modo Edicion
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // LLenar los inputs
    mascotaInput.value = mascota; // Al mascota input le asigno el valor que hay en mascota y de esa forma vuelvo a llenar los input con la informacion de la cita para liego poder moficcarlos
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // LLenar el objeto citaObj
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;


    // Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent ='Guardar Cambios';

    editando = true;
}