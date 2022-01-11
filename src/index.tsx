import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from './App';

import 'styles/index.scss';

const root = document.getElementById('root');
const app = (
  <Router>
    <App />
  </Router>
);

ReactDOM.render(app, root);
