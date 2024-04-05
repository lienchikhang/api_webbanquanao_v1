import multer, { diskStorage } from "multer";
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

export const upload = multer({
    storage: diskStorage({
        destination: (req, file, cb) => {
            // Đường dẫn đến thư mục lưu trữ file
            cb(null, path.join(process.cwd(), 'public', 'assets', 'images', 'inDir'));
        },
        filename: (req, file: Express.Multer.File, cb) => {
            let newName = new Date().getTime() + file.originalname;
            cb(null, newName);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
})


cloudinary.config({
    cloud_name: 'drfjok8d7',
    api_key: '319771257136443',
    api_secret: 'aGlS8yvKAnYu1JBtT_hzLvFCunQ'
});

export const uploadCloud = (idImg: string, imgUrl: string) => {
    return cloudinary.uploader.upload(imgUrl,
        { public_id: idImg, folder: 'web_ban_quan_ao' });
}

