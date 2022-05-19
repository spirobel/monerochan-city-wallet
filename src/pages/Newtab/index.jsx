import React from 'react';
import { render } from 'react-dom';
import App from '../../app/App'
import NewtabApp from '../../app/NewtabApp'

render(<NewtabApp />, window.document.querySelector('#app-container'));
