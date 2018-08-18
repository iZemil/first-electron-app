import React from 'react';
import { render } from 'react-dom';
import DevTools from 'mobx-react-devtools';
import {Provider} from 'mobx-react';
import Root from './components/Root';

import 'semantic-ui-css/semantic.min.css';
import './styles.scss';


render(
    <div>
        <Root />
    </div>,
    document.getElementById('root'),
);