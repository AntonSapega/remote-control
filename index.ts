import * as Jimp from 'jimp';
import { httpServer } from './src/http_server/index.js';
import * as robot from 'robotjs';
import { WebSocketServer, WebSocket } from 'ws';
import 'dotenv/config';

const HTTP_PORT = 3000;
const PORT = +process.env.PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

//********************* */

const socket = new WebSocket(`ws://localhost:${PORT}`);

const wsServer = new WebSocketServer({ port: PORT });
console.log(`Websocket server works on port: ${PORT}`);

wsServer.on('connection', (ws) => {
  ws.on('message', (data) => {
    console.log('received: ', data.toString());
    if (data.toString().split(' ')[0] === 'draw_circle') {
      drawCircle();
    }
  });

  ws.send('something');
});

wsServer.on('close', () => {
  // закрытие соединения
});

function drawCircle() {
  robot.setMouseDelay(2);

  var twoPI = Math.PI * 2.0;
  var screenSize = robot.getScreenSize();
  var height = screenSize.height / 2 - 10;
  var width = screenSize.width;

  for (var x = 0; x < width; x++) {
    const y = height * Math.sin((twoPI * x) / width) + height;
    // robot.moveMouse(x, y);
    robot.moveMouseSmooth(x, y);
  }
}
