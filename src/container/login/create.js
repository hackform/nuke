import {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {emailRegex} from '../../utility';
import {useAPICall} from '@xorkevin/substation';
import {
  MainContent,
  Section,
  Container,
  Card,
  Field,
  Form,
  useForm,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPICreateAccount = (api) => api.u.user.create;

const formErrCheck = ({password, email, password_confirm, email_confirm}) => {
  const err = {};
  if (password.length > 0 && password.length < 10) {
    err.password = true;
  }
  if (password_confirm.length > 0 && password_confirm !== password) {
    err.password_confirm = 'Must match password';
  }
  if (email.length > 0 && !emailRegex.test(email)) {
    err.email = true;
  }
  if (email_confirm.length > 0 && email_confirm !== email) {
    err.email_confirm = 'Must match email';
  }
  return err;
};

const formValidCheck = ({
  username,
  password,
  email,
  first_name,
  last_name,
  password_confirm,
  email_confirm,
}) => {
  const valid = {};
  if (username.length > 2) {
    valid.username = true;
  }
  if (password.length > 9) {
    valid.password = true;
  }
  if (emailRegex.test(email)) {
    valid.email = true;
  }
  if (first_name.length > 0) {
    valid.first_name = true;
  }
  if (last_name.length > 0) {
    valid.last_name = true;
  }
  if (password.length > 0 && password_confirm === password) {
    valid.password_confirm = true;
  }
  if (email_confirm.length > 0 && email_confirm === email) {
    valid.email_confirm = true;
  }
  return valid;
};

const prehookValidate = ([form]) => {
  const {password, email, password_confirm, email_confirm} = form;
  if (password !== password_confirm) {
    return 'Passwords do not match';
  }
  if (email !== email_confirm) {
    return 'Emails do not match';
  }
};

const CreateAccount = ({pathLogin, pathConfirm, userApprovals}) => {
  const form = useForm({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    password_confirm: '',
    email_confirm: '',
  });

  const [create, execCreate] = useAPICall(
    selectAPICreateAccount,
    [form.state],
    {},
    {prehook: prehookValidate},
  );

  return (
    <MainContent>
      <Section>
        <Container padded>
          <Card
            center
            width="md"
            title={
              <Container padded>
                <h3>Sign up</h3>
              </Container>
            }
            bar={
              <ButtonGroup>
                {create.success ? (
                  userApprovals ? (
                    <Link to={pathLogin}>
                      <ButtonSecondary>Finish</ButtonSecondary>
                    </Link>
                  ) : (
                    <Link
                      to={`${pathConfirm}?userid=${encodeURIComponent(
                        create.data.userid,
                      )}`}
                    >
                      <ButtonSecondary>Confirm</ButtonSecondary>
                    </Link>
                  )
                ) : (
                  <Fragment>
                    <Link to={pathLogin}>
                      <ButtonTertiary>Cancel</ButtonTertiary>
                    </Link>
                    <ButtonPrimary onClick={execCreate}>Create</ButtonPrimary>
                  </Fragment>
                )}
              </ButtonGroup>
            }
          >
            <Container padded>
              <Form
                formState={form.state}
                onChange={form.update}
                onSubmit={execCreate}
                errCheck={formErrCheck}
                validCheck={formValidCheck}
              >
                <Field name="first_name" label="First name" fullWidth />
                <Field name="last_name" label="Last name" fullWidth />
                <Field
                  name="username"
                  label="Username"
                  hint="Must be at least 3 characters"
                  fullWidth
                />
                <Field
                  name="password"
                  type="password"
                  label="Password"
                  hint="Must be at least 10 characters"
                  hintRight={
                    form.state.password.length > 0
                      ? form.state.password.length
                      : ''
                  }
                  fullWidth
                />
                <Field
                  name="password_confirm"
                  type="password"
                  label="Confirm password"
                  fullWidth
                />
                <Field name="email" label="Email" fullWidth />
                <Field name="email_confirm" label="Confirm email" fullWidth />
              </Form>
              {create.err && <p>{create.err}</p>}
              {create.success &&
                (userApprovals ? (
                  <p>
                    A new user request has been sent to an administrator. A
                    confirmation email will be emailed to the address you
                    provided above when the request is approved.
                  </p>
                ) : (
                  <p>
                    Confirm your account with a code emailed to the address you
                    provided above.
                  </p>
                ))}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export default CreateAccount;
