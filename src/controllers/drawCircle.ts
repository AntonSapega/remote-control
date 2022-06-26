import * as robot from 'robotjs';
import { WebSocket } from 'ws';

function drawCircle(radius: number, ws: WebSocket) {
  const { x: cursorX, y: cursorY } = robot.getMousePos();
  ws.send(`draw_circle \0`);

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

export { drawCircle };
