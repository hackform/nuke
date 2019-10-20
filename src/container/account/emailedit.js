import React, {Fragment} from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {emailRegex} from 'utility';
import {useAuthCall} from '@xorkevin/turbine';
import {Section, Card, Button, Form, Input, useForm} from '@xorkevin/nuke';

const selectAPIEditEmail = (api) => api.u.user.email.edit;

const formErrCheck = ({email}) => {
  const err = {};
  if (email.length > 0 && !emailRegex.test(email)) {
    err.email = true;
  }
  return err;
};

const formValidCheck = ({email}) => {
  const valid = {};
  if (emailRegex.test(email)) {
    valid.email = true;
  }
  return valid;
};

const AccountEmailEdit = () => {
  const match = useRouteMatch();

  const [formState, updateForm] = useForm({
    email: '',
    password: '',
  });

  const [emailState, execEditEmail] = useAuthCall(selectAPIEditEmail, [
    formState.email,
    formState.password,
  ]);

  const {success, err} = emailState;

  const bar = success ? (
    <Fragment>
      <Link to={`${match.url}/confirm`}>
        <Button outline>Confirm</Button>
      </Link>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/a/account">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execEditEmail}>
        Update
      </Button>
    </Fragment>
  );

  return (
    <Card size="md" restrictWidth center bar={bar}>
      <Section subsection sectionTitle="Account Details">
        <Form
          formState={formState}
          onChange={updateForm}
          onEnter={execEditEmail}
          errCheck={formErrCheck}
          validCheck={formValidCheck}
        >
          <Input label="email" name="email" fullWidth />
          <Input label="password" type="password" name="password" fullWidth />
        </Form>
      </Section>
      {err && <span>{err}</span>}
      {success && (
        <span>
          Confirm your email change with the code emailed to the address
          provided above
        </span>
      )}
    </Card>
  );
};

export default AccountEmailEdit;
