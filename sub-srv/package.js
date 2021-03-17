const SUBMISSION_SERVER_VERSION = 'formio/formio-enterprise:8.0.0-m.16';
const child_process = require("child_process");
const fs = require('fs');
const awsJson = fs.readFileSync(`${__dirname}/Dockerrun.aws.sub.json`, 'utf8');

const createPackage = function(file, image, cert) {
  console.log('Removing previous package.');
  try {
    fs.unlinkSync(`./${file}`);
  }
  catch (err) {}
  console.log(`Creating package ${file} with image ${image}`);
  var result = awsJson.replace(/"IMAGE"/g, `"${image}"`);
  if (cert) {
    result = result.replace(/rds-combined-ca-bundle/g, cert);
  }

  fs.writeFileSync(`${__dirname}/Dockerrun.aws.json`, result, 'utf8');
  child_process.execSync(`zip -r ${file} Dockerrun.aws.json certs/* conf.d/* .ebextensions/*`, {cwd: __dirname});
  child_process.execSync(`zip -r ${__dirname}/${file} certs/* .ebextensions/*`, {cwd: `${__dirname}/..`});
  child_process.execSync(`mv ${file} ../${file}`, {cwd: __dirname});

  console.log(`Done creating package.`);
  fs.unlinkSync(`${__dirname}/Dockerrun.aws.json`);
};

createPackage('submission-server.zip', SUBMISSION_SERVER_VERSION);
createPackage('submission-server-gov.zip', SUBMISSION_SERVER_VERSION, 'rds-combined-ca-us-gov-bundle');
