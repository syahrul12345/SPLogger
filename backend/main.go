package main

import (
	"spdigital/apps/api"
	"spdigital/apps/database"
	_ "spdigital/apps/database"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	app := setupRouter()
	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "8889"
	}
	app.Run(":" + PORT)
}

// setup the gin router
func setupRouter() *gin.Engine {
	app := gin.New()
	gin.SetMode(gin.DebugMode)

	// Middlewares
	// Allow CORS from the AWS frontend. We store the AWS url in the environment
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", os.Getenv("FRONTEND_URL")},
		AllowMethods:     []string{"PUT", "PATCH", "OPTIONS", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	/**
		WebsiteRouter: Handle the dynamic routes for websites
		APIRouter: Handles all api calls
	**/
	APIRouter := app.Group("/api")
	// Register the route
	// Inject the database here as well
	db := database.GetDB()

	api.Register(APIRouter, db)
	return app
}
