package main

import (
    "backend/db"
    "backend/api/routes"
)

func main() {
    db.Connect()
    r := routes.SetupRouter()
    r.Run(":8080")
}