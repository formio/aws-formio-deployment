const SERVER_VERSION = `formio/formio-enterprise:${process.argv[2] || '7.1.8'}`;
const PDF_VERSION = `formio/pdf-server:${process.argv[3] || '3.2.0'}`;
const SUBSERVER_VERSION = `formio/formio-enterprise:${process.argv[4] || '8.0.0-m.16'}`;
const child_process = require("child_process");
const fs = require('fs');
const path = require('path');
const sslCert = fs.readFileSync('./package/certs/cert.crt', 'utf8');
const sslKey = fs.readFileSync('./package/certs/cert.key', 'utf8');
const deployments = require('./deployments');
const createPackage = function(type, deployment, manifest) {
  console.log('Removing previous package.');
  try {
    fs.unlinkSync(`./builds/${type}/${deployment.file}`);
  }
  catch (err) {}
  console.log(`Creating package ${type}/${deployment.file} with image ${deployment.image}`);
  let result = deployment.manifest;
  if (deployment.image) {
    result = deployment.manifest.replace(/formio\/formio-enterprise/g, deployment.image);
  }
  if (deployment.pdfImage) {
    result = result.replace(/formio\/pdf-server/g, deployment.pdfImage);
  }
  if (deployment.subImage) {
    result = result.replace(/formio\/submission-server/g, deployment.subImage);
  }
  if (deployment.cert) {
    result = result.replace(/rds-combined-ca-bundle/g, deployment.cert);
  }
  if (deployment.ssl) {
    result = result.replace(/\$\{SSL_CERT\}/g, sslCert.toString().replace(/\n/g, '\\n'));
    result = result.replace(/\$\{SSL_KEY\}/g, sslKey.toString().replace(/\n/g, '\\n'));
  }
  fs.writeFileSync(`./package/${manifest}`, result, 'utf8');
  try {
    const files = [];
    files.push(manifest);
    if (deployment.includeEnv) {
      files.push('.env.example');
    }
    files.push('certs/*');
    files.push(`${deployment.ssl ? 'conf.d.ssl' : 'conf.d'}/*`);
    files.push('.ebextensions/*');
    child_process.execSync(`zip -r ../builds/${type}/${deployment.file} ${files.join(' ')}`, {
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
      deployment.image = deployment.latest ? '' : SERVER_VERSION;
      deployment.pdfImage = deployment.latest ? '' : PDF_VERSION;
      deployment.subImage = deployment.latest ? 'formio/formio-enterprise:8.0.0-m.16' : SUBSERVER_VERSION;
      createPackage(type, deployment, deployments[type].manifest);
    });
  }
}
