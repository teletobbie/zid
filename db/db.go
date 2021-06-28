package db

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"github.com/teletobbie/zid/models"
)

//Set database constraints
func setConstraints(db *gorm.DB) {
	db.Migrator().CreateConstraint(&models.User{}, "Projects")
	db.Migrator().CreateConstraint(&models.User{}, "fk_users_projects")
	db.Migrator().CreateConstraint(&models.Project{}, "Diagrams")
	db.Migrator().CreateConstraint(&models.Project{}, "fk_projects_diagrams")
	db.Migrator().CreateConstraint(&models.Diagram{}, "Instances")
	db.Migrator().CreateConstraint(&models.Diagram{}, "fk_diagrams_instances")
}

//get de sqlite database by opening and initialize the database. 
func GetDB() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("zid.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return db, nil
}

//Initialize database
func Init() {
	db, err := GetDB()
	if err != nil {
		log.Fatal("Could not open the database because of " + err.Error())
	}

	db.AutoMigrate(&models.User{}, &models.Project{}, &models.Diagram{}, &models.Instance{})
	setConstraints(db)

	log.Println("\033[33m", "Database initizalation successful.", "\033[0m")
}
