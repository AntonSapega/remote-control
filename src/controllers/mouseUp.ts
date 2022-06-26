import * as robot from 'robotjs';
import { WebSocket } from 'ws';

const mouseUpMover = (step: number, ws: WebSocket) => {
  const { x, y } = robot.getMousePos();
  robot.moveMouse(x, y - step);
  const xPos = `${x}px`;
  const yPos = `${y}px`;
  ws.send(`${xPos},${yPos} \0`);
  ws.send(`mouse_position \0`);
  ws.send(`mouse_up \0`);
};

export { mouseUpMover };
