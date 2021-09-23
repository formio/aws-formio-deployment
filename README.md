This is the deployment files for AWS. Please see the [AWS Deployment Documentation](https://help.form.io/tutorials/deployment/aws/) for more information.


## Mount your own Portal Template to deployments

To manage Whitelabel Portal you can modify the html template and add your css styles from this repository: [Portal-Template](https://gitlab.com/formio/portal-template)

First, download multicontainer zip file to add our template config in our installation.
Unzip multicontainer zip and create a folder named portal, then we paste our [Portal-Template](https://gitlab.com/formio/portal-template) dist folder content inside.

Next, we need to add a volume to our docker-compose file to mount our template in the portal.
```  
api-server:
  image: formio/formio-enterprise:[version]
  ...
  volumes:
    ...
    - "./portal:/src/portal/template" 
```

Then we run our docker-compose file:

`$ docker-compose up`

Finally, now we can modify the deployed formio portal with our own css style and html template.
