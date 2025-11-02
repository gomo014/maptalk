package models

import "time"

type Pin struct {
    ID        int       `json:"id"`
    UserID    int       `json:"user_id"`
    Lat       float64   `json:"lat" binding:"required"`
    Lng       float64   `json:"lng" binding:"required"`
    Comment   string    `json:"comment" binding:"required"`
    CreatedAt time.Time `json:"created_at"`
    LikeCount int       `json:"like_count"`
	Liked     bool      `json:"liked"`
}