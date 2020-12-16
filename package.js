const SERVER_VERSION = 'formio/formio-enterprise:7.0.0-rc.61';
const PDF_VERSION = 'formio/pdf-server:3.0.0-rc.30';
const child_process = require("child_process");
const fs = require('fs');
console.log('Reading .Dockerrun.aws.json');
const Dockerrun = fs.readFileSync('./Dockerrun.aws.single.json', 'utf8');
const MultiDocker = fs.readFileSync('./Dockerrun.aws.multi.json', 'utf8');
const createPackage = function(file, image, pdfImage, cert) {
  let awsJson = pdfImage ? MultiDocker : Dockerrun;
  console.log('Removing previous package.');
  try {
    fs.unlinkSync(`./${file}`);
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
  fs.writeFileSync('./Dockerrun.aws.json', result, 'utf8');
  child_process.execSync(`zip -r ${file} Dockerrun.aws.json certs/* conf.d/* .ebextensions/*`, {
    cwd: __dirname
  });
  console.log(`Done creating package.`);
  fs.unlinkSync('./Dockerrun.aws.json');
};
createPackage('latest.zip', 'formio/formio-enterprise');
createPackage('api-server.zip', SERVER_VERSION);
createPackage('pdf-server.zip', PDF_VERSION);
createPackage('multicontainer.zip', SERVER_VERSION, PDF_VERSION);
createPackage('multicontainer-gov.zip', SERVER_VERSION, PDF_VERSION, 'rds-combined-ca-us-gov-bundle');
