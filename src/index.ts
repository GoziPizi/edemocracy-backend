import http from 'http';
import express from 'express';
import router from './router/Router';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger-output.json';
import cors from 'cors';

const PORT = 8080;

const app = express();
const httpsServer = http.createServer(app);

app.use(cors());

app.use(express.json({ limit: '50mb' }))
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use('', router);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});