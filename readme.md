# Readme
## Project
This project is meant to have security issues as a playground for pentesters! There should be a total of five security issues. If you find more..you are good :)

## Starting the dev environment
`docker-compose up`  

You can specify which script from *package.json* to execute via the **NPM_CMD** environment variable. If nothing is specified the **start** script will be executed.  
You can also specify the restart policy for the node docker container via the **CONTAINER_RESTART** environment variable. If nothing is specified the container will not restart.  

How an environment variable can be set depends on your shell, e.g. for fish shell:  
`set -x NPM_CMD test && docker-compose up`, to run the test suite.

