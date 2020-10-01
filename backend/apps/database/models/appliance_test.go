package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestApplianceRequestValidate(t *testing.T) {
	appliance := &Appliance{
		ID:             0,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
		SerialNumber:   "123",
		Brand:          "Mitsubishi",
		Status:         "New",
		ApplianceModel: "Lancer",
		DateBought:     "Today",
	}
	err := appliance.Validate()
	assert.Nil(t, err)
	// Check if all has been lower cased
	assert.Equal(t, "123", appliance.SerialNumber)
	assert.Equal(t, "mitsubishi", appliance.Brand)
	assert.Equal(t, "new", appliance.Status)
	assert.Equal(t, "lancer", appliance.ApplianceModel)
	assert.Equal(t, "today", appliance.DateBought)
}
