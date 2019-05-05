const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();


io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {



        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: 'El nombre y la sala son  necesarios'
            });

        }
        // unimos al usuario a una sala
        client.join(data.sala);

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);



        //cuando alguien se reconecta o lo abandona al Chat informa  los que estan en el chat
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    // usuario que emite mensaje para todo el mundo
    client.on('crearMensaje', data => {
        let persona = usuarios.getPersona(client.id).nombre;
        let mensaje = crearMensaje(persona, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });


    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio`));
        //cuando alguien se reconecta o lo abandona al Chat informa  los que estan en el chat
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    // Mensajes privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });


});