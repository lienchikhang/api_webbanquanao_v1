import { Router } from "express";
import { login, loginFacebook, loginGoogle, refreshToken, register, test } from "../controllers/auth.controller";
import { verifyClient } from "../middlewares/auth.middleware";


const authRoute = Router();

authRoute.post('/register', register);
authRoute.post('/login', login);
authRoute.post('/loginFacebook', loginFacebook);
authRoute.post('/loginGoogle', loginGoogle);
authRoute.post('/test', verifyClient, test);
authRoute.post('/refresh-token', refreshToken);

export default authRoute;