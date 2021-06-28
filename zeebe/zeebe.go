package zeebe

import (
	"bytes"
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	"errors"
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

var (
	webClient *http.Client
	CACert    string
	zeebeUrl  string
)

const (
	localUrl = "http://localhost:8080/zeebeapi/v1" //for local zeebe
	url      = "https://zeebe-dev.kpn.org/zeebeapi/v1"
)

func init() {
	flag.StringVar(&CACert, "ca", "ca/ca.pem", "CA location, defaults to /ca/ca.pem which is available by default")
	flag.StringVar(&zeebeUrl, "zeebeUrl", url, "zeebe url to connect to the zeebe dev API")
	flag.Parse()
	webClient = httpClient()
	log.Println("\033[35m", "Using Zeebe API url "+zeebeUrl, "\033[0m")
}

//Create a new httpClient with ca
func httpClient() *http.Client {
	rootCAs, _ := x509.SystemCertPool()
	if rootCAs == nil {
		rootCAs = x509.NewCertPool()
	}
	CACerts, err := ioutil.ReadFile(CACert)
	if err != nil {
		log.Fatalf("Failed to append %q to RootCAs: %v", CACert, err)
		os.Exit(0)
	}

	if ok := rootCAs.AppendCertsFromPEM(CACerts); !ok {
		log.Println("No CA appended")
		//zeebeUrl = localUrl //only for local zeebe
	}

	client := http.DefaultClient
	client.Transport = http.DefaultTransport
	client.Transport.(*http.Transport).TLSClientConfig = &tls.Config{RootCAs: rootCAs}

	return client
}

//create and send a request to the Zeebe API and return the response.
func SendRequest(method, endpoint, username, password string, body interface{}) ([]byte, error) {
	var request *http.Request
	requestUrl := zeebeUrl + endpoint
	switch method {
	case "GET":
		request, _ = http.NewRequest(method, requestUrl, nil)
	case "POST":
		requestBody, _ := json.Marshal(body)
		request, _ = http.NewRequest(method, requestUrl, bytes.NewBuffer(requestBody))
	default:
		err := errors.New("HTTP method is unkwown.")
		log.Println(err)
		return nil, err
	}
	request.Header.Set("Content-Type", "application/json")
	request.SetBasicAuth(username, password)

	response, err := webClient.Do(request)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	if response.StatusCode != 200 {
		log.Println(response.Status)
		return nil, errors.New(response.Status)
	}

	responsebody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return responsebody, nil
}
