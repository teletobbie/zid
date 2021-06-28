package worker

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"context"
	"flag"

	"github.com/camunda-cloud/zeebe/clients/go/pkg/entities"
	"github.com/camunda-cloud/zeebe/clients/go/pkg/worker"
	"github.com/camunda-cloud/zeebe/clients/go/pkg/zbc"
)

var brokerAddr string
var brokerJob string
var brokerSecure bool

func init() {
	flag.StringVar(&brokerAddr, "broker", "0.0.0.0:26500", "Zeebe broker address and port")
	flag.StringVar(&brokerJob, "topic", "test", "Job the worker needs to subscribe to")
	flag.BoolVar(&brokerSecure, "secure", false, "Use -secure for TLS/SSL broker communication encryption based on KPN Private CA")
	flag.Parse()

	checkParameters()

	log.Println("\033[34m", "Starting worker for ZID", "\033[0m")
	log.Println("\033[34m", "Broker connection:", brokerAddr, "\033[0m")
	log.Println("\033[34m", "Secure Broker connection:", brokerSecure, "\033[0m")
	log.Println("\033[34m", "Zeebe Job: ", brokerJob, "\033[0m")
}

func Start() {
	zbClient := createClient()

	jobWorker := zbClient.NewJobWorker().JobType(brokerJob).Handler(handleJob).PollInterval(1 * time.Second).Open()
	defer jobWorker.Close()

	jobWorker.AwaitClose()
}

func handleJob(client worker.JobClient, job entities.Job) {

	jobKey := job.GetKey()

	log.Println("Start job", jobKey, "of type", job.Type)

	variables, err := job.GetVariablesAsMap()
	if err != nil {
		// failed to handle job as we require the variables
		failJob(client, job, err)
		return
	}

	IPAddresses := [10]string{
		"10.201.130.219",
		"10.181.126.115",
		"10.9.86.254",
		"10.60.195.159",
		"10.237.40.167",
		"10.80.61.75",
		"10.106.221.23",
		"10.9.46.172",
		"10.221.92.219",
		"10.13.71.255",
	}

	time.Sleep(time.Duration(rand.Intn(120)) * time.Second) //wait a little to fake the processing time.

	//Management
	variables["fqdnFront"] = "localhost." + fmt.Sprint(variables["extServerRole"]) + ".gen.local"
	variables["fqdnManagement"] = "localhost.mgt.gen.local"
	variables["ipAddressManagement"] = IPAddresses[rand.Intn(9)]

	request, err := client.NewCompleteJobCommand().JobKey(jobKey).VariablesFromMap(variables)
	if err != nil {
		// failed to set the updated variables
		failJob(client, job, err)
		return
	}
	log.Println("Complete job", jobKey, "of type", job.Type)
	ctx := context.Background()
	request.Send(ctx)
}

// failJob ...
func failJob(client worker.JobClient, job entities.Job, err error) {
	log.Println("Failed to complete job", job.GetKey())
	ctx := context.Background()
	client.NewFailJobCommand().JobKey(job.GetKey()).Retries(job.Retries - 1).ErrorMessage(err.Error()).Send(ctx)
}

func checkParameters() {
	if len(brokerJob) == 0 {
		log.Println("Please use the correct parameters for -topic, it connot be empty, use -h for help.")
		os.Exit(0)
	}
}

func createClient() zbc.Client {
	if brokerSecure {
		client, err := zbc.NewClient(&zbc.ClientConfig{
			GatewayAddress:         brokerAddr,
			CaCertificatePath:      "ca/kpn-ca.pem",
			UsePlaintextConnection: false})
		if err != nil {
			panic(err)
		}
		return client
	}
	client, err := zbc.NewClient(&zbc.ClientConfig{
		GatewayAddress:         brokerAddr,
		UsePlaintextConnection: true})
	if err != nil {
		panic(err)
	}
	return client
}
