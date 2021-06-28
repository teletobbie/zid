package deployment

import (
	"encoding/json"
	"errors"
	"strconv"
	"strings"

	"github.com/teletobbie/zid/deployment/utils"
	"github.com/teletobbie/zid/types"
	"github.com/teletobbie/zid/zeebe"
)

var (
	deploymentProces []types.NewSystemResponse
	username         string
	password         string
)

//start the deployment by resetting the deployment proces and then starting the instances.
//if a error occurs during the deployment, the instances will be terminated and a error will be returned.
func Do(components types.Components, requester_email, username, password string) ([]types.NewSystemResponse, error) {
	deploymentProces = []types.NewSystemResponse{}
	err := startServerInstance(components, requester_email, username, password)
	if err != nil {
		for _, startedInstance := range deploymentProces {
			terminateInstanceStatus(startedInstance.ID, username, password)
		}
		return []types.NewSystemResponse{}, err
	}
	return deploymentProces, nil
}

//initiziles the deployment server calls to Zeebe and returns the responses as map
func startServerInstance(components types.Components, requester_email, username, password string) error {
	for _, component := range components {
		applicationName, sid := getApplicationNameAndSid(component.Inputs.ApplicationName)
		var newSystem = utils.NewSystem{
			ExtApplSip:           sid,
			ExtApplicationName:   applicationName,
			ExtApplicationSid:    sid,
			ExtCPU:               component.Inputs.CPU,
			ExtDcName:            component.Inputs.Location,
			ExtEnvironment:       component.Environment,
			ExtFrontendSubnet:    component.Inputs.FrontendSubnet,
			ExtMailList:          component.MailingList,
			ExtMemory:            component.Inputs.Memory,
			ExtOs:                component.Inputs.Os,
			ExtPlatform:          component.Inputs.Platform,
			ExtRequester:         requester_email,
			ExtSan:               strconv.Itoa(component.Inputs.Storage),
			ExtServerDescription: component.Component.Title + " - " + component.Inputs.VMname,
			ExtServerRole:        component.Inputs.ServerRole,
			ExtTicketNr:          component.TicketNumber,
		}
		var newSystemResponse types.NewSystemResponse

		switch component.Inputs.Os {
		case "centos7":
			response, err := zeebe.SendRequest("POST", "/linux/newsystem", username, password, newSystem)
			if err != nil {
				return err
			}
			json.Unmarshal(response, &newSystemResponse)
			deploymentProces = append(deploymentProces, newSystemResponse)
		case "centos8":
			response, err := zeebe.SendRequest("POST", "/linux/newsystem", username, password, newSystem)
			if err != nil {
				return err
			}
			json.Unmarshal(response, &newSystemResponse)
			deploymentProces = append(deploymentProces, newSystemResponse)
		case "linuxflatcar":
			response, err := zeebe.SendRequest("POST", "/flatcar/newsystem", username, password, newSystem)
			if err != nil {
				return err
			}
			json.Unmarshal(response, &newSystemResponse)
			deploymentProces = append(deploymentProces, newSystemResponse)
		case "windows2012r2":
			response, err := zeebe.SendRequest("POST", "/windows/newsystem", username, password, newSystem)
			if err != nil {
				return err
			}
			json.Unmarshal(response, &newSystemResponse)
			deploymentProces = append(deploymentProces, newSystemResponse)
		case "windows2016":
			response, err := zeebe.SendRequest("POST", "/windows/newsystem", username, password, newSystem)
			if err != nil {

				return err
			}
			json.Unmarshal(response, &newSystemResponse)
			deploymentProces = append(deploymentProces, newSystemResponse)
		default:
			return errors.New("No deploy action found for OS " + component.Inputs.Os)
		}

		if len(component.Next) == 0 {
			break
		} else {
			startServerInstance(component.Next, requester_email, username, password)
		}
	}
	return nil
}

//returns application name and application sid by splitting the Component.Inputs.ApplicationName
func getApplicationNameAndSid(applicationField string) (string, string) {
	s := strings.Split(applicationField, "-")
	return strings.Trim(s[0], " "), strings.Trim(s[1], " ")
}

//start a mssql instance and returns a system response.
func startMSSQLInstance(applicationName, databaseName, databaseLogsize, databaseSize, dcName, emailRequester, environment, hostname, platform, sqlEdition, ticketnumber, username, password string) (types.NewSystemResponse, error) {
	var newSystemResponse types.NewSystemResponse
	newMSSQLInstance := utils.NewMSSQLInstance{
		ApplicationName: applicationName,
		DatabaseLogSize: databaseLogsize,
		DatabaseName:    databaseName,
		DatabaseSize:    databaseSize,
		DcName:          dcName,
		EmailRequester:  emailRequester,
		Environment:     environment,
		Hostname:        hostname,
		InsNumber:       "1", //ins fixed at 1
		Platform:        platform,
		SQLEdition:      sqlEdition,
		TicketNumber:    ticketnumber,
	}
	response, err := zeebe.SendRequest("POST", "/mssql/deploy", username, password, newMSSQLInstance)
	if err != nil {
		return types.NewSystemResponse{}, err
	}
	json.Unmarshal(response, &newSystemResponse)
	return newSystemResponse, nil
}

//Sends a instance status request by instance id to the Zeebe API
//returns a instance status.
func CheckInstanceStatus(instanceID int, username, password string) (types.InstanceStatus, error) {
	var instanceStatus types.InstanceStatus
	endpoint := "/instance/status/"
	endpoint += strconv.Itoa(instanceID)
	response, err := zeebe.SendRequest("GET", endpoint, username, password, nil)
	if err != nil {
		return instanceStatus, err
	}
	json.Unmarshal(response, &instanceStatus)
	return instanceStatus, nil
}

//Sends a instance terminate request by instance id to the Zeebe API.
func terminateInstanceStatus(instanceKey int, username, password string) (types.InstanceStatus, error) {
	var instanceStatus types.InstanceStatus
	endpoint := "/instance/terminate/"
	endpoint += strconv.Itoa(instanceKey)
	response, err := zeebe.SendRequest("GET", endpoint, username, password, nil)
	if err != nil {
		return instanceStatus, err
	}
	json.Unmarshal(response, &instanceStatus)
	return instanceStatus, nil
}
