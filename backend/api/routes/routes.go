package routes

import (
    "backend/api/controllers"
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:5173", "http://localhost:3000"} 
    config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
    config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
    r.Use(cors.New(config))

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