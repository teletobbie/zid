import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { resetLogic, setDeployment, setDiagram } from '../actions/drawerAction';
import { connect } from 'react-redux';
import GetDiagram from '../api/GetDiagram';
import { setCurrentProject } from '../actions/projectAction';
import { useEffect, useState } from 'react';

/**
 * Create and returns a JSX.Element DiagramSelecter.
 * @param {object} props 
 * @returns {JSX.Element} A DiagramSelecter Component
 */
const DiagramSelecter = ({diagram, project, doSetDiagram, doResetLogic}) => {
    const [diagrams, setDiagrams] = useState(null)

    useEffect(() => {
        if (project && project.diagrams.length > 0) {
            setDiagrams(project.diagrams)
        }
    }, [diagram, setDiagrams, project])

    /**
     * Switch from the current to an other diagram. Get the new diagram by diagram ID then set this diagram.
     * @param {object} diagram_to_switch diagram object
     */
    const handleSwitch = (diagram_to_switch) => {
        if (diagram_to_switch) {  
            GetDiagram(diagram_to_switch.id)
            .then(new_diagram => doSetDiagram(new_diagram))
            .finally(doResetLogic())
        }
    }

    return (
        <Container className='text-center'>
            <Row>
                <Col>
                    <h3>Diagrams</h3>
                    <p>Overview of saved diagrams. Click on a diagram to switch.</p>
                </Col>
            </Row>
            <Row>
                {diagrams ?
                    diagrams.map(dia => (
                        <Col key={dia.id}>
                                <Card onClick={() => handleSwitch(dia)} style={{cursor: 'pointer'}} border={dia.id === diagram?.id ? 'primary' : ''}>
                                        Diagram {dia.id}                 
                                </Card>
                        </Col>
                    ))
            : <Col><i>No saved diagram for this project yet.</i></Col>}
            </Row>
        </Container>
    )
}

/**
 * Map Redux state to local props 
 */
const mapStateToProps = state => ({
    diagram: state.drawer.diagram,
    project: state.project.current,
    deployment: state.drawer.deployment
})

/**
 * Map Redux dispatch actions to local props. 
 */
const mapDispatchToProps = {
    doSetDiagram: setDiagram,
    doResetLogic: resetLogic,
    doSetProject: setCurrentProject,
    doSetDeployment: setDeployment,
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagramSelecter) 
