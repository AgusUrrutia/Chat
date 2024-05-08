import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const clients = {}; // Objeto para almacenar nombres de clientes
const port = process.env.PORT ?? 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

// Middleware para permitir solicitudes CORS
// app.use(cors({
//   origin: 'http://localhost:4200' // Permite solicitudes desde localhost:4200
// }));

io.on('connection', (socket) => {
    console.log("Un usuario se ha conectado.");
    // io.emit('message', "Connection");

    // Escuchar el evento 'message' desde el cliente
    socket.on('setUsername', (username) => {
        console.log(`Usuario ${username} conectado con ID: ${socket.id}`);
        clients[socket.id] = username; // Almacena el nombre asociado con el ID del cliente
    });

    // Escuchar el evento 'message' desde el cliente
    socket.on('message', (msg) => {
        const username = clients[socket.id]; // Obtener el nombre del cliente a partir de su ID
        console.log(`${username}-> ${msg}`); // Imprimir el mensaje con el nombre del cliente
        io.emit('message', username+'-> ' + msg);
        // Puedes agregar aquí la lógica para procesar el mensaje, enviarlo a otros clientes, etc.
    });

});

app.get('/', (req, res) => {
    res.send('<h1>Welcome!</h1>');
});

server.listen(port, () => {
    console.log("Server listening on port: " + port);
});