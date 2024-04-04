import express from 'express';
import cors from 'cors';
import rootRoute from './routes/root.route';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', rootRoute);

app.listen(8080, () => {
    console.log('listening on port::', 8080);
})