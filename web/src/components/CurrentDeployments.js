import {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { connect } from 'react-redux';
import ProjectList from '../api/ProjectList';
import Container from 'react-bootstrap/Container';
import GetDiagramsByProject from '../api/GetDiagramsByProject';
import { setProjects } from '../actions/projectAction';

/**
 * Create and return a CurrentDeployments JSX element.
 * @returns {JSX.Element} Element of current ongoing deployment
 */
const CurrentDeployments = ({projects, doSetProjects}) => {
    const [deployments, setDeployments] = useState([])

    useEffect(() => {
        if (!projects) {
            doSetProjects(ProjectList())
        }
    }, [doSetProjects, projects])

    useEffect(() => {
        if (deployments.length === 0) {
            projects?.forEach(project => {
                if (project.diagrams) {
                    GetDiagramsByProject(project.id).then(diagrams => addToDeployments({project, diagrams}))
                }
            });
        }
    }, [projects, deployments.length])

    /**
     * Set the deployments state with the old state and the new object.
     * @param {Object} new_deployment new project, diagram object to append
     */
    const addToDeployments = (new_deployment) => {
        setDeployments(prevDeployments => {
          return [
            ...prevDeployments,
            new_deployment
          ]
        })
      }
    
    /**
     * Returns a JSX.Element ListGroup with current ongoing deployment per diagram.
     * @param {*} props props of the JSX.Element.
     * @returns {JSX.Element} a JSX.Element ListGroup with current ongoing deployments.
     */
    const DeploymentList = (props) => {
        const diagrams = props.diagrams
        return (
            <ListGroup>
                {diagrams.map(diagram => 
                    <>
                        {diagram.instances.length > 0 ? 
                            <ListGroup.Item action href={`/deployment/${diagram.id}`}>Deployment of diagram {diagram.id}</ListGroup.Item>
                        : null} 
                    </>
                )}
            </ListGroup>
        )
    }

    return (
        <Container>
            <Row className='text-center'>
                <Col>
                    <h1>Current deployments</h1>
                    <p>List of current deployments</p>
                </Col>
            </Row>
            {deployments ? 
            <Row md={4}>
                {deployments.map(deployment => 
                <>
                    {deployment.diagrams ?
                        <Col key={deployment.project.id} style={{ margin:'1rem'}}>
                            <Card style={{width: '18rem'}}>
                                <Card.Header>{deployment.project.name} <small>{deployment.project.ticketnumber}</small></Card.Header>
                                <Card.Body>
                                    <Card.Title>Current deployments</Card.Title>
                                    <Card.Text>A list of current deployments:</Card.Text>
                                    <DeploymentList diagrams={deployment.diagrams} />
                                </Card.Body>
                            </Card>
                        </Col>
                    : null}
                </>    
                )}
                
            </Row> : <p><i>No deployments at the moment</i></p>}
        </Container>
    )
}

/**
 * Map Redux state to local props 
 */
const mapStateToProps = state => ({
    projects: state.project.projects
})

/**
 * Map Redux dispatch actions to local props. 
 */
const mapDispatchToProps = {
    doSetProjects: setProjects
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentDeployments)
