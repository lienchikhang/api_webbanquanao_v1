import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Error, Logger } from './Logger';
import { uploadCloud } from '../configs/upload.config';

class FileConcreteReader {
    static async write(dest: string) {
        const files = fs.readdirSync(dest);
        for (const file of files) {
            const outDir = path.join(process.cwd(), 'public', 'assets', 'images', 'outDir', file);
            try {
                await sharp(path.join(dest, file))
                    .png({ quality: 10 })
                    .toFile(outDir);
            } catch (error) {
                const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
                logger.write();
                console.error('Error processing file:', error);
            }
        }
        return true;
    }

    static async read() {
        const uploadedImgs: string[] = [];
        const outDirFiles = fs.readdirSync(path.join(process.cwd(), 'public', 'assets', 'images', 'outDir'));
        for (const file of outDirFiles) {
            const outDir = path.join(process.cwd(), 'public', 'assets', 'images', 'outDir', file);
            try {
                const rs = await uploadCloud(file, outDir);
                uploadedImgs.push(rs.url);
            } catch (error) {
                const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
                logger.write();
                console.error('Error processing file:', error);
            }
        }
        return uploadedImgs;
    }

}

export default FileConcreteReader;