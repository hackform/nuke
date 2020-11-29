import 'fork-awesome/css/fork-awesome.min.css';
import 'inter-ui/inter.css';
import 'typeface-merriweather/index.css';
import 'main.scss';

import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import {APIContext} from '@xorkevin/substation';
import {
  AuthCtx,
  TurbineDefaultOpts,
  makeInitAuthState,
} from '@xorkevin/turbine';
import {
  DarkModeCtx,
  DarkModeDefaultOpts,
  makeInitDarkModeState,
  SnackbarCtx,
  SnackbarDefaultOpts,
  MainContent,
  Section,
  Container,
} from '@xorkevin/nuke';

import {allRoles} from 'roles';
import App from 'app';
import {APIClient} from 'api';

const UnAuthFallback = (
  <MainContent>
    <Section>
      <Container padded narrow>
        <h4>Unauthorized</h4>
      </Container>
    </Section>
  </MainContent>
);

const authctx = Object.assign({}, TurbineDefaultOpts, {
  fallbackView: UnAuthFallback,
  roleIntersect: allRoles,
});
const darkmodectx = Object.assign({}, DarkModeDefaultOpts);
const snackbarctx = Object.assign({}, SnackbarDefaultOpts);

const initAuthState = makeInitAuthState(authctx);
const initDarkModeState = makeInitDarkModeState(darkmodectx);

const init = (snap) => {
  initAuthState(snap);
  initDarkModeState(snap);
};

ReactDOM.render(
  <RecoilRoot initializeState={init}>
    <APIContext.Provider value={APIClient}>
      <AuthCtx.Provider value={authctx}>
        <DarkModeCtx.Provider value={darkmodectx}>
          <SnackbarCtx.Provider value={snackbarctx}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SnackbarCtx.Provider>
        </DarkModeCtx.Provider>
      </AuthCtx.Provider>
    </APIContext.Provider>
  </RecoilRoot>,
  document.getElementById('mount'),
);
