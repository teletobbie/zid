import {useState, useEffect} from 'react'
import { connect } from "react-redux";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import InstanceStatus from "../api/InstanceStatus";
import Loader from "../utils/Loader";
import { FcOk, FcProcess, FcCancel } from "react-icons/fc";
import {BsFillQuestionCircleFill} from 'react-icons/bs'
import { setDiagram } from '../actions/drawerAction';
import GetDiagram from '../api/GetDiagram';
import { useParams } from 'react-router-dom';
import { setCurrentProject } from '../actions/projectAction';
import { BiArrowBack } from "react-icons/bi";
import Moment from 'react-moment';

/**
 * Create and returns a React IconType based on props.status.
 * @param {object} props JSX.Element props.
 * @returns {import('react-icons/lib').IconType} A status IconType.
 */
const StatusIcon = (props) => {
    const status = props.status;
    switch (status) {
        case "Completed":
            return <FcOk size={'2rem'} style={{verticalAlign: 'middle'}} />;
        case "Active":
            return <FcProcess size={'2rem'} style={{verticalAlign: 'middle'}}/>;
        case "Failed": 
            return <FcCancel size={'2rem'} style={{verticalAlign: 'middle'}}/>;
        default:
            return <BsFillQuestionCircleFill color='steelblue' size={'2rem'} style={{verticalAlign: 'middle'}}/>;
    }
}

/**
 * Find and return a variable by the query and returns it's value.
 * @param {string[]} variableList the array of variables. 
 * @param {string} query the search query.
 * @returns {string} variable value.
 */
const findVariableValue = (variableList, query) => {
    if (Array.isArray(variableList) && variableList.length > 0 && query) {
        const found = variableList.find(element => element.name === query)
        return found?.value
    }
}

/**
 * Create and return a Deployment Overview JSX.Element.
 * @param {object} props component props.
 * @returns {JSX.Element} A deployment overview page. 
 */
const DeploymentOverview = ({diagram, project, doSetDiagram, doSetProject}) => {
    //TODO check in diagram.data.inputs.serverRole === database, then when status is completed get de variable FQDN_MANAGEMENT to use as hostname for the next (mssql) deployment
    const { diagram_id } = useParams()
    const [instances, setInstances] = useState(null)
    const [error, setError] = useState([false, ''])
    
    useEffect(() => {
        GetDiagram(diagram_id).then(d => doSetDiagram(d)).catch(() => setError([true, 'Could not get the deployment overview. No diagram.']))
    }, [doSetDiagram, diagram_id])

    useEffect(() => {
        if (diagram) {
          if (diagram.instances) {
            Promise.all(
              diagram.instances.map((instance) =>
                InstanceStatus(instance.key)
              )
            )
              .then((allInstances) => setInstances(allInstances))
              .catch((err) => setError([true, err]));
            doSetProject(diagram.project_id)
          }
        }
    }, [diagram, doSetProject]);

    return (
        <Container>
            {error[0] ? <Row><Col><Alert variant='danger'>{error[1]}</Alert></Col></Row> : null}
            
            {instances ? 
            <>
                <Row>
                    <Col>
                        <Button variant='primary' href={`/drawer/${project.ticketnumber}`}><BiArrowBack /> Go back</Button>
                        <h1>Deployment of diagram {diagram.id} <small>{project.ticketnumber}</small></h1>
                        <p>Projectname: {project.name}</p>
                        <p>Environment: {project.environment}</p>
                        <p>There are currently {instances.length} instances associated to this deployment.</p>
                    </Col>
                </Row>
                <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Instance ID</th>
                                <th>Workflow</th>
                                <th>Workflow version</th>
                                <th>Jobs amount</th>
                                <th>Started</th>
                                <th>Ended</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {instances.map(status => 
                            <tr key={status.instance.id}>
                                <td>{ <StatusIcon status={status.instance.status}/> }</td>
                                <td><a href={`https://zeebe-dev.kpn.org/views/instances/${status.instance.id}`} target='_blank' rel='noreferrer'>{status.instance.id}</a></td>
                                <td>{status.instance.workflow.name}</td>
                                <td>{status.instance.workflow.version}</td> 
                                <td>{status.instance.jobs.length}</td>
                                <td><Moment>{status.instance.start}</Moment></td>
                                <td>{status.instance.end ? <Moment>{status.instance.end}</Moment> : null}</td>
                                <td><a href={`/deployment/details/${status.instance.id}`}>Details</a></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Row>
                    <Col>
                        <h3>Deployment results</h3>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>FQDN Front</th>
                                    <th>IP Address Front</th>
                                    <th>FQDN Management</th>
                                    <th>IP-addresses Management</th>
                                    <th>Location</th>
                                    <th>Operating system</th>
                                </tr>
                            </thead>
                            <tbody>
                                {instances.map(status => 
                                    <tr key={status.instance.id}>
                                        <td>{findVariableValue(status.instance.variables, "fqdnFront")}</td>
                                        <td>{findVariableValue(status.instance.variables, "extFrontendSubnet")}</td>
                                        <td>{findVariableValue(status.instance.variables, "fqdnManagement")}</td>
                                        <td>{findVariableValue(status.instance.variables, "ipAddressManagement")}</td>
                                        <td>{findVariableValue(status.instance.variables, "extDcName")}</td>
                                        <td>{findVariableValue(status.instance.variables, "extOs")}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <h3>Incidents</h3>
                        <p>Occured incidents during the deployment.</p>
                    </Col>
                </Row>
                <Row md={4}>
                    {instances.map(status => 
                        status.instance.jobs.map(job => 
                            job.incidents ? job.incidents.map(incident =>
                                <Col key={incident.id} style={{ margin:'1rem'}}>
                                    <a style={{textDecoration: 'none'}} href={`/deployment/details/${status.instance.id}`}>
                                        <Card bg='danger'
                                            text='white'
                                            style={{ width: '18rem' }}
                                            >
                                            <Card.Header>Incident at {status.instance.workflow.name}</Card.Header>
                                            <Card.Body>
                                                <Card.Title>{job.name}</Card.Title>
                                                <Card.Text>{incident.message}</Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                    Occured at: <Moment>{incident.start}</Moment>
                                            </Card.Footer>
                                        </Card>
                                    </a>
                                </Col>
                            ) : null
                        )
                    )}           
                </Row>
                </> 
        : <Loader />}
            
        </Container>
    )
}

/**
 * Map Redux state to local props 
 */
const mapStateToProps = state => ({
    diagram: state.drawer.diagram,
    project: state.project.current
})

/**
 * Map Redux dispatch actions to local props. 
 */
const mapDispatchToProps = {
    doSetDiagram: setDiagram,
    doSetProject: setCurrentProject
}

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentOverview)