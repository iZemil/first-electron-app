import React, {Component} from 'react';
import {desktopCapturer} from 'electron';

import { Button } from 'semantic-ui-react'

class Root extends Component {
    constructor(props) {
        super(props);

        this.showSources = this.showSources.bind(this);
        this.handleStream = this.handleStream.bind(this);
    }

    showSources() {
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

    handleStream (stream) {    
        const video = document.querySelector('video');

        video.srcObject = stream;
        video.onloadedmetadata = (e) => video.play();
    }

    render() {
        return(
            <div>
                <h2>Screen Captain</h2>
                <div>
                    <Button
                        onClick={this.showSources}
                    >
                        Start stream
                    </Button>
                </div>

                <video></video>
            </div>
        )
    }
}

export default Root;