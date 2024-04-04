import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Error, Logger } from './Logger';
import { uploadCloud } from '../configs/upload.config';

class FileConcreteReader {
    static write(dest: string) {
        fs.readdir(dest, async (err, files) => {
            for (const file of files) {
                const outDir = path.join(process.cwd(), 'public', 'assets', 'images', 'outDir', file);
                try {
                    const semiTrans = await sharp(path.join(dest, file))
                        .png({ quality: 5 })
                        .toFile(outDir);
                    console.log('File processed successfully:', semiTrans);
                } catch (error) {
                    const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
                    logger.write();
                    console.error('Error processing file:', error);
                }
            }
        })
    }

    static async read() {
        const uploadedImgs: string[] = [];
        const outDirFiles = fs.readdirSync(path.join(process.cwd(), 'src', 'assets', 'admin', 'after'));
        for (const file of outDirFiles) {
            const outDir = path.join(process.cwd(), 'src', 'assets', 'admin', 'after', file);
            try {
                const rs = await uploadCloud(file, outDir);
                console.log('res:: ', rs);
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