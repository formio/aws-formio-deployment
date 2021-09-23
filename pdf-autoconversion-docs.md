# Services
* ###pdf-server
  Environment variables that were added:
    * `PDFLIBS_URL` **(required)** - PDF libs service URL 
    * `PDFCONVERTER_URL` - PDF converter service URL
* ###pdf-libs
  PDF libs is the service that wraps [pdf2htmlEX](https://github.com/coolwanglu/pdf2htmlEX) and [poppler-pdf-to-json](https://gitlab.com/formio/pdf-to-json) libraries with the REST API. Currently can be used only in docker container.
* ###pdf-converter
  PDF converter is the service that provides API for extraction fields information from PDF document and converting them to Formio forms JSON format.
  It includes **fillable conversion** and **nonfillable conversion**. 
  
  **Fillable conversion** is used for documents that have interactive form components, so-called form fields.
  
  **Nonfillable conversion** is used documents that don't have form fields or form fields cannot be extracted for some reason.

# Fillable conversion
PDF libs service is required for fillable conversion. 
It uses poppler library to extract form fields data from document.
If fillable conversion fails for some reason, for example no form fields in the document or incompatible document format, nonfillable conversion is used.
# Non-fillable conversion
Nonfillable conversion uses Amazon Textract service for extracting nonfillable form fields data from documents
It also requires S3 bucket for storing Amazon Textract input and output files and AWS Simple Notification Service for notifying when Textract job is complete.
If any required AWS environment variable will not be presented, nonfillable conversion will be disabled.
## Amazon Textract
Amazon Textract is the service that does all recognition job. To use it you need to create IAM role with these policies:
* AmazonTextractServiceRole
* AmazonSNSFullAccess
You need to save the ARN of the created role
## AWS S3
AWS S3 is used as a storage for input and output files.
You should use your main pdf-server S3 bucket as input bucket as alll your pdfs will be stored here.
You can also use it as output bucket, or you can use different bucket for storing output files.
## AWS SNS
AWS Simple Notification Service is used to notify PDF converter about Textract job completion.
You need to create topic that will be used for notifying pdf-converter about Textract job completion.
Then save the topic ARN
### SNS listener
SNS listener is the http server included in th pdf-converter. 
After subscribing to the SNS topic(it will be done automatically), it will receive http requests and that will mean that corresponding Textract job is complete.
In docker-compose file SNS listener port will be `4444` by default.
When configuring Elastic Beanstalk environment you will need to set up `SNS_LISTENER_ENDPOINT` environment variable.

It should be `{your environment URL}:{SNS listener port(4444 by default)}`

# Elastic Beanstalk Load Balancer
To use nonfillable conversion you should modify load balancer configuration.
1. Create new load balancer process on http protocol and port `4444`(or other if changed)
2. Create new listener on http protocol and the same port. Set default process to previously created process.

# Security groups
You need to create SNS listener security group and attach it to the environment.

It should allow:
* inbound traffic from any source on SNS listener port
* outbound traffic for any port and any destination
