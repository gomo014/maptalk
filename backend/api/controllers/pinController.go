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
	// TODO: 認証機能が実装されたら、実際のユーザーIDに置き換える
	currentUserID := 1

	query := `
		SELECT
			p.id,
			p.user_id,
			p.lat,
			p.lng,
			p.comment,
			p.created_at,
			COUNT(l.id) as like_count,
			EXISTS(SELECT 1 FROM likes WHERE pin_id = p.id AND user_id = $1) as liked
		FROM
			pins p
		LEFT JOIN
			likes l ON p.id = l.pin_id
		GROUP BY
			p.id
		ORDER BY
			p.created_at DESC
	`
	rows, err := db.Pool.Query(c.Request.Context(), query, currentUserID)
    if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get pins: " + err.Error()})
        return
    }
    defer rows.Close()

    var pins []models.Pin
    for rows.Next() {
        var p models.Pin
		if err := rows.Scan(&p.ID, &p.UserID, &p.Lat, &p.Lng, &p.Comment, &p.CreatedAt, &p.LikeCount, &p.Liked); err != nil {
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

func LikePin(c *gin.Context) {
	pinID := c.Param("id")
	// TODO: 認証機能が実装されたら、実際のユーザーIDに置き換える
	userID := 1

	query := `
		INSERT INTO likes (user_id, pin_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, pin_id) DO NOTHING
	`
	_, err := db.Pool.Exec(c.Request.Context(), query, userID, pinID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like pin: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "liked"})
}

func UnlikePin(c *gin.Context) {
	pinID := c.Param("id")
	// TODO: 認証機能が実装されたら、実際のユーザーIDに置き換える
	userID := 1

	query := "DELETE FROM likes WHERE user_id = $1 AND pin_id = $2"
	_, err := db.Pool.Exec(c.Request.Context(), query, userID, pinID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unlike pin: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "unliked"})
}