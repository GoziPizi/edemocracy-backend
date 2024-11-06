import https from 'https';
import express from 'express';
import router from './router/Router';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger-output.json';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

function isProdEnvironment(): boolean {
    return process.env.NODE_ENV === 'prod';
}

const PORT = process.env.PORT || 8080;

const sslFileDirectory = process.env.SSL_FILE_DIRECTORY || '/etc/letsencrypt/live/digital-democracy.eu/';

let corsOrigins;
try {
  corsOrigins = '*';
} catch (error) {
  corsOrigins = [];
}

const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: corsOrigins,
  optionsSuccessStatus: 200
};

let privateKey = '';
let certificate = '';
let ca = '';

if (isProdEnvironment()) {
  try {
      privateKey = fs.readFileSync(path.join(sslFileDirectory, 'privkey.pem'), 'utf8');
      certificate = fs.readFileSync(path.join(sslFileDirectory, 'fullchain.pem'), 'utf8');
      ca = fs.readFileSync(path.join(sslFileDirectory, 'chain.pem'), 'utf8');
  } catch (error) {
      console.error('Error reading SSL certificate files:', error);
      process.exit(1); // Exit the application if SSL files cannot be read
  }
}

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const app = express();
const httpsServer = https.createServer(credentials, app);
app.use(cors(corsOptions));

//show the cors configuration of app
console.log('isProdEnvironment:', isProdEnvironment());
console.log('PORT:', PORT);

app.use('', router.stripeRouter)

app.use(express.json({ limit: '50mb' }))
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use('', router.router);

if (isProdEnvironment())
    httpsServer.listen(PORT, () => {
      console.info(`⚡️ HTTPS Server is running on port: ${PORT}`)
    })
  else
    app.listen(PORT, () => {
      console.info(`⚡️ Server is running on port: ${PORT}`)
    })

export default app;