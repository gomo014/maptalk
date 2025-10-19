package controllers

import (
    "backend/db"
    "backend/api/models"
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

	// TODO: 認証機能が実装されたら、実際のユーザーIDに置き換える
	pin.UserID = 1

    query := `
        INSERT INTO pins (user_id, lat, lng, comment, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, created_at
    `
	err := db.Pool.QueryRow(c.Request.Context(),
        query,
        pin.UserID, pin.Lat, pin.Lng, pin.Comment, time.Now(),
    ).Scan(&pin.ID, &pin.CreatedAt)

    if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create pin: " + err.Error()})
        return
    }

	c.JSON(http.StatusCreated, pin)
}

func GetPins(c *gin.Context) {
	rows, err := db.Pool.Query(c.Request.Context(),
		"SELECT id, user_id, lat, lng, comment, created_at FROM pins ORDER BY created_at DESC")
    if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get pins: " + err.Error()})
        return
    }
    defer rows.Close()

    var pins []models.Pin
    for rows.Next() {
        var p models.Pin
        if err := rows.Scan(&p.ID, &p.UserID, &p.Lat, &p.Lng, &p.Comment, &p.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan pin: " + err.Error()})
            return
        }
        pins = append(pins, p)
    }

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating pins: " + err.Error()})
		return
	}

    c.JSON(http.StatusOK, pins)
}