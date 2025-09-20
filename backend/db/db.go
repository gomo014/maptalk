package db

import (
    "context"
    "fmt"
    "github.com/jackc/pgx/v5/pgxpool"
    "log"
)

var Pool *pgxpool.Pool

func Connect() {
    dsn := "postgres://appuser:Asvseasvsa0@localhost:5432/appdb"
    var err error
    Pool, err = pgxpool.New(context.Background(), dsn)
    if err != nil {
        log.Fatalf("Unable to connect to database: %v\n", err)
    }

    fmt.Println("✅ Connected to PostgreSQL")
}