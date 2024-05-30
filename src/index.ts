import http from 'http';
import https from 'https';
import express from 'express';
import router from './router/Router';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger-output.json';
import cors from 'cors';
import fs from 'fs';

function isProdEnvironment(): boolean {
    console.log(process.env.NODE_ENV);
    return process.env.NODE_ENV === 'prod';
}

const PORT = process.env.PORT || (isProdEnvironment() ? 443 : 8080)

const sslFileDirectory = process.env.SSL_FILE_DIRECTORY

const privateKey = isProdEnvironment() ? fs.readFileSync(`${sslFileDirectory}/privkey.pem`, 'utf8') : ''
const certificate = isProdEnvironment() ? fs.readFileSync(`${sslFileDirectory}/fullchain.pem`, 'utf8') : ''
const ca = isProdEnvironment() ? fs.readFileSync(`${sslFileDirectory}/chain.pem`, 'utf8') : ''

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};
console.log(credentials);

const app = express();
const httpsServer = https.createServer(credentials, app);

app.use(cors());

app.use(express.json({ limit: '50mb' }))
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use('', router);
if (isProdEnvironment())
    httpsServer.listen(PORT, () => {
      console.info(`⚡️ HTTPS Server is running on port: ${PORT}`)
    })
  else
    app.listen(PORT, () => {
      console.info(`⚡️ Server is running on port: ${PORT}`)
    })