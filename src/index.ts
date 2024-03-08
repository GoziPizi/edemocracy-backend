import http from 'http';
import express from 'express';
import router from './router/Router';

const PORT = 8080;

const app = express();
const httpsServer = http.createServer(app);
app.use('', router);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});