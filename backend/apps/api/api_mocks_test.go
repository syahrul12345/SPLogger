package api

import (
	"bytes"
	"spdigital/apps/database/models"
	"database/sql/driver"
	"net/http"
	"net/http/httptest"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/jmoiron/sqlx"
)

type AnyTime struct{}

// Match satisfies sqlmock.Argument interface
func (a AnyTime) Match(v driver.Value) bool {
	_, ok := v.(time.Time)
	return ok
}

// Router defiens the mock router
var Router *gin.Engine

func init() {
	Router = SetUpMockRouter()
}

// SetUpMockRouter will setup a mock router for the tests
func SetUpMockRouter() *gin.Engine {
	app := gin.Default()
	defineGetAllApplianceMock(app)
	defineAddApplianceMock(app)
	defineEditApplianceMock(app)
	return app
}

func defineGetAllApplianceMock(app *gin.Engine) {
	// Define all our mock DB and inject here
	mockDB, mock, _ := sqlmock.New()
	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")
	mockAppliance := &models.Appliance{
		SerialNumber:   "123",
		Brand:          "tefal",
		Status:         "new",
		ApplianceModel: "kettle",
		DateBought:     "2020-06-25 13:22:38.160021+00",
	}
	mockAppliance.Validate()
	mockRow := getApplianceMockRow(mockAppliance)
	mock.ExpectQuery(`SELECT \* FROM "appliances"`).
		WithArgs().
		WillReturnRows(mockRow)

	gormDB, _ := gorm.Open("postgres", sqlxDB)
	app.GET("/getall", getAllAppliancesHandler(gormDB))
}

func defineAddApplianceMock(app *gin.Engine) {
	// Define all our mock DB and inject here
	mockDB, mock, _ := sqlmock.New()
	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")
	mockAppliance := &models.Appliance{
		SerialNumber:   "1234",
		Brand:          "tefal",
		Status:         "new",
		ApplianceModel: "vios",
		DateBought:     "12-12-2009",
	}
	mockAppliance.Validate()
	mock.ExpectBegin()
	mock.ExpectQuery(`INSERT INTO "appliances" \("created_at","updated_at","serial_number","brand","status","appliance_model","date_bought"\) VALUES \(\$1,\$2,\$3,\$4,\$5,\$6,\$7\) RETURNING "appliances"\."id"`).
		WithArgs(
			AnyTime{},
			AnyTime{},
			mockAppliance.SerialNumber,
			mockAppliance.Brand,
			mockAppliance.Status,
			mockAppliance.ApplianceModel,
			mockAppliance.DateBought,
		).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
	mock.ExpectCommit()
	gormDB, _ := gorm.Open("postgres", sqlxDB)
	app.POST("/add", addHandler(gormDB))
}

func defineEditApplianceMock(app *gin.Engine) {
	// Define all our mock DB and inject here
	mockDB, mock, _ := sqlmock.New()
	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")
	mockAppliance := &models.Appliance{
		SerialNumber:   "1234",
		Brand:          "tefal",
		Status:         "new",
		ApplianceModel: "vios",
		DateBought:     "12-12-2009",
	}
	mockAppliance.Validate()
	mockRows := getApplianceMockRow(mockAppliance)
	mock.ExpectQuery(`SELECT \* FROM "appliances" WHERE \(id \= \$1\)`).
		WithArgs(
			0,
		).WillReturnRows(mockRows)
	mock.ExpectBegin()
	mock.ExpectQuery(`INSERT INTO "appliances" \("created_at","updated_at","serial_number","brand","status","appliance_model","date_bought"\) VALUES \(\$1,\$2,\$3,\$4,\$5,\$6,\$7\) RETURNING "appliances"\."id"`).
		WithArgs(
			AnyTime{},
			AnyTime{},
			mockAppliance.SerialNumber,
			mockAppliance.Brand,
			mockAppliance.Status,
			mockAppliance.ApplianceModel,
			mockAppliance.DateBought,
		).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
	mock.ExpectCommit()
	gormDB, _ := gorm.Open("postgres", sqlxDB)
	app.POST("/edit", editHandler(gormDB))
}

// Helper to perform the request
// PerformRequest is a helper function to make a POST request to our GBCallback endpoint
func performRequest(r http.Handler, method, path string, reqBodyString string, headers map[string]string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, bytes.NewBuffer([]byte(reqBodyString)))

	// set headers
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func getApplianceMockRow(model *models.Appliance) *sqlmock.Rows {
	return sqlmock.NewRows([]string{"id", "created_at", "updated_at", "serial_number", "brand", "status", "appliance_model", "date_bought"}).
		AddRow(int64(1), model.CreatedAt, model.UpdatedAt, model.SerialNumber, model.Brand, model.Status, model.ApplianceModel, model.DateBought)
}
