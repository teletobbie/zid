package types

type Application struct {
	Name         string `json:"name"`
	Sid          string `json:"sid"`
	SupportGroup string `json:"support_group"`
}

type ApplicationList struct {
	Created      string        `json:"created"`
	Applications []Application `json:"applications"`
}

type ProjectRequest struct {
	TicketNumber string `json:"ticketnumber"`
	Name         string `json:"name"`
	MailingList  string `json:"mailinglist"`
	Environment  string `json:"environment"`
}

type DiagramRequest struct {
	TicketNumber string     `json:"ticketnumber"`
	Data         Components `json:"data"`
}

type UpdateDiagram struct {
	ID   uint       `json:"diagram_id"`
	Data Components `json:"data"`
}

type Component struct {
	Title string `json:"title"`
	Name  string `json:"name"`
}

type Inputs struct {
	VMname          string `json:"VMname"`
	ServerRole      string `json:"serverRole"`
	Os              string `json:"os"`
	AppSearch       string `json:"appsearch"`
	Platform        string `json:"platform"`
	Location        string `json:"location"`
	Msp             string `json:"msp"`
	Zone            string `json:"zone"`
	Networklot      string `json:"networklot"`
	FrontendSubnet  string `json:"frontendSubnet"`
	CPU             string `json:"cpu"`
	Memory          string `json:"memory"`
	Storage         int    `json:"storage"`
	ApplicationName string `json:"applicationName"`
	SqlEdition      string `json:"sqledition,omitempty"`
	DatabaseName    string `json:"databasename,omitempty"`
}

type Components []struct {
	Component   Component `json:"component"`
	Inputs      Inputs    `json:"inputs"`
	InputErrors struct {
	} `json:"inputErrors"`
	ID           string     `json:"id"`
	Next         Components `json:"next"`
	DiagramID    uint       `json:"diagram_id"`
	TicketNumber string     `json:"ticketnumber"`
	Environment  string     `json:"environment"`
	MailingList  string     `json:"mailinglist"`
}

type NewSystemResponse struct {
	Code    int    `json:"code"`
	ID      int    `json:"id"`
	Message string `json:"message"`
	Name    string `json:"name"`
}

type InstanceStatus struct {
	Instance struct {
		End  string `json:"end"`
		ID   int    `json:"id"`
		Jobs []struct {
			ID        int `json:"id"`
			Incidents []struct {
				End     string `json:"end"`
				ID      int    `json:"id"`
				Message string `json:"message"`
				Start   string `json:"start"`
			} `json:"incidents"`
			Name      string `json:"name"`
			Status    string `json:"status"`
			Timestamp string `json:"timestamp"`
		} `json:"jobs"`
		Start     string `json:"start"`
		Status    string `json:"status"`
		Variables []struct {
			Name  string `json:"name"`
			Value string `json:"value"`
		} `json:"variables"`
		Workflow struct {
			Created string `json:"created"`
			ID      int    `json:"id"`
			Name    string `json:"name"`
			Version int    `json:"version"`
		} `json:"workflow"`
	} `json:"instance"`
}
