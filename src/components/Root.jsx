import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import electron, {ipcRenderer} from 'electron';

import ToolPanel from './ToolPanel';

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
            width,
            height,
            handleMouseMove,
            handleMouseDown,
            handleMouseUp,
            handleMouseOut,
        } = this.appStore;

        return(
            <div className="Root">
                <ToolPanel />

                <div className="canvas-wrapper">
                    <canvas
                        ref={this.canvasRef}
                        width={width}
                        height={height}
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseOut={handleMouseOut}
                    />
                </div>

                <div className="streaming">
                    <h3>Stream:</h3>
                    <video id="video" ref={this.videoRef} />
                </div>
            </div>
        )
    }
}

export default Root;