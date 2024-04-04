import path from 'path';
import fs from 'fs';
import { Time } from '../classes/Time';

const outDirDefault = path.join(process.cwd(), 'public', 'logs', 'errors');


export const handleWriteError = (error: string) => {

    const fileName = Time.getCurrent() + '.txt';
    const outDir = path.join(outDirDefault, fileName);

    //check isExist fileName (error per day)
    if (fs.existsSync(outDir)) {
        fs.appendFile(outDir, '\n' + error, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Mess:: Handle append log successfully!');
            }
        });
    } else {
        fs.writeFile(outDir, error, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Mess:: Handle append log successfully!');
            }
        })
    }
}
