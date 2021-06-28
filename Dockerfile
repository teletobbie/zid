# Build the Go API
FROM golang:latest as go_builder
RUN mkdir /zid
WORKDIR /zid
COPY . /zid
RUN GOOS=linux GOARCH=amd64 go build -a -ldflags "-linkmode external -extldflags '-static' -s -w" -o /go/bin/zid

# Build the React application
FROM node:alpine as node_builder
COPY --from=go_builder /zid/web ./web
WORKDIR /web
RUN npm install

# Final stage build, this will be the container with Go and React
FROM node:alpine
RUN apk --no-cache add ca-certificates procps 
COPY --from=go_builder /go/bin/zid /go/zid
COPY --from=go_builder /zid/static /go/static 
COPY --from=go_builder /zid/ca /go/ca
COPY --from=node_builder /web /web
COPY --from=go_builder /zid/start.sh /go/start.sh
RUN chmod +x /go/start.sh
EXPOSE 3000 10000
WORKDIR /go
CMD ./start.sh



