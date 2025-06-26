import fs from 'fs';
import path from 'path';

const logPath = path.join(__dirname, '../../logs/laundry.log');

if (!fs.existsSync(path.dirname(logPath))) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
}

export const writeLog = (msg: string) => {
  const time = new Date().toISOString();
  fs.appendFileSync(logPath, `[${time}] ${msg}\n`);
};
