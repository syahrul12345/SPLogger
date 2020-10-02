package database

import (
	"fmt"
	"log"
	"os"
	"spdigital/apps/database/models"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
)

var db *gorm.DB //database

func init() {
	godotenv.Load()
	var dbHost string
	var port string
	if os.Getenv("PROD") == "true" {
		dbHost = os.Getenv("DB_HOST")
		port = os.Getenv("DB_PORT")
	} else {
		dbHost = "localhost"
		port = "5433"
	}
	username := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")
	dbURI := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s port=%s", dbHost, username, dbName, password, port) //Build connection string
	log.Printf("Attempting to connect to %s\n", dbURI)
	conn, err := gorm.Open("postgres", dbURI)
	if err != nil {
		fmt.Print(err)
	}

	db = conn
	db.Debug().AutoMigrate(&models.Appliance{}) //Database migration
}

//GetDB returns a handle to the DB object
func GetDB() *gorm.DB {
	return db
}
