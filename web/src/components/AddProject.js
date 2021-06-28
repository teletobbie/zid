import {useState} from 'react';
import { connect } from 'react-redux'
import { setEnvironment, setProjectName, setTicketNumber } from '../actions/projectAction';
import MailingList from '../utils/MailingList';
import CreateProject from '../api/CreateProject'
import { Redirect } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert';

/**
 * Create and returns a the AddProject form
 * @returns {JSX.Element} Add project form
 */
const AddProject = ({ticketNumber, projectName, mailingList, environment, doSetTicketNumber, doSetProjectName, doSetEnvironment}) => {
    const [success, setsuccess] = useState(false)
    const [error, seterror] = useState([false, ''])
    const onSubmit = (e) => {
        e.preventDefault();
        const mailingListToSend = mailingList.join(', ') || '';
        CreateProject(ticketNumber, projectName, mailingListToSend, environment)
        .then(() => setsuccess(true))
        .catch(() => seterror([true, 'Could not create a new project.']))
    } 

    if (success) {
        return <Redirect to={"/drawer/" + ticketNumber}/>
    }

    return (
        <div className='form-container'>
            <h1>Create a new project</h1>
            {error[0] ? <Alert variant='danger'><Alert.Heading>Oh no...</Alert.Heading>{error[1]}</Alert> : null}
            <form onSubmit={onSubmit}>
                <label htmlFor='ticketN'>Ticketnumber</label>
                <input type='text' id='ticketN' name='ticketnumber' onChange={e => doSetTicketNumber(e.target.value.toUpperCase())} value={ticketNumber} placeholder='CH9999...' minLength='6' maxLength='9' required/>
                <label htmlFor='project'>Projectname</label>
                <input type='text' id='project' name='projectname' onChange={e => doSetProjectName(e.target.value)} value={projectName} placeholder='project1...' maxLength='64' required/>
                <MailingList />
                <label htmlFor='environment'>Environment</label>
                <select id="environment" name='environment' value={environment} onChange={e => doSetEnvironment(e.target.value)} required>
                    <option value='Production'>Production</option>
                    <option value='Acceptance'>Acceptance</option>
                    <option value='Test'>Test</option>
                    <option value='Development'>Development</option>
                </select>

                <input type='submit' value='Create' />
            </form>
        </div>
    )
}

/**
 * Map Redux state to local props 
 */
const mapStateToProps = state => ({
    ticketNumber: state.project.ticketNumber,
    projectName: state.project.projectName,
    mailingList: state.project.mailingList,
    environment: state.project.environment
})

/**
 * Map Redux dispatch actions to local props. 
 */
const mapDispatchToProps = {
    doSetTicketNumber: setTicketNumber,
    doSetProjectName: setProjectName,
    doSetEnvironment: setEnvironment
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProject);
