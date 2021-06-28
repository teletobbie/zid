import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import golang from '../images/sadGopher.png'

/**
 * Create and return a page 404 not found JSX Element
 * @returns {JSX.Element} A page 404.
 */
const Page404 = () => {
    return (
        <Container className="justify-content-md-center">
            <Row>
                <Col className="m-auto">
                    <img className="d-block mx-auto img-fluid w-50" src={golang} alt='404 page not found' />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Alert variant="danger">
                        <Alert.Heading>Wow! I could not find what you are looking for...</Alert.Heading>
                        <p>
                            The page that you requested could not be found.
                        </p>
                        <hr />
                        <Alert.Link href="/dashboard">Return to the dashboard page</Alert.Link>
                    </Alert>
                </Col>
            </Row>
        </Container>
    )
}

export default Page404
