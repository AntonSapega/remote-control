import * as robot from 'robotjs';
import { WebSocket } from 'ws';

const mouseDownMover = (step: number, ws: WebSocket) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouse(x, y + step);
  const xPos = `${x}px`;
  const yPos = `${y}px`;
  ws.send(`${xPos},${yPos} \0`);
  ws.send(`mouse_position \0`);
  ws.send(`mouse_down \0`);
};

export { mouseDownMover };
