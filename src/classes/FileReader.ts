import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Error, Logger } from './Logger';
import { uploadCloud } from '../configs/upload.config';

class FileConcreteReader {
    static async write(dest: string) {
        try {
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
        } catch (error) {
            console.log('error:: ', error);
            const logger = new Logger(new Error(new Date().getTime().toString() + "::writeFiles", __filename));
            logger.write();
        }

    }

    static async read() {
        try {
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
        } catch (error) {
            console.log('error:: ', error);
            const logger = new Logger(new Error(new Date().getTime().toString() + "::readFiles", __filename));
            logger.write();
        }
    }

    static async delete() {
        try {
            const inDirPath = path.join(process.cwd(), 'public', 'assets', 'images', 'inDir');
            const outDirPath = path.join(process.cwd(), 'public', 'assets', 'images', 'outDir');
            fs.readdir(inDirPath, (err, imgs) => {
                for (const img of imgs) {
                    fs.unlinkSync(path.join(inDirPath, img));
                }
            })
            fs.readdir(outDirPath, (err, imgs) => {
                for (const img of imgs) {
                    fs.unlinkSync(path.join(outDirPath, img));
                }
            })
        } catch (error) {
            console.log('error:: ', error);
            const logger = new Logger(new Error(new Date().getTime().toString() + "::deleteFiles", __filename));
            logger.write();
        }
    }
}

export default FileConcreteReader;