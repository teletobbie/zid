# Zeebe Infrastructure Designer
A web-design tool to create, edit and deploy deployment diagrams using the Zeebe-API. The Zeebe Infrastructure Designer is developed with [React](https://reactjs.org/) and [Golang](https://golang.org/) using the [Zeebe-API](https://specials-gitea.kpn.org/zeebe/zeebeapi).

## Prerequisites
- Install [Golang](https://golang.org/dl/)
- Install [Node](https://nodejs.org/en/download/)

## Run in Docker
Run this project in Docker locally. 
1. Install [Docker](https://www.docker.com/)
2. `mkdir -p $GOPATH/src/github.com/teletobbie && cd $GOPATH/src/github.com/teletobbie`
3. `git clone git@github.com:teletobbie/zid.git && cd zid`
4. `docker build -t zid .`
5. `docker run -p 10000:10000 -p 3000:3000 --rm zid`
6. Go to http://localhost:3000/

## Or run locally
Run this project locally.

### Clone the project (step 1)
1. `mkdir -p $GOPATH/src/github.com/teletobbie && cd $GOPATH/src/github.com/teletobbie`
2. `git clone git@github.com:teletobbie/zid.git && cd zid`

### Run Golang backend server (step 2)
3. `go build`
4. `go run main.go`

### Run React frontend application (step 3)
5. `cd $GOPATH/src/github.com/teletobbie/zid/web`
6. `npm install && npm start`

## Graduation portfolio (in Dutch)
Contains written documents about this project: https://drive.google.com/drive/folders/1C6dKrEJLUndv3Mvy-A1Qx04L9ABdk9BA?usp=sharing

## ZID introduction Video:
15 minutes introduction video about the Zeebe Infrastructure Designer: https://youtu.be/7yhO_xiplIQ
