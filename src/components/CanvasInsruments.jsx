import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

import { SketchPicker } from 'react-color';
import { Button } from 'semantic-ui-react';

@inject('appStore')
@observer
class CanvasInstruments extends Component {
    constructor(props) {
        super(props);

        this.appStore = props.appStore;
    }

    render() {
        const {
            displayColorPicker,
            color,
            lineWidth,
            changeLineWidth,
            toggleColorPicker,
            changeColor
        } = this.appStore;

        return (
            <div className="paint-instruments">
                    <Button.Group size='small'>
                        <Button icon="pencil alternate" />
                        <Button icon="expand" />
                        <Button icon="font" />
                        <Button icon="long arrow alternate down" />
                    </Button.Group>

                    <div className="color-picker">
                        <button
                            type="button"
                            className="color-picker__button"
                            style={{background: color}}
                            onClick={toggleColorPicker}
                        />
                        {displayColorPicker && <SketchPicker
                            color={color}
                            onChangeComplete={changeColor}
                        />}
                    </div>

                    <div className="line-range">
                        <input
                            type="range"
                            className="line-range__slider"
                            min="1"
                            max="100"
                            value={lineWidth}
                            onChange={changeLineWidth}
                        />
                        <input
                            type="number"
                            className="line-range__number"
                            min="1"
                            max="100"
                            value={lineWidth}
                            onChange={changeLineWidth}
                        />
                    </div>
                </div>
        )
    }
}

export default CanvasInstruments;