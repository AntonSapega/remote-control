import * as robot from 'robotjs';
import { WebSocket } from 'ws';

function drawRectangle(width: number, length: number, ws: WebSocket) {
  const { x, y } = robot.getMousePos();
  ws.send(`draw_rectangle \0`);
  robot.mouseToggle('down');
  robot.moveMouseSmooth(x + width, y);
  robot.moveMouseSmooth(x + width, y + length);
  robot.moveMouseSmooth(x, y + length);
  robot.moveMouseSmooth(x, y);
  robot.mouseToggle('up');
}

export { drawRectangle };
