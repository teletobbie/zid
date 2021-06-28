import { setUsername, setPassword, setBasicAuth, setError } from '../actions/authAction';
import Alert from 'react-bootstrap/Alert';
import { connect } from 'react-redux';
import Login from '../api/Login';
import Zeebe_logo from '../images/zeebe.png';

/**
 * Create and return a JSX.Element Login form.
 * @param {object} props component props
 * @returns {JSX.Element} A login form. 
 */
const LoginScreen = ({ username, password, error, doSetUsername, doSetPassword, doSetError, doSetBasicAuth}) => {
    const onSubmit = (e) => {
        e.preventDefault();
        Login(username, password).then(basicAuth => doSetBasicAuth(basicAuth)).catch(err => doSetError(err))
    } 

    return (
        <div className='form-container'>
            <img src={Zeebe_logo} alt='Zeebe logo'/>
            <h1>Zeebe Infrastructure Designer</h1>
            {error !== undefined ? <Alert variant='danger'>
                <Alert.Heading>Whoeps, you got an error!</Alert.Heading>
                <p>Login credentials are wrong or you are not autorised.</p> 
            </Alert> : null}
            <form onSubmit={onSubmit}>
                <label htmlFor='user'>Username</label>
                <input type='text' id='user' name='username' onChange={e => doSetUsername(e.target.value)} value={username} placeholder='username' />
                <label htmlFor='pass'>Password</label>
                <input type='password' id='pass' name='password' onChange={e => doSetPassword(e.target.value)} value={password} placeholder='password' />

                <input type='submit' value='Login' />
            </form>
        </div>
    )
}


/**
 * Map Redux state to local props 
 */
const mapStateToProps = state => ({
    username: state.auth.username,
    password: state.auth.password,
    error: state.auth.error,
    basicAuth: state.auth.basicAuth
})

/**
 * Map Redux dispatch actions to local props. 
 */
const mapDispatchToProps = { 
    doSetUsername: setUsername,
    doSetPassword: setPassword,
    doSetError: setError,
    doSetBasicAuth: setBasicAuth
 }

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
