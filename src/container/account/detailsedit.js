import {h, Component} from 'preact';
import {Link, withRouter} from 'react-router-dom';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import Input from 'component/form';
import Button from 'component/button';
import ListItem from 'component/list';

import {connect} from 'preact-redux';
import {EditAccountReq} from 'reducer/account/edit';

class AccountDetailsEdit extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: props.username,
      first_name: props.firstname,
      last_name: props.lastname,
    };
    this.editaccount = this.editaccount.bind(this);
    this.navigateAccount = this.navigateAccount.bind(this);
  }

  navigateAccount(){
    this.props.history.replace('/a/account');
  }

  editaccount(){
    this.props.editaccount(this.state);
  }

  componentDidMount(){
    if(!this.props.userid){
      this.navigateAccount();
    }
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.userid){
      this.navigateAccount();
    }
  }

  render({success, err, userid}, {username, first_name, last_name}){
    if(!userid){
      return false;
    }
    const bar = [];
    bar.push(<Link to="/a/account"><Button text>Cancel</Button></Link>);
    bar.push(<Button primary onClick={this.editaccount}>Save</Button>);
    return <Card size="md" restrictWidth center bar={bar}>
      <Section subsection sectionTitle="Account Details">
        <ListItem label="userid" item={userid}/>
        <Input fullWidth label="username" value={username} onChange={linkstate(this, 'username')}/>
        <Input fullWidth label="first name" value={first_name} onChange={linkstate(this, 'first_name')}/>
        <Input fullWidth label="last name" value={last_name} onChange={linkstate(this, 'last_name')}/>
      </Section>
      {err && <span>{err}</span>}
      {success && <span>Changes saved</span>}
    </Card>;
  }
}

const mapStateToProps = (state)=>{
  const {success, err} = state.EditAccount;
  const {userid, username, firstname, lastname} = state.Auth;
  return {
    success, err, userid, username, firstname, lastname,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    editaccount: (options)=>{
      dispatch(EditAccountReq(options));
    },
  };
};

AccountDetailsEdit = connect(mapStateToProps, mapDispatchToProps)(AccountDetailsEdit);
AccountDetailsEdit = withRouter(AccountDetailsEdit);

export default AccountDetailsEdit
