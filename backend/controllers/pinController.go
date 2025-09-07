package controllers

import (
    "context"
    "maptalk-backend/db"
    "maptalk-backend/models"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

func CreatePin(c *gin.Context) {
    var pin models.Pin
    if err := c.ShouldBindJSON(&pin); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    query := `
        INSERT INTO pins (user_id, lat, lng, comment, created_at)
        VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at;
    `
    err := db.Pool.QueryRow(
        context.Background(),
        query,
        pin.UserID, pin.Lat, pin.Lng, pin.Comment, time.Now(),
    ).Scan(&pin.ID, &pin.CreatedAt)

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, pin)
}