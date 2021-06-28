package utils

type NewSystem struct {
	ExtApplSip           string `json:"extApplSip"`
	ExtApplicationName   string `json:"extApplicationName"`
	ExtApplicationSid    string `json:"extApplicationSid"`
	ExtCPU               string `json:"extCpu"`
	ExtDcName            string `json:"extDcName"`
	ExtEnvironment       string `json:"extEnvironment"`
	ExtFrontendSubnet    string `json:"extFrontendSubnet"`
	ExtMailList          string `json:"extMailList"`
	ExtMemory            string `json:"extMemory"`
	ExtOs                string `json:"extOs"`
	ExtPlatform          string `json:"extPlatform"`
	ExtRequester         string `json:"extRequester"`
	ExtSan               string `json:"extSan"`
	ExtServerDescription string `json:"extServerDescription"`
	ExtServerRole        string `json:"extServerRole"`
	ExtTicketNr          string `json:"extTicketNr"`
}

type NewMSSQLInstance struct {
	ApplicationName string `json:"applicationName"`
	DatabaseLogSize string `json:"databaseLogSize"`
	DatabaseName    string `json:"databaseName"`
	DatabaseSize    string `json:"databaseSize"`
	DcName          string `json:"dcName"`
	EmailRequester  string `json:"emailRequester"`
	Environment     string `json:"environment"`
	Hostname        string `json:"hostname"`
	InsNumber       string `json:"insNumber"`
	Platform        string `json:"platform"`
	SQLEdition      string `json:"sqlEdition"`
	TicketNumber    string `json:"ticketNumber"`
}
