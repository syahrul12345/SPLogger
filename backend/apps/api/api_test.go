package api

import (
	"spdigital/apps/database/models"
	"encoding/json"
	"io/ioutil"
	"testing"

	"gotest.tools/assert"
)

// TESTS ARE DEFINED BELOW. Mokcs are defined in
func TestGetAll(t *testing.T) {
	w := performRequest(Router, "GET", "/getall", "", nil)

	body, _ := ioutil.ReadAll(w.Body)
	appliances := []models.Appliance{}
	json.Unmarshal(body, &appliances)

	assert.Equal(t, 1, len(appliances))
	assert.Equal(t, "tefal", appliances[0].Brand)
	assert.Equal(t, 200, w.Code)
}

func TestAddAppliance(t *testing.T) {
	appliance := &models.Appliance{
		SerialNumber:   "1234",
		Brand:          "Tefal",
		Status:         "New",
		ApplianceModel: "Vios",
		DateBought:     "12-12-2009",
	}
	appliance.Validate()
	applianceByte, _ := json.Marshal(appliance)
	w := performRequest(Router, "POST", "/add", string(applianceByte), nil)
	body, _ := ioutil.ReadAll(w.Body)
	appliances := models.Appliance{}
	json.Unmarshal(body, &appliances)
	assert.Equal(t, 200, w.Code)
}

func TestEditAppliance(t *testing.T) {
	appliance := &models.Appliance{
		SerialNumber:   "1234",
		Brand:          "Tefal",
		Status:         "New",
		ApplianceModel: "Vios",
		DateBought:     "12-12-2009",
	}
	appliance.Validate()
	applianceByte, _ := json.Marshal(appliance)
	w := performRequest(Router, "POST", "/edit", string(applianceByte), nil)
	body, _ := ioutil.ReadAll(w.Body)
	appliances := models.Appliance{}
	json.Unmarshal(body, &appliances)
	assert.Equal(t, 200, w.Code)
}
