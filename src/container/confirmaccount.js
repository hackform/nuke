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
import {ConfirmAccountReq} from 'reducer/createaccount';

class ConfirmAccount extends Component {
  constructor(props){
    super(props);
    this.state = {
      key: props.match.params.key || '',
    };
    this.confirmaccount = this.confirmaccount.bind(this);
    this.navigateLogin = this.navigateLogin.bind(this);
  }

  navigateLogin(){
    this.props.history.push('/a/login');
  }

  confirmaccount(){
    this.props.confirmaccount(this.state.key);
  }

  render({success, config, err}, {key}){
    const bar = [];
    if(!success){
      bar.push(<Button text onClick={this.navigateLogin}>Cancel</Button>);
      bar.push(<Button primary onClick={this.confirmaccount}>Submit</Button>);
    } else {
      bar.push(<Button outline onClick={this.navigateLogin}>Sign in</Button>);
    }
    return <Section container padded>
      <Card center size="md" restrictWidth titleBar title={[
        <h3>Confirm account</h3>
      ]} bar={bar}>
        <Input label="code" fullWidth value={key} onChange={linkState(this, 'key')}/>
        {!success && err && <span>{err}</span>}
        {success && <span>
          <span>Your account has been created</span>
        </span>}
      </Card>
    </Section>;
  }
}

const mapStateToProps = (state)=>{
  const {confirmsuccess, confirmconfig, confirmerr} = state.CreateAccount;
  return {
    success: confirmsuccess,
    config: confirmconfig,
    err: confirmerr,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    confirmaccount: (key)=>{
      dispatch(ConfirmAccountReq(key));
    },
  };
};

ConfirmAccount = connect(mapStateToProps, mapDispatchToProps)(ConfirmAccount);
ConfirmAccount = withRouter(ConfirmAccount);

export default ConfirmAccount
