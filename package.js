const SERVER_VERSION = 'formio/formio-enterprise:7.2.0-rc.3';
const PDF_VERSION = 'formio/pdf-server:3.2.0-rc.5';
const child_process = require("child_process");
const fs = require('fs');
const sslCert = fs.readFileSync('./certs/cert.crt', 'utf8');
const sslKey = fs.readFileSync('./certs/cert.key', 'utf8');
const DockerCompose = fs.readFileSync('./docker-compose.yml', 'utf8');
const DockerComposeProd = fs.readFileSync('./docker-compose.prod.yml', 'utf8');
const DockerComposeSSL = fs.readFileSync('./docker-compose.ssl.yml', 'utf8');
const DockerComposeServer = fs.readFileSync('./docker-compose.server.yml', 'utf8');
const DockerComposePDF = fs.readFileSync('./docker-compose.pdf.yml', 'utf8');
const createPackage = function(file, image, pdfImage, config, cert, ssl) {
  console.log('Removing previous package.');
  try {
    fs.unlinkSync(`./deploy/${file}`);
  }
  catch (err) {}
  console.log(`Creating package ${file} with image ${image}`);
  let result = config;
  if (image) {
    result = config.replace(/formio\/formio-enterprise/g, image);
  }
  if (pdfImage) {
    result = result.replace(/formio\/pdf-server/g, pdfImage);
  }
  if (cert) {
    result = result.replace(/rds-combined-ca-bundle/g, cert);
  }
  if (ssl) {
    result = result.replace(/\$\{SSL_CERT\}/g, sslCert.toString().replace(/\n/g, '\\n'));
    result = result.replace(/\$\{SSL_KEY\}/g, sslKey.toString().replace(/\n/g, '\\n'));
  }
  fs.writeFileSync('./docker-compose.yml', result, 'utf8');
  child_process.execSync(`zip -r deploy/${file} docker-compose.yml certs/* ${ssl ? 'conf.d.ssl/*' : 'conf.d/*'} .ebextensions/*`, {
    cwd: __dirname
  });
  console.log(`Done creating package.`);
};

createPackage('api-server.zip', SERVER_VERSION, '', DockerComposeServer);
createPackage('pdf-server.zip', '', PDF_VERSION, DockerComposePDF);
createPackage('multicontainer.local.zip', SERVER_VERSION, PDF_VERSION, DockerCompose);
createPackage('multicontainer.latest.zip', '', '', DockerComposeProd);
createPackage('multicontainer.zip', SERVER_VERSION, PDF_VERSION, DockerComposeProd);
createPackage('multicontainer.ssl.zip', SERVER_VERSION, PDF_VERSION, DockerComposeSSL, '', true);
createPackage('multicontainer.gov.zip', SERVER_VERSION, PDF_VERSION, DockerComposeProd, 'rds-combined-ca-us-gov-bundle');
createPackage('multicontainer.gov.ssl.zip', SERVER_VERSION, PDF_VERSION, DockerComposeSSL, 'rds-combined-ca-us-gov-bundle', true);

// Create submission server packages
require('./sub-srv/package');

// Reset the docker compose file.
fs.writeFileSync('./docker-compose.yml', DockerCompose, 'utf8');
