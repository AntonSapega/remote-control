import { httpServer } from './src/http_server/index.js';
import { WebSocketServer } from 'ws';
import 'dotenv/config';
import { mouseLeftMover } from './src/controllers/mouseLeft';
import { mouseRightMover } from './src/controllers/mouseRight';
import { mouseUpMover } from './src/controllers/mouseUp';
import { mouseDownMover } from './src/controllers/mouseDown';
import { drawSquare } from './src/controllers/drawSquare';
import { drawRectangle } from './src/controllers/drawRectangle';
import { drawCircle } from './src/controllers/drawCircle';
import { makePrintScreen } from './src/controllers/makePrintScreen';
import { parseInputCommand } from './src/utils/parseInputCommand';

const HTTP_PORT = 3000;
const PORT = +process.env.PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: PORT });
console.log(`Websocket server works on port: ${PORT}`);

wsServer.on('connection', (ws) => {
  ws.on('message', async (data) => {
    const { command, value, length } = parseInputCommand(data);

    if (command === 'mouse_left') {
      mouseLeftMover(value, ws);
    }

    if (command === 'mouse_right') {
      mouseRightMover(value, ws);
    }

    if (command === 'mouse_up') {
      mouseUpMover(value, ws);
    }

    if (command === 'mouse_down') {
      mouseDownMover(value, ws);
    }

    if (command === 'draw_circle') {
      drawCircle(value, ws);
    }

    if (command === 'draw_square') {
      drawSquare(value, ws);
    }

    if (command === 'draw_rectangle') {
      drawRectangle(value, length, ws);
    }

    if (command === 'prnt_scrn') {
      const screen = await makePrintScreen(ws);
      ws.send(`prnt_scrn ${screen}`);
    }
  });
});

wsServer.on('close', () => {
  // close connection
});
