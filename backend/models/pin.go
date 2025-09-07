package models

import "time"

type Pin struct {
    ID        int       `json:"id"`
    UserID    int       `json:"user_id"`
    Lat       float64   `json:"lat"`
    Lng       float64   `json:"lng"`
    Comment   string    `json:"comment"`
    CreatedAt time.Time `json:"created_at"`
}