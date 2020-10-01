package models

import (
	"errors"
	"strings"
	"time"
)

// Appliance is the object that holds information regarding an appliance
type Appliance struct {
	ID             uint
	CreatedAt      time.Time
	UpdatedAt      time.Time
	SerialNumber   string `gorm:"unique;not null" json:"SerialNumber"`
	Brand          string `gorm:"unique;not null" json:"Brand"`
	Status         string `gorm:"not null" json:"Status"`
	ApplianceModel string `gorm:"unique;not null" json:"Model"`
	DateBought     string `gorm:"not null" json:"DateBought"`
}

// Validate the appliace once it comes in from the client
func (a *Appliance) Validate() error {
	if a.SerialNumber == "" {
		return errors.New("Serial number must be provided")
	}
	if a.Brand == "" {
		return errors.New("Brand must be provided")
	}
	if a.Status == "" {
		return errors.New("Status must be provided")
	}
	if a.ApplianceModel == "" {
		return errors.New("Model must be provided")
	}
	if a.DateBought == "" {
		return errors.New("Date bought must be provided")
	}
	// Lowercase everything
	a.SerialNumber = strings.ToLower(a.SerialNumber)
	a.Brand = strings.ToLower(a.Brand)
	a.Status = strings.ToLower(a.Status)
	a.ApplianceModel = strings.ToLower(a.ApplianceModel)
	a.DateBought = strings.ToLower(a.DateBought)
	return nil
}
