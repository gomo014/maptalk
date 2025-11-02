package models

import "time"

type User struct {
	ID           int       `json:"id"`
	Username     string    `json:"username" binding:"required"`
	Password     string    `json:"password,omitempty" binding:"required"`
	PasswordHash string    `json:"-"` // パスワードハッシュはJSONレスポンスに含めない
	CreatedAt    time.Time `json:"created_at"`
}