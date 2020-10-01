package api

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

// Register api routes
func Register(router *gin.RouterGroup, db *gorm.DB) {
	router.GET("/getall", getAllAppliancesHandler(db))
	router.GET("/search", filterHandler(db))
	router.POST("/add", addHandler(db))
	router.POST("/edit", editHandler(db))
	router.DELETE("/delete", deleteHandler(db))
}
