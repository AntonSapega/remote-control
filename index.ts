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

const socket = new WebSocket(`ws://localhost:${PORT}`); //!!!!!!!!!!

const wsServer = new WebSocketServer({ port: PORT });
console.log(`Websocket server works on port: ${PORT}`);

wsServer.on('connection', (ws) => {
  ws.on('message', (data) => {
    console.log('received: ', data.toString());
    const { command, value } = parseInputCommand(data);

    if (command === 'draw_circle') {
      const { x, y } = robot.getMousePos();
      drawCircle(x, y, value);
    }

    if (command === 'mouse_left') {
      const { x, y } = robot.getMousePos();
      robot.moveMouse(x - value, y);
      // ws.send(`mouse_position {${x - value} px},{${y} px}`);
      ws.send(`mouse_left`);
    }

    if (command === 'mouse_right') {
      const { x, y } = robot.getMousePos();
      robot.moveMouse(x + value, y);
      ws.send(`mouse_right`);
    }

    if (command === 'mouse_up') {
      const { x, y } = robot.getMousePos();
      robot.moveMouse(x, y - value);
      ws.send(`mouse_up`);
    }

    if (command === 'mouse_down') {
      const { x, y } = robot.getMousePos();
      robot.moveMouse(x, y + value);
      ws.send(`mouse_down`);
    }
  });

  // ws.send('something');
});

wsServer.on('close', () => {
  // закрытие соединения
});

function drawCircle(cursorX: number, cursorY: number, radius: number) {
  // robot.setMouseDelay(2);

  // var twoPI = Math.PI * 2.0;
  // var screenSize = robot.getScreenSize();
  // var height = screenSize.height / 2 - 10;
  // var width = screenSize.width;

  // for (var x = 0; x < width; x++) {
  //   const y = height * Math.sin((twoPI * x) / width) + height;
  //   robot.moveMouse(x, y);
  // }

  robot.setMouseDelay(2);
  console.log(cursorX, cursorY);
  const center = {
    x: cursorX,
    y: cursorY + radius,
  };

  robot.mouseToggle('down');

  for (let Y = cursorY; Y <= cursorY + 2 * radius; Y++) {
    const X = Math.sqrt(Math.pow(radius, 2) - Math.pow(Y - center.y, 2)) + center.x;
    console.log(X, Y);
    robot.dragMouse(X, Y);
  }

  for (let Y = cursorY + 2 * radius; Y >= cursorY; Y--) {
    const X = center.x - Math.sqrt(Math.pow(radius, 2) - Math.pow(Y - center.y, 2));
    console.log(X, Y);
    robot.dragMouse(X, Y);
  }

  robot.mouseToggle('up');
}

function parseInputCommand(line: any) {
  const [command, value] = line.toString().split(' ');
  return {
    command,
    value: Number(value),
  };
}

const drawCircles = (cursorX: number, cursorY: number, radius: number) => {
  const mousePos = robot.getMousePos();

  const centerOfCircle = {
    x: cursorX,
    y: cursorY - radius,
  };

  robot.mouseToggle('down');

  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    // Convert polar coordinates to cartesian
    const x = mousePos.x + radius * Math.cos(i);
    const y = mousePos.y + radius * Math.sin(i);

    robot.dragMouse(x, y);
  }
  robot.mouseToggle('up');
};
