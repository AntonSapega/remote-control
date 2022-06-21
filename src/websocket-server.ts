import 'dotenv/config';
import { WebSocketServer } from 'ws';
import * as robot from 'robotjs';

// function websocket() {
//   const PORT = +process.env.PORT;

//   const wsServer = new WebSocketServer({ port: PORT });
//   console.log(`Websocket server works on port: ${PORT}`);

//   wsServer.on('connection', (ws) => {
//     ws.on('message', (data) => {
//       console.log('received: ', data);
//     });

//     ws.send('something');
//   });

//   wsServer.on('close', () => {
//     // закрытие соединения
//   });
// }

// export { websocket };

const PORT = +process.env.PORT;

const wsServer = new WebSocketServer({ port: PORT });
console.log(`Websocket server works on port: ${PORT}`);

wsServer.on('connection', (ws) => {
  ws.on('message', (data) => {
    console.log('received: ', data);
  });

  ws.send('something');
});

wsServer.on('close', () => {
  // закрытие соединения
});
