import {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { BsPlusCircleFill } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { setProjects } from '../actions/projectAction';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { MdDeleteForever } from 'react-icons/md';
import DeleteProject from '../api/DeleteProject';

/**
 * Split the mailinglist string into Array with emails
 * @param {string} mailinglist mailinglist string to split
 * @returns {string[]} A array of emails or empty list.  
 */
const splitMailingList = (mailinglist) => {
    if (mailinglist.length > 0) {
        return mailinglist.split(", ")
    }
    return []
}

/**
 * Convert a string to Date
 * @param {string} stringDate 
 * @returns {Date} Date
 */
const stringToDate = (stringDate) => {
    return new Date(stringDate)
}

/**
 * Returns a Dashboard JSX.Element.  
 * @param {object} props 
 * @returns {JSX.Element} Dashboard
 */
const Dashboard = ({projects, doSetProjects}) => {
    const [confirmDeleteProject, setConfirmDeleteProject] = useState([false, null]);
    const [error, setError] = useState([false, ''])

    useEffect(() => {
       doSetProjects()  
    }, [doSetProjects]);

    /**
     * set confirmDeleteProject state to false, closing the Modal.
     */
    const handleClose = () => setConfirmDeleteProject([false, null]);

    /**
     * Delete the project by project id.
     */
    const handleDelete = () => {
        if (confirmDeleteProject[1]) {
            const id = confirmDeleteProject[1]
            DeleteProject(id)
            .then(() => handleClose())
            .then(() => doSetProjects())
            .catch(() => setError([true, 'Could not delete the project.']))
        }
    } 

    return (
        <Container fluid='md' >
            {error[0] ? <Row><Col><Alert><Alert.Header>Error deleting project</Alert.Header>{error[1]}</Alert></Col></Row> : null}
            <Row md={3} style={{ paddingTop:'1rem'}}>
                {projects ? 
                    projects.map(project => (
                    <Col style={{ paddingBottom:'1rem'}} key={project.id}>
                        <Card style={{ width: '20rem' }}>
                            <Card.Header>
                                <Button style={{float:'right', width:'3rem'}} variant='danger' disabled={project.diagrams.length > 0} onClick={() => setConfirmDeleteProject([true, project.id])} size='sm'><MdDeleteForever size={'1.2rem'} style={{verticalAlign: 'middle'}}/></Button></Card.Header>
                            <Card.Body>
                                <Card.Title>{project.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{project.ticketnumber} created: <Moment date={stringToDate(project.created_at)} fromNow /></Card.Subtitle>
                                <Card.Text>Environment: {project.environment}</Card.Text>
                                <Card.Text>Diagrams: {project.diagrams ? project.diagrams.length : 0}</Card.Text>                      
                            </Card.Body>
                            <Card.Body>
                                <Card.Header>Mailinglist:</Card.Header>
                                <ListGroup variant='flush'>
                                    {splitMailingList(project.mailinglist).map(mail => 
                                        <ListGroup.Item key={mail}>{mail}</ListGroup.Item>
                                    )}
                                </ListGroup>
                                <Button variant='primary' href={'/drawer/'+project.ticketnumber}>To diagram page</Button>
                            </Card.Body>
                            <Card.Footer className='text-muted'>Last edited: <Moment date={stringToDate(project.updated_at)} fromNow /></Card.Footer>
                        </Card>
                    </Col>
                    ))
                : null}
                <Col>
                    <Card style={{ width: '20rem' }}>
                        <Card.Body>
                            <Card.Title>Add project</Card.Title>
                            <Card.Text style={{textAlign: 'center'}}>
                                <Link to='/project/create'>
                                    <BsPlusCircleFill size={'8rem'} color='green' style={{verticalAlign: 'middle'}} />
                                </Link>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={confirmDeleteProject[0]} onHide={handleClose} backdrop='static' keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Delete this project?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this project and <b>all</b> underlying data? This action is <b><i>irreversibel!</i></b></Modal.Body>
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
    projects: state.project.projects
})

/**
 * Map Redux dispatch actions to local props. 
 */
const mapDispatchToProps = {
    doSetProjects: setProjects
}

export default connect(mapStateToProps, mapDispatchToProps) (Dashboard)
