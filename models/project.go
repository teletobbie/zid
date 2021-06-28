package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Project struct {
	ID           uint           `gorm:"primary_key" json:"id"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	TicketNumber string         `gorm:"size:6;unique;not null" json:"ticketnumber"`
	Name         string         `json:"name"`
	MailingList  string         `json:"mailinglist"`
	Environment  string         `gorm:"not null" json:"environment"`
	UserID       uint           `gorm:"index" json:"user_id"`
	Diagrams     []Diagram      `json:"diagrams"`
}

//Insert a new project record into the database. 
//
//Returns the newly inserted project or a error. 
func AddProject(db *gorm.DB, ticketNumber string, name string, mailingList string, environment string, username string) (Project, error) {
	user, err := GetUserByName(db, username)
	if err != nil {
		return Project{}, err
	}
	if checkIfTicketNumberExists(db, ticketNumber) {
		return Project{}, errors.New("Ticketnumber already exists.")
	}
	project := Project{TicketNumber: ticketNumber, Name: name, MailingList: mailingList, Environment: environment}
	db.Model(&user).Association("Projects").Append(&project)
	if err := db.Save(&user).Error; err != nil {
		return Project{}, err
	}

	return project, nil
}

//Returns a boolean if the ticketnumber already exists. 
func checkIfTicketNumberExists(db *gorm.DB, ticketNumber string) bool {
	var count int64
	db.Unscoped().Where("ticket_number = ?", ticketNumber).First(&Project{}).Count(&count)
	if count > 0 {
		return true
	}
	return false
}

//Returns a project by project id.
func GetProject(db *gorm.DB, id uint) (Project, error) {
	var project Project
	if err := db.Preload("Diagrams").Find(&project, id).Error; err != nil {
		return Project{}, err
	}
	return project, nil
}

//Returns a project by ticketnumber
func GetProjectByTicketNumber(db *gorm.DB, ticketNumber string) (Project, error) {
	var project Project
	if err := db.Preload("Diagrams").Where("ticket_number = ?", ticketNumber).First(&project).Error; err != nil {
		return Project{}, err
	}
	return project, nil
}

//Returns a project by username
func GetProjectsByUserName(db *gorm.DB, username string) ([]Project, error) {
	user, err := GetUserByName(db, username)
	if err != nil {
		return []Project{}, err
	}
	var projects []Project
	if err := db.Preload("Diagrams").Where("user_id = ?", user.ID).Find(&projects).Error; err != nil {
		return []Project{}, err
	}
	return projects, nil
}

//Get all diagrams by project id.
func GetProjectDiagramAssociations(db *gorm.DB, projectId uint) ([]Diagram, error) {
	project, err := GetProject(db, projectId)
	if err != nil {
		return []Diagram{}, err
	}
	var diagrams []Diagram
	for _, projectDiagram := range project.Diagrams {
		diagram, err := GetDiagram(db, projectDiagram.ID)
		if err != nil {
			return []Diagram{}, err
		}
		diagrams = append(diagrams, diagram)
	}
	return diagrams, nil
}

//Delete a project and it's associations.
func DeleteProject(db *gorm.DB, id uint) (Project, error) {
	project, err := GetProject(db, id)
	if err != nil {
		return Project{}, err
	}
	if len(project.Diagrams) > 0 {
		for _, projectDiagram := range project.Diagrams {
			_, err := DeleteDiagram(db, projectDiagram.ID)
			if err != nil {
				return Project{}, err
			}
		}
		db.Model(&project).Association("Diagrams").Clear()
	}
	if err := db.Delete(&project, id).Error; err != nil {
		return Project{}, err
	}
	return project, nil
}
