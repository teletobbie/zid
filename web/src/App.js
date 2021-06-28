import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Drawer from "./components/Drawer";
import Header from './components/Header';
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import DeploymentOverview from './components/DeploymentOverview';
import Dashboard from './components/Dashboard'
import { connect } from 'react-redux';
import { setBasicAuth } from './actions/authAction';
import { GetBasicAuth } from './api/ApiCall';
import AddProject from './components/AddProject';
import Page404 from './utils/StatusPages';
import DeploymentDetails from './components/DeploymentDetails';
import CurrentDeployments from './components/CurrentDeployments';

/**
 * Create and returns a base App element containing all the other JSX components. 
 * @param {object} props app props 
 * @returns {JSX.Element} App JSX element
 */
const App = ({ basicAuth, doSetBasicAuth }) => {

  GetBasicAuth().then(ba => doSetBasicAuth(ba))
  
  if (!basicAuth) {
    return (
      <>
        <LoginScreen />
        <Footer />
      </>
    )
  }

  return (
      <div className='content-container'>
        <Header />
        <BrowserRouter> 
          <Switch>
            <Route exact path='/deployment/:diagram_id'>
              <DeploymentOverview/>
            </Route>
            <Route exact path='/deployment/details/:key'>
              <DeploymentDetails />
            </Route>
            <Route exact path='/drawer/:ticketnumber'>
              <Drawer />
            </Route>
            <Route exact path='/dashboard'>
              <Dashboard />
            </Route>
            <Route exact path='/deployments'>
              <CurrentDeployments />
            </Route>
            <Route exact path='/project/create'>
              <AddProject />
            </Route>
            <Route exact path='/'>
              <Dashboard />
            </Route>
            <Route component={Page404} />
          </Switch>
        </BrowserRouter>
        <Footer />
      </div>
  );
}

/**
 * Map Redux state to local props 
 */
const mapStateToProps = state => ({
  basicAuth: state.auth.basicAuth
});

/**
 * Map Redux dispatch actions to local props. 
 */
const mapDispatchToProps = {
  doSetBasicAuth: setBasicAuth
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
