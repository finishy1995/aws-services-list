import React from 'react';
import ReactDOM from 'react-dom';
import App from './modules/Overall/App';
import registerServiceWorker from './modules/Overall/registerServiceWorker';

ReactDOM.render(<App defaultSelectedKeys="1" />, document.getElementById('root'));
registerServiceWorker();
