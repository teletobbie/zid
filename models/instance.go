package models

import (
	"time"

	"gorm.io/gorm"
	"github.com/teletobbie/zid/types"
)

type Instance struct {
	ID        uint           `gorm:"primary_key" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Key       uint           `json:"key"`
	DiagramID uint           `gorm:"index" json:"diagram_id"`
}

//Search and return a Instance by instance id.
func GetInstance(db *gorm.DB, id uint) (Instance, error) {
	var instance Instance
	if err := db.Find(&instance, id).Error; err != nil {
		return Instance{}, err
	}
	return instance, nil
}

//Insert a set of new instances by []newSystemResponse.
//Returns list of instances or error.
func InsertInstances(db *gorm.DB, newSystemResponses []types.NewSystemResponse, diagramID uint) ([]Instance, error) {
	diagram, err := GetDiagram(db, diagramID)
	if err != nil {
		return []Instance{}, err
	}
	instances := []Instance{}

	for _, newSystem := range newSystemResponses {
		if newSystem.Code == 200 {
			instance := Instance{Key: uint(newSystem.ID)}
			instances = append(instances, instance)
		}
	}

	db.Model(&diagram).Association("Instances").Append(&instances)
	if err := db.Save(&instances).Error; err != nil {
		return []Instance{}, err
	}

	return instances, nil
}

//Delete a instance.
//TODO: By deleting a instance also terminate the instance in Zeebe?
func DeleteInstance(db *gorm.DB, id uint) (Instance, error) {
	instance, err := GetInstance(db, id)
	if err != nil {
		return Instance{}, err
	}
	if err := db.Delete(&instance, id).Error; err != nil {
		return Instance{}, err
	}
	
	return instance, nil
}
