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

    api := r.Group("/api")
    {
        api.POST("/pins", controllers.CreatePin)
        api.GET("/pins", controllers.GetPins)
    }

    return r
}