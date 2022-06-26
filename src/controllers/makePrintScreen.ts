import * as robot from 'robotjs';
import { WebSocket } from 'ws';
import Jimp from 'jimp';

async function makePrintScreen(ws: WebSocket) {
  const { x, y } = robot.getMousePos();
  ws.send(`draw_circle \0`);

  const picSize: number = 200;
  const image = robot.screen.capture(x + picSize, y, picSize, picSize);
  const jimp = new Jimp({
    data: image.image,
    width: image.width,
    height: image.height,
  });

  const base64Image = await jimp.getBase64Async(Jimp.MIME_PNG);
  const base64String = base64Image.split(',')[1];
  return base64String;
}

export { makePrintScreen };
