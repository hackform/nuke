import {h, Component} from 'preact';
import {Switch, Route, Redirect, NavLink, withRouter} from 'react-router-dom';
import Section from 'component/section';
import Tabbar from 'component/tabbar';

import Loader from 'loader';

class Account extends Component {
  render({match}){
    return <Section container narrow padded sectionTitle="Settings">
      <Tabbar left={[
        {key: 'account', component: <NavLink to={`${match.path}/account`}>Account</NavLink>},
        {key: 'profile', component: <NavLink to={`${match.path}/profile`}>Profile</NavLink>},
      ]}/>
      <Switch>
        <Route path={`${match.path}/account`} component={Loader(()=>{return import('container/account/details');})}/>
        <Route path={`${match.path}/profile/edit`} component={Loader(()=>{return import('container/account/profileedit');})}/>
        <Route path={`${match.path}/profile`} component={Loader(()=>{return import('container/account/profile');})}/>
        <Redirect to={`${match.path}/account`}/>
      </Switch>
    </Section>;
  }
}

Account = withRouter(Account);

export default Account
