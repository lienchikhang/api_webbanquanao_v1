import { Request } from 'express';

// Khai báo một interface mới cho đối tượng Request của Express
declare global {
    namespace Express {
        export interface Request {
            payload: any; // Hoặc kiểu dữ liệu của payload của bạn
        }
    }
}