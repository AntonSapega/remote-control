import * as robot from 'robotjs';
import { WebSocket } from 'ws';

function drawSquare(size: number, ws: WebSocket) {
  const { x, y } = robot.getMousePos();
  ws.send(`draw_square \0`);
  robot.mouseToggle('down');
  robot.moveMouseSmooth(x + size, y);
  robot.moveMouseSmooth(x + size, y + size);
  robot.moveMouseSmooth(x, y + size);
  robot.moveMouseSmooth(x, y);
  robot.mouseToggle('up');
}

export { drawSquare };
