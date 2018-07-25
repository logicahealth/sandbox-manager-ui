# HSPC Sandbox Manager

Welcome to the HSPC Sandbox Manager!  

# HSPC Sandbox

*Note:* If you are wanting to build and test SMART on FHIR Apps, it is recommended that you use the free cloud-hosted version of the HSPC Sandbox.

[HSPC Sandbox](https://sandbox.hspconsortium.org)

### How do I get set up? ###

#### Get the lib project into the 'projects' folder ####
The following code will checkout the lib project into the correct folder
and link it to npm so that it can be used as a standard node module. 

    cd projects
    git clone git@bitbucket.org:hspconsortium/sandbox-manager-lib.git
    cd sandbox-manager-lib
    npm link
    cd ../../
    npm link sandbox-manager-lib

#### Build and Deploy ####
    ./run-local.sh

#### Build and Deploy Using Docker ####
    ./run-local-docker.sh

#### Verify

* http://localhost:8080/

#### Configuration ####

Various property files configure the sandbox manager:

 * package.json

#### System Dependencies ####
When run locally, the sandbox manager has dependencies on the following systems/projects.  Each of these projects contains a "run-local" script in the root folder.

 * [HSPC Reference Auth](https://bitbucket.org/hspconsortium/reference-auth)
 * [HSPC Reference API](https://bitbucket.org/hspconsortium/reference-api) in DSTU2 or STU3 mode
 * [HSPC Reference Messaging](https://bitbucket.org/hspconsortium/reference-messaging)
 * [HSPC Account](https://bitbucket.org/hspconsortium/account)
 * [HSPC Patient Data Manager](https://bitbucket.org/hspconsortium/patient-data-manager)
 * [HSPC Sandbox Manager API](https://bitbucket.org/hspconsortium/sandbox-manager-api)

### Where to go from here ###
https://healthservices.atlassian.net/wiki/display/HSPC/Healthcare+Services+Platform+Consortium
