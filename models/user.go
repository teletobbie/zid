package models

import (
	"math/rand"
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID           uint           `gorm:"primary_key" json:"id"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Name         string         `gorm:"unique;not null" json:"name"`
	Email        string         `json:"email"`
	PictureIndex uint           `json:"picture_index"`
	Projects     []Project      `json:"projects"`
}

//Get a user by user id.
func GetUser(db *gorm.DB, id uint) (User, error) {
	var user User
	if err := db.Preload("Projects").Find(&user, id).Error; err != nil {
		return User{}, err
	}
	return user, nil
}

//Get a user by name.
func GetUserByName(db *gorm.DB, username string) (User, error) {
	var user User
	if err := db.Preload("Projects").Where("name = ?", username).First(&user).Error; err != nil {
		return User{}, err
	}
	return user, nil
}

//Creates a new user, but if user already exists then return that user record.
func NewUser(db *gorm.DB, name, email string) (User, error) {
	user := User{Name: name, Email: email}
	var count int64
	if db.Where(&user).First(&user).Count(&count); count > 0 {
		return user, nil
	}
	user.PictureIndex = uint(rand.Intn(24))
	if err := db.Create(&user).Error; err != nil {
		return User{}, err
	}
	return user, nil
}

//Get all projects by user id
func getProjectsByUserId(db *gorm.DB, id uint) ([]Project, error) {
	user, err := GetUser(db, id)
	if err != nil {
		return []Project{}, err
	}
	return user.Projects, nil
}
