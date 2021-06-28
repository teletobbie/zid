package utils

import (
	"errors"
	"fmt"
	
	"github.com/teletobbie/zid/ldap"
)

const (
	envAuthFile        = "AUTH_FILE"
	defaultAuthFile    = "access"
	defaultAllowedFile = "flowsallowed"
)

func SetKPNNL() *ldap.LDAPClient {
	lc := &ldap.LDAPClient{
		Base:               "DC=LOCALNL,DC=Local",
		Host:               "ldaps.local",
		Port:               636,
		UseSSL:             true,
		InsecureSkipVerify: true,
		BindDN:             "cn=srv_zeebee,OU=Service Accounts,OU=Accounts,OU=Workspace,DC=localnl,DC=local",
		BindPassword:       "hfjekinfindukgn&",
		UserFilter:         "(&(objectcategory=person)(samaccountname=%s))",
		GroupFilter:        "(&(objectcategory=person)(samaccountname=%s))",
		Attributes:         []string{"memberof", "mail"},
	}
	return lc
}

func GetEmail(username string) (string, error) {
	client := SetKPNNL()

	// It is the responsibility of the caller to close the connection
	defer client.Close()

	if username == "" {
		return "", errors.New("Username is empty.")
	}

	mail, err := client.GetEmailByUsername(username)
	if err != nil {
		return "", err
	}

	return mail, nil
}

func ValidateLDAPAuth(username, password string) bool {
	client := SetKPNNL()

	// It is the responsibility of the caller to close the connection
	defer client.Close()

	// BUG? LDAP excepts an empty password which is not working as we would like to check the user credentials and not only
	// the existence of an user
	if password == "" {
		return false
	}

	ok, _, err := client.Authenticate(username, password)
	userGroup, userGroupError := client.GetGroupsOfUser(username)
	// userGroup, userGroupErr := client.GetGroupsOfUser(username)
	if err != nil {
		fmt.Println("client authenticate error ", err.Error())
		return false
	}

	if userGroupError != nil {
		fmt.Println("client authenticate error ", userGroupError.Error())
		return false
	}

	if !ok {
		fmt.Println("client auth is not ok.")
		return false
	}

	if Contains(userGroup, "GG_ROL_APP_ZEEBE_DESIGNER_DEV") ||
		Contains(userGroup, "GG_ROL_APP_ZEEBE_DESIGNER_ACC") ||
		Contains(userGroup, "GG_ROL_APP_ZEEBE_DESIGNER_PRD") {
		return true
	} else {
		fmt.Println("User is not member of the correct group.")
		return false
	}
}
