import React from 'react';
import ReactDOM from 'react-dom';
import App from './modules/Overall/App';
import ServicesListBlock from './modules/Block/ServicesListBlock';
import registerServiceWorker from './modules/Overall/registerServiceWorker';

ReactDOM.render(<App defaultSelectedKeys="1" />, document.getElementById('root'));
ReactDOM.render(<ServicesListBlock defaultRegions="us-east-1,us-west-2,cn-north-1,cn-northwest-1" />, document.getElementById('Content'));
registerServiceWorker();
