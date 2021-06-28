import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge  from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import InstanceStatus from '../api/InstanceStatus';
import Loader from '../utils/Loader';
import Moment from 'react-moment';

/**
 * Creates and returns the deployments details from a diagram.
 * @returns {JSX.Element} Deployment details page
 */
const DeploymentDetails = () => {
    const { key } = useParams()
    const [status, setStatus] = useState(null)
    const [error, setError] = useState([false, ''])
    const [scroll, setScroll] = useState(null)
    const scrollDownRef = useRef(null)
    const scrollUpRef = useRef(null)

    useEffect(() => {
        InstanceStatus(key).then(new_status => setStatus(new_status)).catch(() => setError([true, 'Could not get deployment details.']))
    }, [setStatus, key])

    useEffect(() => {
        if (scroll) {
            switch (scroll) {
                case 'up':
                    scrollToTop()
                    break
                case 'down':
                    scrollToBottom()
                    break
                default:
                    break
            }
        }
    }, [scroll])

    /**
     * Scroll into view of the scroll down ref.
     */
    const scrollToBottom = () => {
        scrollDownRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    /**
     * Scroll into view of the scroll up ref.
     */
    const scrollToTop = () => {
        scrollUpRef.current?.scrollIntoView({ behavior: 'smooth'})
    }

    /**
     * Set the scroll state value by direction value.
     * @param {string} direction 
     */
    const handleScroll = (direction) => setScroll(direction)

    /**
     * Creates and returns a JSX.Element of Badge Component based on the status prop. 
     * @param {object} props Status Badge Component props.
     * @returns {JSX.Element} A status Badge Component.
     */
    const StatusBadge = (props) => {
        const instanceStatus = props.status.toLowerCase();
        switch (instanceStatus) {
            case "completed":
                return <Badge pill variant='success'>{instanceStatus}</Badge>;
            case "active":
                return <Badge pill variant='warning'>{instanceStatus}</Badge>;
            case "failed": 
                return <Badge pill variant='danger'>{instanceStatus}</Badge>;
            default:
                return <Badge pill variant='info'>{instanceStatus}</Badge>;
        }
    }

    return (
        <Container>
            {error[0] ? <Alert variant='danger'><Alert.Heading>Error getting status details</Alert.Heading><p>{error[1]}</p></Alert> : null}
            {status ? 
            <>
            <Row ref={scrollUpRef}>
                <Col>
                    <h1>{status.instance.workflow.name} details <StatusBadge status={status.instance.status} /></h1>
                    <Table size={'sm'} borderless>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Created</th>
                                <th>Number</th>
                                <th>Version</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{status.instance.workflow.name}</td>
                                <td><Moment>{status.instance.workflow.created}</Moment></td>
                                <td>{status.instance.workflow.id}</td>
                                <td>{status.instance.workflow.version}</td>
                            </tr> 
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>Jobs</h3>
                    <p>
                        Jobsoverview of {status.instance.workflow.name}
                        <Button style={{float: 'right'}} variant='secondary' onClick={() => handleScroll('down')}>Scroll to bottom</Button>
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table>
                        <thead>
                            <tr>
                                <th>Job name</th>
                                <th>Job status</th>
                                <th>Incidents</th>
                                <th>Time</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {status.instance.jobs.map(job => ( 
                            <tr key={job.id}>
                                <td>{job.name}</td>
                                <td><StatusBadge status={job.status} /></td>
                                <td>{job.incidents !== null ? 
                                <Table size='sm' borderless>
                                    <thead>
                                        <tr>
                                            <th>Incident number</th>
                                            <th>Message</th>
                                            <th>Occured</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {job.incidents.map(incident => 
                                            <tr>
                                                <td>{incident.id}</td>
                                                <td>{incident.message}</td>
                                                <td><Moment>{incident.timestamp}</Moment></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table> : 'No incidents'}</td>
                                <td><Moment>{job.timestamp}</Moment></td>
                                <td><a href={`https://zeebe-dev.kpn.org/views/instances/${status.instance.id}`} target='_blank' rel='noreferrer'>To workflow</a></td>
                            </tr> 
                        ))} 
                        </tbody> 
                    </Table>
                </Col>
            </Row> 
            <Row ref={scrollDownRef}>
                    <Col>
                    <Button style={{float: 'right'}} variant='secondary' onClick={() => handleScroll('up')}>Scroll to top</Button>  
                    </Col>                           
            </Row>
            </>
            : <Loader />}
        </Container>
    )
}

export default DeploymentDetails
