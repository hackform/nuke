import {Fragment} from 'react';
import {useLogin} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  useMenu,
  Menu,
  MenuItem,
  FaIcon,
  Card,
  Field,
  Form,
  useForm,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const SigninContainer = ({pathCreate, pathForgot}) => {
  const menu = useMenu();

  const form = useForm({
    username: '',
    password: '',
  });

  const [login, execLogin] = useLogin(form.state.username, form.state.password);

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Card
            center
            width="md"
            title={
              <Container padded>
                <h3>Sign in</h3>
              </Container>
            }
            bar={
              <Fragment>
                <ButtonGroup>
                  <ButtonTertiary
                    forwardedRef={menu.anchorRef}
                    onClick={menu.toggle}
                  >
                    <FaIcon icon="ellipsis-v" />
                  </ButtonTertiary>
                  <ButtonPrimary onClick={execLogin}>Login</ButtonPrimary>
                </ButtonGroup>
                {menu.show && (
                  <Menu size="md" anchor={menu.anchor} close={menu.close}>
                    <MenuItem
                      local
                      link={pathCreate}
                      icon={<FaIcon icon="user-plus" />}
                    >
                      Create Account
                    </MenuItem>
                    <MenuItem
                      local
                      link={pathForgot}
                      icon={<FaIcon icon="unlock-alt" />}
                    >
                      Forgot Password
                    </MenuItem>
                  </Menu>
                )}
              </Fragment>
            }
          >
            <Container padded>
              <Form
                formState={form.state}
                onChange={form.update}
                onSubmit={execLogin}
              >
                <Field
                  name="username"
                  label="Username / Email"
                  fullWidth
                  autoComplete="username"
                  autoFocus
                />
                <Field
                  name="password"
                  type="password"
                  label="Password"
                  fullWidth
                  autoComplete="current-password"
                />
              </Form>
              {login.err && <p>{login.err}</p>}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export default SigninContainer;
