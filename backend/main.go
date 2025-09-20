package main

import (
    "backend/db"
    "backend/routes"
)

func main() {
    db.Connect()
    r := routes.SetupRouter()
    r.Run(":8080")
}