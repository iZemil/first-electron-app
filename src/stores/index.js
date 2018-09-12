import AppStore from './AppStore';

class RootStore {
    constructor() {
        this.appStore = new AppStore(this);
    }
}

export default new RootStore();
