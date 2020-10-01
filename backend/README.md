# Backend

## Quickstart

Make sure to have docker installed on your machine.

```
git clone https://github.com/syahrul12345/appliance
cd appliance/backend
docker-compose up -d
```

For more information of the build process, please go to [building](#building)

This is the documentation for the backend. The backend serves the API to

1. Get all appliances
2. Add Appliances
3. Edit Appliances
4. Delete Appliances

These API are exposed via the endpoint `/api/`. I have choosen to package all the functinalities of these api in it's onw `api` package, located
in `apps/api`.

## Libraries

I have decided to use some lightweight libraries for cleaner and simpler code.

1. Gin-Gonic : Webframework
2. GORM: Golang ORM library
3. go-sql mock

## Entrypoint

The Entrypoint to the backend is `main.go`. Here, we create a gin engine, which will be the webserver. We then createa an `/api` router, and then register three main routes to it, `/getAll`,`/add`,`/edit/`,`/delete`. The register function can be seen direcly in the `api` package, in `/apps/api`.

## Database Injection

Looking at the imports, we import the `database` package with `_` to trigger it's `init()` function. This opens a database connection upon starting the application.

```
_ "spdigital/apps/database"
```

We can then grab the database connection object from the package directly from `main.go`

```
db := database.GetDB()
```

We can then inject this `db` into the `Register` function. This `db` object is then further injected into individual route handlers.

```
func Register(router *gin.RouterGroup, db *gorm.DB) {
	router.GET("/getall", getAllAppliancesHandler(db))
	router.POST("/add", addHandler(db))
	router.POST("/edit", editHandler(db))
}
```

I have choosen this design so that we can easily mock the database to test our routes:

```
func defineEditApplianceMock(app *gin.Engine) {
	// Define all our mock DB and inject here
	mockDB, mock, _ := sqlmock.New()
	sqlxDB := sqlx.NewDb(mockDB, "sqlmock")
	mockAppliance := &models.Appliance{
		SerialNumber:   "1234",
		Brand:          "Tefal",
		Status:         "New",
		ApplianceModel: "Vios",
		DateBought:     "12-12-2009",
	}
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
```

## Building

We define the build step in the local `Dockerfile`. I have decided to use a multi-stage build, so as to reduce the final container size even smaller.
In the first stage of the build, the golang image is pulled. We run tests in this stage, and if the test fails, this build will exist

```
RUN go test -v ./...
```

We then simply compile our go binary using the go linux compiler

```
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .
```

Next we prepare the next stage which is a lightweight alpine linux container.

```
# Stage 2.
FROM alpine:latest
```

Copy the previously compiled go binary into this new container

```
COPY --from=stage1 /app/main .
```

Because this app requires a database, we need to also connect to the database container. However, since there is no guarantee that the database container will be running before the application container, we use a script to wait for the database to open first.

```
COPY ./wait-for-it.sh ./
CMD ["./wait-for-it.sh", "db:5432", "--", "./main"]
```

### Docker-compose

Instead of merely using a dockerfile, i have also used a docker-compose configuration. This allows me to also orchestrate the deployment of the postgres container. Secondly, it makes deployment easier by allowing us to easily set environment variables and also deploy using a shorter command:

```
docker-compose up -d
```

By using docker + docker-compose, this app can be deployed with just one command.
