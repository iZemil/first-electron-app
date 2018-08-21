import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import electron, {desktopCapturer, ipcRenderer} from 'electron';
import cn from 'classnames';

import { Button, Dropdown } from 'semantic-ui-react';
import CanvasInstruments from './CanvasInsruments';

function handler() {
    console.log(electron.screen.getCursorScreenPoint())
}
// setInterval(handler, 1000);
@inject('appStore')
@observer
class Root extends Component {
    constructor(props) {
        super(props);

        this.appStore = props.appStore;

        this.state = {
            width: 1600,
            height: 900,
            isHandleMousePointer: false,
            screens: [{ text: '', id: ''}],
            activeScreen: {
                text: null,
                id: null
            }
        };

        // Refs:
        this.canvasRef = React.createRef();
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        ipcRenderer.on('takeImg', this.takeImg);
        this.setScreens();
    }

    setScreens = () => {
        const _this = this;

        desktopCapturer.getSources({ types:['window', 'screen'] }, function(error, sources) {
            if (error) throw error;

            const screens = sources.map(it => ({
                text: it.name,
                id: it.id
            }));

            _this.setState({
                screens
            });
        });
    }

    captureScreen = () => {
        const {
            activeScreen
        } = this.state;

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: activeScreen.id,
                    minWidth: 1920,
                    maxWidth: 1920,
                    minHeight: 1080,
                    maxHeight: 1080
                }
            }
        })
        .then((stream) => {
            this.handleStream(stream);
        })
        .catch((e) => console.error(e))
    }

    handleStream = (stream) => {
        const video = this.videoRef.current;

        video.srcObject = stream;

        video.onloadedmetadata = (e) => {
            video.play();
            this.takeImg();
        }
    }

    takeImg = () => {
        const {
            width,
            height
        } = this.state;
        
        const canvas = this.canvasRef.current;
        const video = this.videoRef.current;
        
        const context = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        
        const data = canvas.toDataURL('image/png');

        this.setState({ imgDownloadHref: data });
    }

    downoadImg = () => {
        const canvas = this.canvasRef.current;
        const data = canvas.toDataURL('image/png');

        this.setState({ imgDownloadHref: data });
    }

    handleMouseMove = (e) => {
        const {
            color,
            lineWidth
        } = this.appStore;

        if (e.buttons !== 1) return;
        // console.log(electron.screen.getCursorScreenPoint());
        
        const ctx = this.canvasRef.current.getContext('2d');
        const {top, left} = this.canvasRef.current.getBoundingClientRect();
        const posX = e.clientX - left;
        const posY = e.clientY - top;

        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;

        ctx.moveTo(posX, posY);

        ctx.lineTo(posX, posY);

        ctx.stroke();
    }

    toggleHandleMousePointer = () => {
        const { isHandleMousePointer } = this.state;

        this.setState(
            { isHandleMousePointer: !isHandleMousePointer },
            () => { this.handleMousePointer() }
        );
    }

    handleMousePointer() {
        const { isHandleMousePointer } = this.state;
        const displays = electron.screen;
        
        if(isHandleMousePointer) {
            console.log(true)
            displays.addEventListener('mousemove', handler);
        } else {
            console.log(false)
            displays.removeEventListener('mousemove', handler);
        }
    }

    checkFn = () => {
        ipcRenderer.send('check', {width: 50, height: 50})
    }

    changeActiveScreen = (e, data) => {
        const {
            name: text,
            id
        } = data;

        this.setState({
            activeScreen: {
                text,
                id
            }
        }, () => this.captureScreen());
    }

    render() {
        const {
            imgDownloadHref,
            width,
            height,
            isHandleMousePointer,
            screens,
            activeScreen
        } = this.state;

        return(
            <div className="Root">
                <div className="b">
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
                                    const {
                                        id,
                                        text
                                    } = it;
                                    
                                        return (<Dropdown.Item 
                                            key={id} 
                                            id={id}
                                            name={text}
                                            onClick={(e, data) => this.changeActiveScreen(e, data)}
                                        >
                                            {text}
                                        </Dropdown.Item>);
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button
                            className={cn({'active': isHandleMousePointer})}
                            icon='mouse pointer'
                            onClick={this.toggleHandleMousePointer}
                        />
                        <Button icon='linkify' />
                        <Button
                            icon='download'
                            download="sreenshot"
                            as={'a'}
                            href={imgDownloadHref}
                            onClick={this.downoadImg}
                        />
                    </Button.Group>
                </div>

                <div className="streaming">
                    <h3>Stream:</h3>
                    <video id="video" ref={this.videoRef}></video>
                </div>

                <div className="canvas-wrapper">
                    <CanvasInstruments />

                    <div className="b">
                        <Button
                            onClick={this.checkFn}
                        >
                            Check Button
                        </Button>
                    </div>

                    <canvas
                        width={width}
                        height={height}
                        ref={this.canvasRef}
                        onMouseMove={this.handleMouseMove}
                    />
                </div>
            </div>
        )
    }
}

export default Root;