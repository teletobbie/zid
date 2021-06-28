import {useEffect} from 'react'
import FlowMaker from 'flowmaker'
import '../styles/flowmaker.css'
import Loader from '../utils/Loader'
import ButtonGroup from '../components/ButtonGroup'
import { setData, setDiagram, setLogic} from '../actions/drawerAction';
import { connect } from 'react-redux';
import {useParams} from 'react-router-dom';
import { resetCurrentProject, setCurrentProject } from '../actions/projectAction';
import DiagramSelecter from './DiagramSelecter'
import GetDiagram from '../api/GetDiagram'

/**
 * Create and returns a JSX.Element Drawer.
 * @param {object} props props of the Drawer Component 
 * @returns {JSX.Element} Drawer JSX.Element
 */
const Drawer = ({logic, data, project, diagram, doSetLogic, doSetData, doSetDiagram, doSetProject, doResetProject}) => {
    const { ticketnumber } = useParams();

    useEffect(() => {
        if (!project) {
            doSetProject(ticketnumber)
        }
    }, [doSetProject, project, ticketnumber])

    useEffect(() => {
        if (!logic && project) {
            doSetLogic(project.environment)
        } 
    }, [doSetLogic, logic, project])

    useEffect(() => {
        if (project) {
            if (project.diagrams && project.diagrams.length > 0) { 
                GetDiagram(project.diagrams[0].id).then(new_diagram => doSetDiagram(new_diagram)) 
            }        
        } 
    }, [project, doSetDiagram])

    useEffect(() => {
        if(diagram) {
            doSetData(JSON.parse(diagram.data))
        } else {
            doSetData(null)
        }
    }, [diagram, doSetData])

    return (
        <div className='drawer-canvas'>
            { logic ? 
            <>
                <ButtonGroup />
                <FlowMaker
                logic={logic} 
                onChange={newData => doSetData(newData)}
                flow={data}
                />
                <DiagramSelecter /> 
            </>
            : <Loader />
            }
        
        </div>
    )
}

/**
 * Map Redux state to local props 
 */
const mapStateToProps = state => ({
    logic: state.drawer.logic,
    data: state.drawer.data,
    applications: state.drawer.applications,
    diagram: state.drawer.diagram,
    project: state.project.current
})

/**
 * Map Redux dispatch actions to local props. 
 */
const mapDispatchToProps = {
    doSetLogic: setLogic,
    doSetData: setData,
    doSetDiagram: setDiagram,
    doSetProject: setCurrentProject,
    doResetProject: resetCurrentProject,
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer) 



