import React, {Component} from 'react';
import {desktopCapturer} from 'electron';

import { Button, Divider } from 'semantic-ui-react'

class Root extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posX: 0,
            posY: 0
        };

        // Refs:
        this.canvasRef = React.createRef();
        this.videoRef = React.createRef();
        // this.imageRef = React.createRef();
    }

    showSources = () => {
        const handleStream = this.handleStream;
        
        desktopCapturer.getSources({ types:['window', 'screen'] }, function(error, sources) {
            if (error) throw error;
    
            console.log(sources);
            for (let source of sources) {
                const id = source.id;

                if(id === 'screen:0:0') {
                    navigator.mediaDevices.getUserMedia({
                            audio: false,
                            video: {
                                mandatory: {
                                    chromeMediaSource: 'desktop',
                                    chromeMediaSourceId: id,
                                    minWidth: 1280,
                                    maxWidth: 1280,
                                    minHeight: 720,
                                    maxHeight: 720
                                }
                            }
                        })
                        .then((stream) => {
                            handleStream(stream);
                        })
                        .catch((e) => console.error(e))
    
                        return;
                }
            }
        });
    }

    handleStream = (stream) => {
        this.stream = stream;
        const video = this.videoRef.current;

        video.srcObject = stream;
        video.onloadedmetadata = (e) => video.play();
    }

    takeImg = () => {
        const canvas = this.canvasRef.current;
        // const photo = this.imageRef.current;
        const video = this.videoRef.current;

        const width = 1280;
        const height = 720;
        const context = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        
        const data = canvas.toDataURL('image/png');
        this.setState({ imgDownloadHref: data });
        // photo.setAttribute('src', data);
    }

    downoadImg = () => {
        const canvas = this.canvasRef.current;
        const data = canvas.toDataURL('image/png');

        this.setState({ imgDownloadHref: data });
    }

    handleMouseMove = (e) => {
        //left click define
        if (e.buttons !== 1) return;
        
        const ctx = this.canvasRef.current.getContext('2d');
        const {top, left} = this.canvasRef.current.getBoundingClientRect();
        const posX = e.clientX - left;
        const posY = e.clientY - top;

        ctx.beginPath(); //path begin
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = "white";

        ctx.moveTo(posX, posY);

        ctx.lineTo(posX, posY);

        ctx.stroke();
    }

    render() {
        const {
            imgDownloadHref
        } = this.state;

        return(
            <div className="Root">
                <div className="settings-panel">
                    <Button
                        onClick={this.showSources}
                    >
                        Start stream
                    </Button>
                    <Button
                        onClick={this.takeImg}
                    >
                        Take picture
                    </Button>
                    <a
                        className="ui button"
                        download="sreenshot"
                        href={imgDownloadHref}
                        onClick={this.downoadImg}
                    >
                        Download
                    </a>
                </div>

                <Divider />

                <div>
                    <h3>Stream:</h3>
                    <video id="video" ref={this.videoRef}></video>
                </div>

                <Divider />

                <div>
                    <h3>Canvas: </h3>
                    <canvas
                        ref={this.canvasRef}
                        onMouseMove={this.handleMouseMove}
                    />
                </div>

                {/* <Divider />

                <div className="output">
                    <h3>Image: </h3>
                    <img id="photo" ref={this.imageRef} />
                </div> */}
            </div>
        )
    }
}

export default Root;