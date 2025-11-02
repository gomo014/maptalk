package controllers

import (
	"backend/api/models"
	"backend/db"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// RegisterUser handles user registration
func RegisterUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.PasswordHash = string(hashedPassword)

	// Insert user into database
	query := `
		INSERT INTO users (username, password_hash, created_at)
		VALUES ($1, $2, $3)
		RETURNING id, created_at
	`
	err = db.Pool.QueryRow(c.Request.Context(),
		query,
		user.Username, user.PasswordHash, time.Now(),
	).Scan(&user.ID, &user.CreatedAt)

	if err != nil {
		// Check for duplicate username error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user: " + err.Error()})
		return
	}

	// Do not return password hash
	user.Password = ""
	c.JSON(http.StatusCreated, user)
}

// Login handles user login
func Login(c *gin.Context) {
	var loginRequest models.User
	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var storedUser models.User
	query := `SELECT id, username, password_hash FROM users WHERE username = $1`
	err := db.Pool.QueryRow(c.Request.Context(), query, loginRequest.Username).Scan(&storedUser.ID, &storedUser.Username, &storedUser.PasswordHash)

	if err != nil {
		// ユーザーが見つからない場合も "Invalid credentials" を返す
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// パスワードを比較
	err = bcrypt.CompareHashAndPassword([]byte(storedUser.PasswordHash), []byte(loginRequest.Password))
	if err != nil {
		// パスワードが一致しない場合
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// TODO: ログイン成功後、セッショントークン（JWTなど）を生成して返す
	// 今回は成功メッセージのみを返す

	c.JSON(http.StatusOK, gin.H{
		"message":  "Login successful",
		"user_id":  storedUser.ID,
		"username": storedUser.Username,
	})
}