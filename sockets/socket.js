const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Heroes del silencio'));
bands.addBand(new Band('Metalica'));

console.log(bands);

//MENSAJES DE SOCKETS
io.on('connection', client => {
    //?? Cliente con JWT
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    if (!valido) {
        return client.disconnect();
    } else {
        console.log('Cliente conectado');
    }

    //cliente autenticado
    usuarioConectado(uid);

    //Ingresar al Usuario a una sala en particular
    //client.id(para enviar a un mensaje privado)
    client.join(uid);

    //Escuchar mensaje personal
    client.on('mensaje-personal', async(payload) => {
        //Grabar mensaje
        await grabarMensaje(payload);
        //Emitir mensaje al usuario a partir del id
        io.to(payload.para).emit('mensaje-personal', payload);
    });

    //client.to(uid).emit('')

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });

    // client.on('mensaje', (payload) => {
    //     console.log('Mensaje!!!', payload);
    //     io.emit('mensaje', { admin: 'Nuevo mensaje a clientes' });
    // });

});