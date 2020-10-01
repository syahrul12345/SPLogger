package api

import (
	"spdigital/apps/database/models"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/jinzhu/gorm"
)

func getAllAppliancesHandler(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		// Query database and return all applianciances
		appliances := &[]models.Appliance{}
		db.Find(appliances)
		c.JSON(200, appliances)
	}
}

func addHandler(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		// Parse the payliad
		addApplianceQuery := &models.Appliance{}
		addApplianceQuery.CreatedAt = time.Now()
		addApplianceQuery.UpdatedAt = time.Now()
		err := c.ShouldBindWith(addApplianceQuery, binding.JSON)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, err.Error())
			return
		}

		// Validate the payload
		err = addApplianceQuery.Validate()
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
			return
		}

		// Create no db
		err = db.Create(addApplianceQuery).Error
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
			return
		}

		c.JSON(http.StatusOK, addApplianceQuery)
	}

}

func editHandler(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		// Front end will send the object
		editApplianceQuery := &models.Appliance{}
		editApplianceQuery.UpdatedAt = time.Now()
		err := c.ShouldBindWith(editApplianceQuery, binding.JSON)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, err.Error())
			return
		}
		// Find if it already exists
		err = db.Where("id = ?", editApplianceQuery.ID).Find(&models.Appliance{}).Error
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
			return
		}
		// Edit the appliance directly
		err = db.Save(editApplianceQuery).Error
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, editApplianceQuery)
	}
}

func deleteHandler(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		// Front end will send the object
		editApplianceQuery := &models.Appliance{}
		editApplianceQuery.UpdatedAt = time.Now()
		err := c.ShouldBindWith(editApplianceQuery, binding.JSON)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, err.Error())
			return
		}
		// Find if it already exists
		err = db.Where("id = ?", editApplianceQuery.ID).Find(&models.Appliance{}).Error
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
			return
		}

		// Edit the appliance directly
		err = db.Delete(editApplianceQuery).Error
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"Status": true,
		})
	}
}

func filterHandler(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		filterToKey := map[string]string{
			"SerialNumber": "serial_number",
			"Brand":        "brand",
			"Model":        "appliance_model",
			"Status":       "status",
			"DateBought":   "date_bought",
		}
		// Pull the URL query parameters
		filterName := c.Query("filter")
		searchObject := c.Query("search")

		queryString := fmt.Sprintf("%s = ?", filterToKey[filterName])

		// Search the db
		result := &[]models.Appliance{}
		err := db.Where(queryString, searchObject).Find(result).Error
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, result)
	}
}
