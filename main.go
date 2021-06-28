package main

import (
	"log"

	"github.com/teletobbie/zid/db"
	"github.com/teletobbie/zid/routes"
	//"github.com/teletobbie/zid/worker"
)

func main() {
	log.Println("\033[33m", "Hello from server! I am now started up!", "\033[0m")
	//go worker.Start() //only for local zeebe docker compose
	db.Init()
	routes.HandleRequests()
}
