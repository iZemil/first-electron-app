import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import electron, {ipcRenderer} from 'electron';
import cn from 'classnames';

import { Button, Dropdown } from 'semantic-ui-react';
import CanvasInstruments from './CanvasInsruments';

function handleMousePosition() {
    console.log(electron.screen.getCursorScreenPoint())
}

@inject('appStore')
@observer
class Root extends Component {
    constructor(props) {
        super(props);
        
        this.appStore = props.appStore;

        this.canvasRef = React.createRef();
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        this.appStore.setScreens();
        this.appStore.initRefs(this);
    }

    render() {
        const {
            imgDownloadHref,
            width,
            height,
            screens,
            activeScreen,
            changeActiveScreen,
            downoadImg,
            handleMouseMove
        } = this.appStore;

        return(
            <div className="Root">
                <div className="b boot-panel">
                    <Button.Group size='small'>
                        <Dropdown
                                text={activeScreen.text || 'Window'}
                                icon='desktop'
                                button
                                className='icon'
                                labeled                          
                            >
                            <Dropdown.Menu>
                                {screens.map(it => {
                                    const { id, text } = it;
                                    
                                    return (
                                        <Dropdown.Item 
                                            key={id} 
                                            id={id}
                                            name={text}
                                            onClick={changeActiveScreen}
                                        >
                                            {text}
                                        </Dropdown.Item>);
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button icon='mouse pointer' />
                        <Button icon='linkify' />
                        <Button
                            icon='download'
                            download="sreenshot"
                            as={'a'}
                            href={imgDownloadHref}
                            onClick={downoadImg}
                        />
                    </Button.Group>

                    <CanvasInstruments />
                </div>

                <div className="streaming">
                    <h3>Stream:</h3>
                    <video id="video" ref={this.videoRef}></video>
                </div>

                <div className="canvas-wrapper">
                    <canvas
                        width={width}
                        height={height}
                        ref={this.canvasRef}
                        onMouseMove={handleMouseMove}
                    />
                </div>
            </div>
        )
    }
}

export default Root;