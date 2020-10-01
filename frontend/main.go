package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println(err)
	}
	// Parse the flag
	prod := flag.Bool("prod", false, "determine if it is a dev output")
	flag.Parse()
	isProd := *prod

	var websitePath string
	if isProd {
		log.Println("Production build...")
		websitePath = ".build/"
	} else {
		websitePath = "./website/build"
	}

	fs := http.FileServer(http.Dir(websitePath))
	http.Handle("/", fs)

	port := os.Getenv("PORT")
	log.Printf("Listening on :%s ...", port)
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
	if err != nil {
		log.Fatal(err)
	}
}
