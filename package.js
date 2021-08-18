const SERVER_VERSION = 'formio/formio-enterprise:7.1.9-rc.2';
const PDF_VERSION = 'formio/pdf-server:3.1.5-patch.1';
const SERVER_V6_VERSION = 'formio/formio-enterprise:6.11.5'
const PDF_V2_VERSION = 'formio/formio-files-core:2.96.2-rc.2'
const child_process = require("child_process");
const fs = require('fs');
console.log('Reading .Dockerrun.aws.json');
const sslCert = fs.readFileSync('./certs/cert.crt', 'utf8');
const sslKey = fs.readFileSync('./certs/cert.key', 'utf8');
const Dockerrun = fs.readFileSync('./Dockerrun.aws.single.json', 'utf8');
const Dockerrun6 = fs.readFileSync('./Dockerrun.aws.single_v6.json', 'utf8');
const MultiDocker = fs.readFileSync('./Dockerrun.aws.multi.json', 'utf8');
const MultiDockerSSL = fs.readFileSync('./Dockerrun.aws.multi.ssl.json', 'utf8');
const MultiDocker6 = fs.readFileSync('./Dockerrun.aws.multi_v6.json', 'utf8');
const createPackage = function(file, image, pdfImage, legacy, cert, ssl) {
  let awsJson = pdfImage ? (legacy ? MultiDocker6 : (ssl ? MultiDockerSSL : MultiDocker)) : (legacy ? Dockerrun6 : Dockerrun);
  console.log('Removing previous package.');
  try {
    fs.unlinkSync(`./deploy/${file}`);
  }
  catch (err) {}
  console.log(`Creating package ${file} with image ${image}`);
  var result = awsJson.replace(/"IMAGE"/g, `"${image}"`);
  if (pdfImage) {
    result = result.replace(/"PDF_IMAGE"/g, `"${pdfImage}"`);
  }
  if (cert) {
    result = result.replace(/rds-combined-ca-bundle/g, cert);
  }
  if (ssl) {
    result = result.replace(/SSL_CERT_VALUE/g, sslCert.toString().replace(/\n/g, '\\n'));
    result = result.replace(/SSL_KEY_VALUE/g, sslKey.toString().replace(/\n/g, '\\n'));
  }
  fs.writeFileSync('./Dockerrun.aws.json', result, 'utf8');
  child_process.execSync(`zip -r deploy/${file} Dockerrun.aws.json certs/* ${ssl ? 'conf.d.ssl/*' : 'conf.d/*'} .ebextensions/*`, {
    cwd: __dirname
  });
  console.log(`Done creating package.`);
  fs.unlinkSync('./Dockerrun.aws.json');
};
createPackage('latest.zip', 'formio/formio-enterprise');
createPackage('api-server.zip', SERVER_VERSION);
createPackage('api-v6-server.zip', SERVER_V6_VERSION, '', true);
createPackage('pdf-server.zip', PDF_VERSION);
createPackage('pdf-v2-server.zip', PDF_V2_VERSION, '', true)
createPackage('multicontainer.zip', SERVER_VERSION, PDF_VERSION);
createPackage('multicontainer.ssl.zip', SERVER_VERSION, PDF_VERSION, false, '', true);
createPackage('multicontainer-v6.zip', SERVER_V6_VERSION, PDF_V2_VERSION, true);
createPackage('multicontainer-gov.zip', SERVER_VERSION, PDF_VERSION, false, 'rds-combined-ca-us-gov-bundle');
createPackage('multicontainer-gov.ssl.zip', SERVER_VERSION, PDF_VERSION, false, 'rds-combined-ca-us-gov-bundle', true);

// Create submission server packages
require('./sub-srv/package');
