import React, {Component, Fragment} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from 'react-redux';

import {DarkMode} from 'reducer/settings';
import {Logout} from 'reducer/account/auth';

import Loader from 'loader';
import Protected from 'protected';

import MainContent from 'component/maincontent';
import {Navbar, Navitem} from 'component/navbar';
import Menu from 'component/menu';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

const loadAdminContainer = Protected(
  Loader(() => {
    return import('container/admin');
  }),
);
const loadLoginContainer = Loader(() => {
  return import('container/login');
});
const loadAccountContainer = Protected(
  Loader(() => {
    return import('container/account');
  }),
);
const loadUserContainer = Protected(
  Loader(() => {
    return import('container/user');
  }),
);
const loadManageContainer = Protected(
  Loader(() => {
    return import('container/manage');
  }),
  'admin',
);
const loadHealthContainer = Protected(
  Loader(() => {
    return import('container/health');
  }),
  'admin',
);
const loadCourierContainer = Protected(
  Loader(() => {
    return import('container/courier');
  }),
  'admin',
);
const loadSetupContainer = Loader(() => {
  return import('container/setup');
});

class Admin extends Component {
  constructor(props) {
    super(props);
    this.toggleDark = this.toggleDark.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleDark() {
    this.props.toggleDark();
  }

  logout() {
    this.props.logout();
  }

  render() {
    const {loggedIn} = this.props;
    return (
      <div>
        {loggedIn && (
          <Navbar
            sidebar
            left={
              <Fragment>
                <Navitem home>
                  <NavLink exact to="/">
                    <FaIcon icon="home" />
                    <small>Home</small>
                  </NavLink>
                </Navitem>
                <Navitem>
                  <NavLink to="/health">
                    <FaIcon icon="server" />
                    <small>Health</small>
                  </NavLink>
                </Navitem>
                <Navitem>
                  <NavLink to="/manage">
                    <FaIcon icon="building" />
                    <small>Manage</small>
                  </NavLink>
                </Navitem>
                <Navitem>
                  <NavLink to="/courier">
                    <FaIcon icon="paper-plane" />
                    <small>Courier</small>
                  </NavLink>
                </Navitem>
              </Fragment>
            }
            right={
              <Fragment>
                <Navitem>
                  <Menu
                    icon={
                      <Fragment>
                        <FaIcon icon="cog" /> <small>Settings</small>
                      </Fragment>
                    }
                    size="md"
                    fixed
                    align="left"
                    position="top"
                  >
                    <Link to="/a/account">
                      <FaIcon icon="address-card-o" /> Account
                    </Link>
                    <span onClick={this.toggleDark}>
                      <FaIcon icon="bolt" /> Dark Mode
                    </span>
                    <Anchor ext href="https://github.com/xorkevin">
                      <FaIcon icon="github" /> xorkevin
                    </Anchor>
                    <span onClick={this.logout}>
                      <FaIcon icon="sign-out" /> Sign out
                    </span>
                  </Menu>
                </Navitem>
              </Fragment>
            }
          />
        )}

        <MainContent withSidebar={loggedIn} sectionNoMargin>
          <Switch>
            <Route exact path="/" component={loadAdminContainer} />
            <Route path="/x" component={loadLoginContainer} />
            <Route path="/a" component={loadAccountContainer} />
            <Route path="/u" component={loadUserContainer} />
            <Route path="/manage" component={loadManageContainer} />
            <Route path="/health" component={loadHealthContainer} />
            <Route path="/courier" component={loadCourierContainer} />
            <Route path="/setup" component={loadSetupContainer} />
            <Redirect to="/" />
          </Switch>
        </MainContent>

        <Footer withSidebar={loggedIn}>
          <Grid map center sm={8}>
            <div className="text-center">
              <h4>Nuke</h4>a reactive frontend for governor
            </div>
            <div className="text-center">
              <ul>
                <li>
                  <Anchor noColor ext href="https://github.com/hackform/nuke">
                    <FaIcon icon="github" /> Github
                  </Anchor>
                </li>
                <li>
                  Designed for{' '}
                  <Anchor
                    noColor
                    ext
                    href="https://github.com/hackform/governor"
                  >
                    hackform/governor
                  </Anchor>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <h5>
                <FaIcon icon="code" /> with <FaIcon icon="heart-o" /> by{' '}
                <Anchor noColor ext href="https://github.com/xorkevin">
                  <FaIcon icon="github" /> xorkevin
                </Anchor>
              </h5>
            </div>
          </Grid>
        </Footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {loggedIn} = state.Auth;
  return {
    loggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDark: () => {
      dispatch(DarkMode());
    },
    logout: () => {
      dispatch(Logout());
    },
  };
};

Admin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Admin);
Admin = withRouter(Admin);

export default Admin;
