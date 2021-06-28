import {useEffect, useState} from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { connect } from "react-redux";
import { logout, setUsername } from "../actions/authAction";
import getSource from '../utils/profilePicture';

/**
 * Create and return a JSX Navigation Element. 
 * @param {object} props props of the Navigation Component
 * @returns {JSX.Element} A Navigation Component
 */
const Navigation = ({ username, doLogout, doSetUsername }) => {
    const [pictureIndex, setPictureIndex] = useState()
    
    useEffect(() => {
        doSetUsername(sessionStorage.getItem('username'))
        setPictureIndex(sessionStorage.getItem('pictureindex'))
    }, [doSetUsername, setPictureIndex])

    return (
        <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/dashboard">Zeebe Infrastructure Designer</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                    <Nav.Link href="/deployments">Deployments</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-end">
                <Nav>
                    <NavDropdown id="basic-nav-dropdown" title={
                            <img src={getSource(pictureIndex)} alt={'@'+username}/>}>
                        <NavDropdown.ItemText>Signed in as {username}</NavDropdown.ItemText>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={doLogout} href="/">Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse> 
        </Container>
        </Navbar>
    )
}

const mapStateToProps = state => ({
    username: state.auth.username
})

const action = {
    doLogout: logout,
    doSetUsername: setUsername
}

export default connect(mapStateToProps, action)(Navigation) 
