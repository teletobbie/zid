import {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup'
import DeployComponent from '../api/DeployComponent';
import CreateDiagram from '../api/CreateDiagram';
import { connect } from "react-redux";
import { resetLogic, setDeployment, setDiagram } from "../actions/drawerAction";
import UpdateDiagram from '../api/UpdateDiagram';
import Modal from 'react-bootstrap/Modal';
import DeleteDiagram from '../api/DeleteDiagram';
import disabled from '../utils/disabled';

/**
 * Create and return a buttongroup JSX element.
 * @returns {JSX.Element} Group of buttons element
 */
const ButtonGroup = ({ data, deployment, diagram, project, doSetDeployment, doSetDiagram, doResetLogic }) => {
  const [isDisabled, setDisabled] = useState(false)
  const [saved, setsaved] = useState([false, ''])
  const [deleted, setDeleted] = useState([false, ''])
  const [error, setError] = useState([false, ''])
  const [deploying, setDeploying] = useState(false)
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);

  useEffect(() => {
    setDisabled(disabled(data))
  }, [data])

  useEffect(() => {
    if (diagram?.instances) {
      if (diagram.instances.length > 0) {
        setDeploying(true)
      }
    } else {
      setDeploying(false)
    }
  }, [diagram])

  /**
   * Handles the closing of the confirm deployment Modal by setting setShow and DeleteShow to false.
  */
  const handleClose = () => {
    setShow(false)
    setDeleteShow(false)
  };

  /**
   * Handles the deployment of the current diagram.
  */
  const handleDeployment = () => {
    if (!data && !project) {
      setError([true, 'Could not start the deployment of the current diagram.'])
      return
    }
    if (!diagram) {
      setError([true, 'Save the diagram first please.'])
      handleClose()
      return
    }
    DeployComponent(data, diagram.id, project.ticketnumber, project.environment, project.mailinglist)
    .then(newDeployment => doSetDeployment(newDeployment))
    .then(() => handleClose())
    .catch(() => setError([true, 'Could not deploy this diagram.'])) 
  }

  /**
   * Handles the create (if not exists) or save of the current diagram.
  */
  const handleSave = () => {
    if (!data && !project) {
      setError([true, 'Could not save the current diagram.'])
      return
    }
    if (diagram) {
      UpdateDiagram(diagram.id, data)
      .then(updatedDiagram => doSetDiagram(updatedDiagram))
      .then(setsaved([true, 'Diagram saved.']))
      .catch(() => setError([true, 'Could not save this diagram']))
      return
    }
    CreateDiagram(project.ticketnumber, data) //create a new diagram with the data
    .then(newDiagram => doSetDiagram(newDiagram)) //if success set the new diagram
    .then(setsaved([true, 'Diagram created']))
    .catch(() => setError([true, 'Could not create this diagram']))
  }

  /**
   * Handles the new diagram, thereby resetting the current diagram.
  */
  const handleNew = () => {
    doSetDiagram(null)
    doSetDeployment(null)
    doResetLogic()
  }

  /**
   * Handles deletion of the current diagram.
  */
  const handleDelete = () => {
    if (diagram) {
      DeleteDiagram(diagram.id)
      .then(() => setDeleted([true, 'Diagram successfully deleted!']))
      .then(() => handleClose())
      .catch(() => setError([true, 'Could not delete this diagram.']))
      .finally(doSetDiagram(null))
    }
  }

  return (
    <Container>
        {saved[0] ? <Row><Col><Alert variant='info'>{saved[1]}</Alert></Col></Row> : null}
        {error[0] ? <Row><Col><Alert variant='danger'>{error[1]}</Alert></Col></Row> : null}
        {deleted[0] ? <Row><Col><Alert variant='primary'>{deleted[1]}</Alert></Col></Row> : null}
        {deploying ? <Row><Col><Alert variant='warning'>This diagram is deploying at the moment. <Alert.Link href={`/deployment/${diagram.id}`}>Go to deployment</Alert.Link></Alert></Col></Row> : null}
        {deployment ? 
        <Row>
          <Col>
            <Alert variant='primary'>
              <Alert.Heading>Deployment started!</Alert.Heading>
              <p>Deployment has started with the following items:</p>
              <ListGroup>
                {deployment.map(proces => 
                  <ListGroup.Item key={proces.id} variant={`${proces.code === 200 ? 'success' : 'warning'}`}>{proces.code} - {proces.message}</ListGroup.Item>
                )}
              </ListGroup>
              <hr/>
              <div className='d-flex justify-content-end'>
                <Button variant='secondary' href={`/deployment/${diagram.id}`}>Continue</Button>
              </div>
            </Alert>
          </Col>
        </Row>
        : null}
        
      <Row>
        <Col md={{ offset: 8 }}>
          <Button variant="success" onClick={() => setShow(true)} disabled={isDisabled || deploying}>Deploy</Button>
          <Button variant="primary" onClick={handleSave} disabled={isDisabled || deploying}>Save</Button>
          <Button variant='info' onClick={handleNew}>New</Button>
          <Button variant='danger' onClick={() => setDeleteShow(true)} disabled={deleted[0] || deploying || !diagram}>Delete</Button>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
            <Modal.Header>
                <Modal.Title>Deploy this diagram?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure that you want to deploy this diagram?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    No
                </Button>
                <Button variant="success" onClick={handleDeployment}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
        <Modal show={deleteShow} onHide={handleClose} backdrop='static' keyboard={false}>
            <Modal.Header>
                <Modal.Title>Delete this diagram?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure that you want to delete this diagram? This will also remove the underlying instances and deployment information.</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    No
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    </Container> 
  )
}

/**
 * Map Redux state to local props 
 */
const mapStateToProps = state => ({
  data: state.drawer.data,
  deployment: state.drawer.deployment,
  ticketnumber: state.project.ticketNumber,
  diagram: state.drawer.diagram,
  project: state.project.current
})

/**
 * Map Redux dispatch actions to local props. 
 */
const mapDispatchToProps = {
  doSetDeployment: setDeployment,
  doSetDiagram: setDiagram,
  doResetLogic: resetLogic,
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonGroup)
