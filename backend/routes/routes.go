package routes

import (
    "maptalk-backend/controllers"
    "github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()

    r.POST("/pins", controllers.CreatePin)

    return r
}