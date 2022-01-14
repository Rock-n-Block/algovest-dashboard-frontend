import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from './App';
import { Provider, rootStore } from 'store';
import Connector from 'services/walletConnect';

import 'styles/index.scss';

const root = document.getElementById('root');
const app = (
  <Router>
    <Provider value={rootStore}>
      <Connector>
        <App />
      </Connector>
    </Provider>
  </Router>
);

ReactDOM.render(app, root);
