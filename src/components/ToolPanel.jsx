import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

import { SketchPicker } from 'react-color';
import { Button, Dropdown } from 'semantic-ui-react';

@inject('appStore')
@observer
class ToolPanel extends Component {
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
            changeColor,

            imgDownloadHref,
            screens,
            activeScreen,
            changeActiveScreen,
            downoadImg
        } = this.appStore;

        return (
            <div className="b tool-panel">
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
            </div>
        );
    }
}

export default ToolPanel;