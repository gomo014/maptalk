package routes

import (
    "backend/api/controllers"
    "github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()

    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "pong"})
    })

    r.POST("/pins", controllers.CreatePin)
    r.GET("/pins", controllers.GetPins)

    return r
}