import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { Provider, rootStore } from 'store';

import { GetData } from 'services';
import Connector from 'services/walletConnect';

import { App } from './App';

import 'styles/index.scss';

const root = document.getElementById('root');
const app = (
  <Router>
    <Provider value={rootStore}>
      <Connector>
        <GetData />
        <App />
      </Connector>
    </Provider>
  </Router>
);

ReactDOM.render(app, root);
