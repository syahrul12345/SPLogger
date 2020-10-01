FROM golang:latest as stage1
WORKDIR /app

# Download all dependancies. Dependencies will be cached if the go.mod and go.sum files are not changed
COPY go.mod .
RUN go mod download

# Build the Go app
COPY . .
# Run tests before compilation
RUN go test -v ./...
# Compile
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .


# Stage 2.
FROM alpine:latest
RUN apk add bash

WORKDIR /app
COPY --from=stage1 /app/main .

COPY ./wait-for-it.sh ./
CMD ["./wait-for-it.sh", "db:5432", "--", "./main"]