import React, {Fragment} from 'react';
import { render } from 'react-dom';
import DevTools from 'mobx-react-devtools';
import {Provider} from 'mobx-react';
import Root from './components/Root';
import stores from './stores'

import 'semantic-ui-css/semantic.min.css';
import './styles.scss';

render(
    <Provider {...stores}>
        <Fragment>
            <Root />
            {/* <DevTools /> */}
        </Fragment>
    </Provider>,
    document.getElementById('root'),
);