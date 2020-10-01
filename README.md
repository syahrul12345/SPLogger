# Appliance Logger

### [Livedemo](https://www.syahrultest.com)


This is an appliance logger project.


The frontend and backend are deployed on two different cloud provider:

1) Frontend - AWS public IP (54.255.92.224 / https://syahrultest.com)
2) Backend  - GCP public IP (34.87.28.122 / https://syahrultest2.com) 

For more in-depth documentation on individual services, please go to the `backend` or `frontend` folders in this repository.

## Build
Both servers are running on Ubuntu 18.04, and have `docker` as well as `docker-compose` installed. We can simply clone this repository as such

### Environment variables.
Each subfolder has `sample.env`. Please change it accordingly, and save it as `.env`. 

For frontend, we have to specify the URL of the backend services as such:
```
PORT=80
REACT_APP_BACKEND_URL=https://syahrultest2.com
```

For backend, since the frontend is served from a seperate ubuntu instance, we have to specify where are the requests coming from to enable CORS.
```
FRONTEND_URL=https://syahrultest.com
```



### Building frontend
```
git clone https://github.com/syahrul12345/appliancelogger.git
cd appliancelogger/frontend
docker-compose up -d
```

### Building backend
```
git clone https://github.com/syahrul12345/appliancelogger.git
cd appliancelogger/backend
docker-compose up -d
```

### Tests
Tests are executed during the build process and defined in the individual `Dockerfile`.

