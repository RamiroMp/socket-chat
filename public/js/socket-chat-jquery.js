var params = new URLSearchParams(window.location.search);

var divUsuarios = document.querySelector('#divUsuarios');
var formEnviar = document.querySelector('#formEnviar');
var txtMensaje = document.querySelector('#txtMensaje');
var divChatbox = document.querySelector("#divChatbox");


// Funciones para rederizar usuarios

function renderizarUsuarios(personas) {

    while (divUsuarios.firstChild) {
        divUsuarios.removeChild(divUsuarios.firstChild);
    }


    console.log(personas);
    var html = document.createElement('ul');
    var img = document.createElement('img');
    var li = document.createElement('li');
    var a = document.createElement('a');
    var span = document.createElement('span');
    span.textContent = `${params.get('sala')}`;
    a.classList.add('active');
    a.textContent = 'Chat de';
    a.href = "javascript:void(0)";
    a.appendChild(span);
    li.appendChild(a);
    html.appendChild(li);
    html.classList.add("chatonline");
    html.classList.add("style-none");

    personas.forEach(persona => {

        img = document.createElement('img');
        li = document.createElement('li');
        a = document.createElement('a');
        span = document.createElement('span');


        span.innerHTML = `${persona.nombre} <small class = "text-success" > online < /small>`;
        img.setAttribute('src', "assets/images/users/1.jpg");
        img.setAttribute('alt', "user-img");
        img.classList.add('img-circle');

        a.setAttribute('data-id', `${persona.id}`);

        a.href = "javascript:void(0)";
        a.appendChild(img);
        a.appendChild(span);
        li.appendChild(a);
        html.appendChild(li);



    });
    console.log(html);

    divUsuarios.appendChild(html);



}

function renderizarMensajes(mensaje, yo) {
    console.log(mensaje);
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'inverse';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
        console.log(adminClass);
    }
    console.log(mensaje.nombre);

    var li = document.createElement('li');

    if (yo) { li.classList.add('reverse'); } else { li.classList.add('animated', 'fadeIn'); }


    var divImg = document.createElement('div');
    var img = document.createElement('img');
    img.setAttribute("src", "assets/images/users/1.jpg");
    img.setAttribute("alt", "user");
    divImg.classList.add('chat-img');
    divImg.appendChild(img);
    var divChat = document.createElement('div');
    divChat.classList.add('chat-content');
    var h = document.createElement('h5');
    h.textContent = mensaje.nombre;
    divChat.appendChild(divImg);
    divChat.appendChild(h);
    var mens = document.createElement('div');
    mens.classList.add('box');
    if (yo) { mens.classList.add('bg-light-info'); } else {

        mens.classList.add(`bg-light-${adminClass}`);
    }

    mens.textContent = mensaje.mensaje;
    divChat.appendChild(mens);
    var divHor = document.createElement('div');
    divHor.classList.add('chat-time');
    divHor.textContent = hora;
    //li.appendChild(divImg);
    li.appendChild(divChat);
    li.appendChild(divHor);
    console.log(li);

    divChatbox.appendChild(li);




}








// listeners

divUsuarios.addEventListener('click', (e) => {
    console.log(e.target.closest('li>a').getAttribute('data-id'));


});

formEnviar.addEventListener('submit', (e) => {
    e.preventDefault();

    if (txtMensaje.value.trim().length === 0) {

        return;

    }


    // Enviar información
    socket.emit('crearMensaje', {
            nombre: params.get('nombre'),
            mensaje: txtMensaje.value

        },
        function(mensaje) {
            console.log('respuesta server: ', mensaje);
            txtMensaje.value = '';
            txtMensaje.focus();
            renderizarMensajes(mensaje, true);

        });




});