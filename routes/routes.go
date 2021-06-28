package routes

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/teletobbie/zid/db"
	"github.com/teletobbie/zid/deployment"
	"github.com/teletobbie/zid/models"
	"github.com/teletobbie/zid/routes/utils"
	"github.com/teletobbie/zid/types"
)

var database, _ = db.GetDB()

//login route, check if username and password are part of KPN and KPN LDAP group.  
func login(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || password == "" || username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Username or password are incorrect."})
		return
	}
	if utils.ValidateLDAPAuth(username, password) {
		email, err := utils.GetEmail(username)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		user, err := models.NewUser(database, username, email)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		c.JSON(http.StatusOK, gin.H{"user": user, "basic_auth": c.Request.Header.Get("Authorization")})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Username or password are incorrect."})
		return
	}
}

//Get user by name route
func getUser(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}

	user, err := models.GetUserByName(database, username)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not get the user."})
		return
	}
	c.JSON(http.StatusOK, user)
}

//Start a deployment route. 
func deployComponent(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}
	var components types.Components
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not read the request body."})
		return
	}
	if json.Valid(body) {
		if err := json.Unmarshal(body, &components); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not convert the requested data."})
			return
		}
		requester_email, _ := utils.GetEmail(username)
		deploymentProces, err := deployment.Do(components, requester_email, username, password)
		if err != nil || len(deploymentProces) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		_, err = models.InsertInstances(database, deploymentProces, components[0].DiagramID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Could not insert the instance keys into the database."})
			return
		}
		c.JSON(http.StatusOK, deploymentProces)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request invalid JSON."})
		return
	}
}

//Create a new project route.
func createProject(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}

	var projectRequest types.ProjectRequest
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not read the request body. " + err.Error()})
		return
	}
	if json.Valid(body) {
		if err := json.Unmarshal(body, &projectRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not convert the requested data."})
			return
		}
		newProject, err := models.AddProject(database, projectRequest.TicketNumber, projectRequest.Name, projectRequest.MailingList, projectRequest.Environment, username)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not add new project to the database."})
			return
		}
		c.JSON(http.StatusOK, newProject)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request invalid JSON."})
		return
	}
}

//Get set of projects by username. 
func getProjectsByUsername(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}
	projects, err := models.GetProjectsByUserName(database, username)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not find projects"})
		return
	}
	c.JSON(http.StatusOK, projects)
}

//Get project by project id or ticketnumber
func getProject(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}
	id := c.Param("id")
	if _, err := strconv.Atoi(id); err != nil {
		project, err := models.GetProjectByTicketNumber(database, id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "could not find project."})
			return
		}
		c.JSON(http.StatusOK, project)
		return
	}
	project_id, _ := strconv.ParseInt(id, 10, 64)
	project, err := models.GetProject(database, uint(project_id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "could not find project."})
		return
	}
	c.JSON(http.StatusOK, project)
}

//Get the set op diagrams of a project by project id.
func getDiagramsOfProject(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}
	id := c.Param("id")
	project_id, _ := strconv.ParseInt(id, 10, 64)
	project, err := models.GetProjectDiagramAssociations(database, uint(project_id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Could not find any diagrams associated to this project"})
		return
	}
	c.JSON(http.StatusOK, project)
}

//Delete a project by given project id. 
//Deleting a project will also delete underlying diagrams and instances!
func deleteProject(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "project id is not correct."})
		return
	}
	project, err := models.DeleteProject(database, uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not delete the project."})
		return
	}
	c.JSON(http.StatusOK, project)
}

//Create a new diagram.
func createDiagram(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}

	var diagramRequest types.DiagramRequest
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not read the request body. " + err.Error()})
		return
	}
	if json.Valid(body) {
		if err := json.Unmarshal(body, &diagramRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not convert the requested data."})
			return
		}
		data, _ := json.Marshal(diagramRequest.Data)
		newDiagram, err := models.AddDiagram(database, string(data), diagramRequest.TicketNumber)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not add new diagram to the database."})
			return
		}
		c.JSON(http.StatusOK, newDiagram)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request invalid JSON."})
		return
	}
}

//Update a diagram with the new data. 
func updateDiagram(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}

	var requestDiagram types.UpdateDiagram
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not read the request body. " + err.Error()})
		return
	}
	if json.Valid(body) {
		if err := json.Unmarshal(body, &requestDiagram); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not convert the requested data."})
			return
		}
		data, _ := json.Marshal(requestDiagram.Data)
		updatedDiagram, err := models.UpdateDiagram(database, requestDiagram.ID, string(data))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request could not add new diagram to the database."})
			return
		}
		c.JSON(http.StatusOK, updatedDiagram)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request invalid JSON."})
		return
	}
}

//Get a diagram by diagram id. 
func getDiagram(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "diagram id is not correct."})
		return
	}
	diagram, err := models.GetDiagram(database, uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No diagram found with id " + c.Param("id")})
		return
	}
	c.JSON(http.StatusOK, diagram)
}

//Delete diagram by diagram id, deleting a diagram will also delete the underlying instances!
func deleteDiagram(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no diagram id."})
		return
	}
	diagram, err := models.DeleteDiagram(database, uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "could not delete diagram " + c.Param("id")})
		return
	}
	c.JSON(http.StatusOK, diagram)
}

//Get instance status by instance key (id) 
func getInstanceStatus(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Instance id is not correct " + strconv.Itoa(id)})
		return
	}
	status, err := deployment.CheckInstanceStatus(id, username, password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, status)
}

//get a list of all KPN applications. 
func applicationList(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok || !utils.ValidateLDAPAuth(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not welcome here..."})
		return
	}
	const path = "static/applications.json"
	var applicationList types.ApplicationList

	applicationFile, _ := ioutil.ReadFile(path)
	json.Unmarshal(applicationFile, &applicationList)

	c.JSON(http.StatusOK, applicationList.Applications)
}

//Set CORS headers to use this application on local host.
//
//*note don't use this in Production.
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

//Setup the gin router
func SetupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(CORSMiddleware())

	router.POST("/auth/login", login)
	router.POST("/component/deploy", deployComponent)
	router.POST("/project/create", createProject)
	router.POST("/diagram/create", createDiagram)
	router.PATCH("/diagram/update", updateDiagram)
	router.DELETE("/diagram/delete/:id", deleteDiagram)
	router.GET("/diagram/:id", getDiagram)
	router.GET("/project/list", getProjectsByUsername)
	router.GET("/project/:id", getProject)
	router.GET("/project/diagrams/:id", getDiagramsOfProject)
	router.DELETE("/project/delete/:id", deleteProject)
	router.GET("/application/list", applicationList)
	router.GET("/instance/status/:id", getInstanceStatus)
	router.GET("/user", getUser)

	return router
}

//Start the router and listen/serve.
func HandleRequests() {
	router := SetupRouter()
	router.Run(":10000")
}
