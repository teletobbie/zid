package main_test

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"specials-gitea.kpn.org/zid/routes"
	"specials-gitea.kpn.org/zid/types"
)

const path = "tests/mocks/testcomponents.json"
const pathComponentResponse = "tests/mocks/componentResponse.json"
const basicAuth = "Basic c2NoaXA1NDQ6SGFuemVob2dlc2Nob29sXzEwMA=="

type testComponentResponse struct {
	Created           bool                            `json:"created"`
	DeploymentProcess map[int]types.NewSystemResponse `json:"deployment_proces"`
}

type testUser struct {
	Username string
	Password string
}

func performRequest(method, path string, body []byte) *httptest.ResponseRecorder {
	r := routes.SetupRouter()
	gin.SetMode(gin.ReleaseMode) //running in release mode to prefend alot of text
	switch method {
	case "GET":
		req, _ := http.NewRequest(method, path, nil)
		req.Header.Set("Authorization", basicAuth)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		return w
	case "POST":
		req, _ := http.NewRequest(method, path, bytes.NewBuffer(body))
		req.Header.Set("Authorization", basicAuth)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		return w
	default:
		log.Fatal("http request method is unknown... " + method)
	}
	return nil
}

func TestIfLoginReturns200WhenLoginSuccess(t *testing.T) {
	w := performRequest("POST", "/auth/login", nil)

	assert.Equal(t, 200, w.Code, "OK response is expected on this basicauth: "+w.HeaderMap.Get("Authorization"))
}

func TestIfLoginReturnsCorrectJSONOnLoginSuccess(t *testing.T) {
	expected := gin.H{"auth": basicAuth}
	var actual gin.H

	w := performRequest("POST", "/auth/login", nil)
	json.Unmarshal(w.Body.Bytes(), &actual)

	assert.Equal(t, expected, actual, "Expect both gin.H's be equal.")
}

func TestIfLoginReturns401WhenLoginCredentialsAreWrong(t *testing.T) {
	r := routes.SetupRouter()
	user := &testUser{
		Username: "blabal",
		Password: "pohoh",
	}
	jsonUser, _ := json.Marshal(user)

	req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(jsonUser))
	req.SetBasicAuth(user.Username, user.Password)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code, "Status code 401 expected")
}

func TestIfLoginReturn401WhenBasicAuthInNotSet(t *testing.T) {
	r := routes.SetupRouter()
	user := &testUser{
		Username: "dfdsf",
		Password: "Hdsfsdfn_",
	}
	jsonUser, _ := json.Marshal(user)

	req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(jsonUser))
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code, "Status code 401 expected")
}

func TestCreateValidJSONComponentReturns200(t *testing.T) {
	body, _ := ioutil.ReadFile(path)

	w := performRequest("POST", "/component/deploy", body)

	assert.Equal(t, 200, w.Code, "Status code 200 expected for component create")
}

func TestCreateInvalidJSONComponentReturns400andMessage(t *testing.T) {
	requestBody := []byte("I am invalid json...")
	expected := gin.H{"error": "Bad request invalid JSON."}
	var actual gin.H
	w := performRequest("POST", "/component/deploy", requestBody)
	json.Unmarshal(w.Body.Bytes(), &actual)

	assert.Equal(t, 400, w.Code, "Expect status code 400")
	assert.Equal(t, expected, actual, "Expect the same JSON error data.")
}

func TestCreateComponentReturns400AndMessageWhenJsonIsValidButUnmarshalFails(t *testing.T) {
	requestBody, _ := json.RawMessage(`{"validjson":"valid json but this cannot be marshaled to a Component struct. :)"}`).MarshalJSON()
	expected := gin.H{"error": "Bad request could not convert the requested data."}
	var actual gin.H
	w := performRequest("POST", "/component/deploy", requestBody)
	json.Unmarshal(w.Body.Bytes(), &actual)
	assert.Equal(t, 400, w.Code, "Expect status code 400")
	assert.Equal(t, expected, actual)
}

func TestIfApplicationListReturns200(t *testing.T) {
	w := performRequest("GET", "/application/list", nil)
	assert.Equal(t, 200, w.Code, "Status code 200 expected for application list")
}
