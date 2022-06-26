import Jimp from 'jimp';
import { httpServer } from './src/http_server/index.js';
import * as robot from 'robotjs';
import { WebSocketServer, WebSocket } from 'ws';
import 'dotenv/config';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

const HTTP_PORT = 3000;
const PORT = +process.env.PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

//********************* */

// const socket = new WebSocket(`ws://localhost:${PORT}`); //!!!!!!!!!!

const wsServer = new WebSocketServer({ port: PORT });
console.log(`Websocket server works on port: ${PORT}`);

wsServer.on('connection', (ws) => {
  ws.on('message', async (data) => {
    console.log('received: ', data.toString());
    const { command, value, length } = parseInputCommand(data);

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

    if (command === 'draw_circle') {
      const { x, y } = robot.getMousePos();
      drawCircle(x, y, value);
    }

    if (command === 'draw_square') {
      const { x, y } = robot.getMousePos();
      drawSquare(x, y, value);
    }

    if (command === 'draw_rectangle') {
      const { x, y } = robot.getMousePos();
      drawRectangle(x, y, value, length);
    }

    if (command === 'prnt_scrn') {
      const { x, y } = robot.getMousePos();
      const screen = await makePrintScreen(ws, x, y);
      // const writeStream = createWriteStream('http://localhost:3000/', );
      // const readableStream = new Readable({
      //   read() {
      //     this.push(screen)
      //   }
      // });
      // readableStream.push(screen);
      ws.send(`prnt_scrn ${screen}`);
    }
  });

  // ws.send('something');
});

wsServer.on('close', () => {
  // закрытие соединения
});

function drawCircle(cursorX: number, cursorY: number, radius: number) {
  robot.setMouseDelay(2);

  const center = {
    x: cursorX,
    y: cursorY + radius,
  };

  robot.mouseToggle('down');

  for (let Y = cursorY; Y <= cursorY + 2 * radius; Y++) {
    const X = Math.sqrt(Math.pow(radius, 2) - Math.pow(Y - center.y, 2)) + center.x;
    robot.dragMouse(X, Y);
  }

  for (let Y = cursorY + 2 * radius; Y >= cursorY; Y--) {
    const X = center.x - Math.sqrt(Math.pow(radius, 2) - Math.pow(Y - center.y, 2));
    robot.dragMouse(X, Y);
  }

  robot.mouseToggle('up');
}

function parseInputCommand(line: any) {
  const [command, value, length] = line.toString().split(' ');
  return {
    command,
    value: Number(value),
    length: Number(length),
  };
}

function drawSquare(cursorX: number, cursorY: number, size: number) {
  robot.mouseToggle('down');
  robot.moveMouseSmooth(cursorX + size, cursorY);
  robot.moveMouseSmooth(cursorX + size, cursorY + size);
  robot.moveMouseSmooth(cursorX, cursorY + size);
  robot.moveMouseSmooth(cursorX, cursorY);
  robot.mouseToggle('up');
}

function drawRectangle(cursorX: number, cursorY: number, width: number, length: number) {
  robot.mouseToggle('down');
  robot.moveMouseSmooth(cursorX + width, cursorY);
  robot.moveMouseSmooth(cursorX + width, cursorY + length);
  robot.moveMouseSmooth(cursorX, cursorY + length);
  robot.moveMouseSmooth(cursorX, cursorY);
  robot.mouseToggle('up');
}

async function makePrintScreen(ws: WebSocket, x: number, y: number) {
  //********** */
  // const img = robot.screen.capture(x, y, 200, 200).image;
  // console.log(img);
  // const image = await Jimp.read(img);
  // const buffer = await image.getBase64Async(Jimp.MIME_PNG);
  // console.log(buffer);
  ///************ */
  // Jimp.read(img).then((image) => {
  //   image.getBase64(Jimp.AUTO, (error, res) => {
  //     console.log(res);
  //   });
  // });

  const size: number = 100;
  const image = robot.screen.capture(x - size, y - size, size * 2, size * 2);
  const jimp = new Jimp({
    data: image.image,
    width: image.width,
    height: image.height,
  });

  const base64Image = await jimp.getBase64Async(Jimp.MIME_PNG);
  const base64String = base64Image.split(',')[1];
  return base64String;
}
