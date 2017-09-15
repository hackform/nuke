import {h, Component} from 'preact';
import {withRouter} from 'react-router-dom';
import linkState from 'linkstate';
import Section from 'component/section';
import Menu from 'component/menu';
import FaIcon from 'component/faicon';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'preact-redux';
import {CreateAccountReq} from 'reducer/createaccount';

class CreateAccount extends Component {
  constructor(props){
    super(props);
    this.state = {
      form: {
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
      },
      clienterr: false,
      password_confirm: '',
      email_confirm: '',
    };
    this.createaccount = this.createaccount.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
    this.navigateConfirm = this.navigateConfirm.bind(this);
  }

  navigateHome(){
    this.props.history.push('/');
  }

  navigateConfirm(){
    this.props.history.push('/a/confirm');
  }

  createaccount(){
    const {password, email} = this.state.form;
    const {password_confirm, email_confirm} = this.state;
    if(password !== password_confirm){
      this.setState((prevState)=>{
        return Object.assign({}, prevState, {clienterr: 'passwords do not match'});
      });
    } else if(email !== email_confirm){
      this.setState((prevState)=>{
        return Object.assign({}, prevState, {clienterr: 'emails do not match'});
      });
    } else {
      this.setState((prevState)=>{
        return Object.assign({}, prevState, {clienterr: false});
      });
      this.props.createaccount(this.state.form);
    }
  }

  render({success, config, err}, {clienterr}){
    return <Section container padded>
      <Card center size="md" restrictWidth titleBar title={[
        <h3>Sign up</h3>
      ]} bar={[
        <Button text onClick={this.navigateHome}>Cancel</Button>, <Button primary onClick={this.createaccount}>Submit</Button>
      ]}>
        <Input label="first name" fullWidth onChange={linkState(this, 'form.first_name')}/>
        <Input label="last name" fullWidth onChange={linkState(this, 'form.last_name')}/>
        <Input label="username" fullWidth onChange={linkState(this, 'form.username')}/>
        <Input label="password" type="password" fullWidth onChange={linkState(this, 'form.password')}/>
        <Input label="confirm password" type="password" fullWidth onChange={linkState(this, 'password_confirm')}/>
        <Input label="email" fullWidth onChange={linkState(this, 'form.email')}/>
        <Input label="confirm email" fullWidth onChange={linkState(this, 'email_confirm')} onEnter={this.createaccount}/>
        {!success && clienterr && <span>{clienterr}</span>}
        {!success && !clienterr && err && <span>{err}</span>}
        {success && <span>
          <span>Confirm your account with a code emailed to the address you provided above</span>
          <Button outline onClick={this.navigateConfirm}>Confirm</Button>
        </span>}
      </Card>
    </Section>;
  }
}

const mapStateToProps = (state)=>{
  const {success, config, err} = state.CreateAccount;
  return {
    success, config, err,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    createaccount: (options)=>{
      dispatch(CreateAccountReq(options));
    },
  };
};

CreateAccount = connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
CreateAccount = withRouter(CreateAccount);

export default CreateAccount
