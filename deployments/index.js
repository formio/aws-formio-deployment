const fs = require('fs');
const path = require('path');
module.exports = {
    aws: {
        manifest: 'Dockerrun.aws.json',
        deployments: [
            {
                file: 'multicontainer.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'aws/Dockerrun.aws.multi.json'), 'utf8')
            },
            {
                file: 'multicontainer.latest.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'aws/Dockerrun.aws.multi.json'), 'utf8'),
                latest: true
            },
            {
                file: 'multicontainer.ssl.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'aws/Dockerrun.aws.ssl.json'), 'utf8'),
                ssl: true
            },
            {
                file: 'multicontainer.gov.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'aws/Dockerrun.aws.multi.json'), 'utf8'),
                cert: 'rds-combined-ca-us-gov-bundle'
            },
            {
                file: 'multicontainer.gov.ssl.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'aws/Dockerrun.aws.ssl.json'), 'utf8'),
                cert: 'rds-combined-ca-us-gov-bundle',
                ssl: true
            },
            {
                file: 'api-server.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'aws/Dockerrun.aws.server.json'), 'utf8')
            },
            {
                file: 'submission-server.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'aws/Dockerrun.aws.sub.json'), 'utf8')
            },
            {
                file: 'submission-server.gov.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'aws/Dockerrun.aws.sub.json'), 'utf8'),
                cert: 'rds-combined-ca-us-gov-bundle'
            },
            {
                file: 'submission-server.gov.ssl.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'aws/Dockerrun.aws.sub.ssl.json'), 'utf8'),
                cert: 'rds-combined-ca-us-gov-bundle',
                ssl: true
            }
        ]
    },
    compose: {
        manifest: 'docker-compose.yml',
        deployments: [
            {
                file: 'multicontainer.local.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.yml'), 'utf8')
            },
            {
                file: 'multicontainer.latest.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.yml'), 'utf8'),
                latest: true
            },
            {
                file: 'multicontainer.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.prod.yml'), 'utf8')
            },
            {
                file: 'multicontainer.next.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.next.yml'), 'utf8')
            },
            {
                file: 'multicontainer.next.local.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.next.local.yml'), 'utf8')
            },
            {
                file: 'multicontainer.ssl.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.ssl.yml'), 'utf8'),
                ssl: true
            },
            {
                file: 'multicontainer.gov.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.prod.yml'), 'utf8'),
                cert: 'rds-combined-ca-us-gov-bundle'
            },
            {
                file: 'multicontainer.gov.ssl.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.ssl.yml'), 'utf8'),
                cert: 'rds-combined-ca-us-gov-bundle',
                ssl: true
            },
            {
                file: 'api-server.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.server.yml'), 'utf8')
            },
            {
                file: 'submission-server.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.sub.yml'), 'utf8')
            },
            {
                file: 'submission-server.gov.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.sub.yml'), 'utf8'),
                cert: 'rds-combined-ca-us-gov-bundle'
            },
            {
                file: 'submission-server.gov.ssl.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.sub.ssl.yml'), 'utf8'),
                cert: 'rds-combined-ca-us-gov-bundle',
                ssl: true
            },
            {
                file: 'pdf-server.zip',
                manifest: fs.readFileSync(path.join(__dirname, 'compose/docker-compose.pdf.yml'), 'utf8')
            }
        ]
    }
};