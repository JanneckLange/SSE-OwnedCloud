# Readme
## Starting the dev environment
`docker-compose up`  

You can specify which script from *package.json* to execute via the **NPM_CMD** environment variable. If nothing is specified the **start** script will be executed.  
How an environment variable can be set depends on your shell, e.g. for fish shell:  
`set -x NPM_CMD test && docker-compose up`, to run the test suite.
