package models

import (
	"time"

	"gorm.io/gorm"
)

type Diagram struct {
	ID        uint           `gorm:"primary_key" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Data      string         `json:"data"`
	ProjectID uint           `gorm:"index" json:"project_id"`
	Instances []Instance     `json:"instances"`
}

//Search and return the diagram record by diagram id if found from the database. 
func GetDiagram(db *gorm.DB, id uint) (Diagram, error) {
	var diagram Diagram
	if err := db.Preload("Instances").Find(&diagram, id).Error; err != nil {
		return Diagram{}, err
	}
	return diagram, nil
}

//Add a new diagram record in the database.
//First search the project by ticketnumber and then create a new diagram association under this project.
//Save the project and return the newly created diagram.  
func AddDiagram(db *gorm.DB, data string, ticketNumber string) (Diagram, error) {
	project, err := GetProjectByTicketNumber(db, ticketNumber)
	if err != nil {
		return Diagram{}, err
	}

	diagram := Diagram{Data: data}
	db.Model(&project).Association("Diagrams").Append(&diagram)
	if err := db.Save(&project).Error; err != nil {
		return Diagram{}, err
	}

	return diagram, nil
}

//Update a diagram record
//Gets a diagram by uint, if diagram not found return empty diagram and error
//
//Diagram found? Then update the data and return the updated diagram. 
func UpdateDiagram(db *gorm.DB, id uint, data string) (Diagram, error) {
	var diagram, err = GetDiagram(db, id)
	if err != nil {
		return Diagram{}, err
	}
	diagram.Data = data
	db.Save(&diagram)
	return diagram, nil
}

//Delete a diagram and it's associations.
func DeleteDiagram(db *gorm.DB, id uint) (Diagram, error) {
	var diagram, err = GetDiagram(db, id)
	if err != nil {
		return Diagram{}, err
	}
	if len(diagram.Instances) > 0 {
		db.Model(&diagram).Association("Instances").Clear()
		for _, diagramInstance := range diagram.Instances {
			_, err := DeleteInstance(db, diagramInstance.ID)
			if err != nil {
				return Diagram{}, err
			}
		}
	}
	if err := db.Delete(&diagram).Error; err != nil {
		return Diagram{}, err
	}
	return diagram, nil
}
