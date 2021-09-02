const SERVER_VERSION = `formio/formio-enterprise:${process.argv[2] || '7.1.8'}`;
const PDF_VERSION = `formio/pdf-server:${process.argv[3] || '3.2.0'}`;
const SUBSERVER_VERSION = `formio/formio-enterprise:${process.argv[4] || '8.0.0-m.16'}`;
const child_process = require("child_process");
const fs = require('fs');
const path = require('path');
const sslCert = fs.readFileSync('./package/certs/cert.crt', 'utf8');
const sslKey = fs.readFileSync('./package/certs/cert.key', 'utf8');
const deployments = require('./deployments');
const createPackage = function(type, file, image, pdfImage, subImage, config, cert, ssl, manifest) {
  console.log('Removing previous package.');
  try {
    fs.unlinkSync(`./builds/${type}/${file}`);
  }
  catch (err) {}
  console.log(`Creating package ${type}/${file} with image ${image}`);
  let result = config;
  if (image) {
    result = config.replace(/formio\/formio-enterprise/g, image);
  }
  if (pdfImage) {
    result = result.replace(/formio\/pdf-server/g, pdfImage);
  }
  if (subImage) {
    result = result.replace(/formio\/submission-server/g, subImage);
  }
  if (cert) {
    result = result.replace(/rds-combined-ca-bundle/g, cert);
  }
  if (ssl) {
    result = result.replace(/\$\{SSL_CERT\}/g, sslCert.toString().replace(/\n/g, '\\n'));
    result = result.replace(/\$\{SSL_KEY\}/g, sslKey.toString().replace(/\n/g, '\\n'));
  }
  fs.writeFileSync(`./package/${manifest}`, result, 'utf8');
  try {
    child_process.execSync(`zip -r ../builds/${type}/${file} ${manifest} .env certs/* ${ssl ? 'conf.d.ssl' : 'conf.d'}/* .ebextensions/*`, {
      cwd: path.join(__dirname, 'package')
    });
  }
  catch (err) {
    console.log(err);
  }
  fs.unlinkSync(`./package/${manifest}`);
  console.log(`Done creating package.`);
};

for (let type in deployments) {
  if (deployments.hasOwnProperty(type)) {
    deployments[type].deployments.forEach((deployment) => {
      createPackage(
        type,
        deployment.file,
        deployment.latest ? '' : SERVER_VERSION,
        deployment.latest ? '' : PDF_VERSION,
        deployment.latest ? 'formio/formio-enterprise:8.0.0-m.16' : SUBSERVER_VERSION,
        deployment.manifest,
        deployment.cert,
        deployment.ssl,
        deployments[type].manifest
      );
    });
  }
}
