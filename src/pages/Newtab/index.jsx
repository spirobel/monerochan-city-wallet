import React from 'react';
import { render } from 'react-dom';
import App from '../../app/App'

render(<App />, window.document.querySelector('#app-container'));

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../../features/navigation/navigation-slice', () => store.replaceReducer(navigationReducer))
}