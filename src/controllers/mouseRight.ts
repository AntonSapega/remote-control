import * as robot from 'robotjs';
import { WebSocket } from 'ws';

const mouseRightMover = (step: number, ws: WebSocket) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouse(x + step, y);
  const xPos = `${x}px`;
  const yPos = `${y}px`;
  ws.send(`${xPos},${yPos} \0`);
  ws.send(`mouse_position \0`);
  ws.send(`mouse_right \0`);
};

export { mouseRightMover };
