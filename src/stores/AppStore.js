import {observable, action} from 'mobx';

class AppStore {
    @observable displayColorPicker = false;

    @observable lineWidth = 5;

    @observable color = '#fff';

    @action.bound
    changeLineWidth(e) {
        this.lineWidth = e.target.value;
    }

    @action.bound
    toggleColorPicker() {
        this.displayColorPicker = !this.displayColorPicker;
    }

    @action.bound
    changeColor = (color) => {
        console.log(color);

        this.color = color.hex;
    };
}

export default AppStore;