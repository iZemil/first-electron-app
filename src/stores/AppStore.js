import {observable, action} from 'mobx';
import electron, {desktopCapturer} from 'electron';

class AppStore {
    @observable video = null;

    @observable canvas = null;

    @observable width = 1600;

    @observable height = 900;

    @observable imgDownloadHref = '';

    @observable screens = [{ text: '', id: ''}];

    @observable activeScreen = {
        text: null,
        id: null
    };

    @observable displayColorPicker = false;

    @observable lineWidth = 10;

    @observable color = '#fff';

    @action
    initRefs(that) {
        this.videoRef = that.videoRef;
        this.canvasRef = that.canvasRef;
    }

    @action
    setScreens() {
        desktopCapturer.getSources({ types:['window', 'screen'] }, (error, sources) => {
            if (error) throw error;
            
            this.screens = sources.map(it => ({
                text: it.name,
                id: it.id
            }));
        });
    }

    @action.bound
    changeActiveScreen(e, data) {
        const {
            name: text,
            id
        } = data;

        this.activeScreen = { text, id };

        this.captureScreen();
    }

    @action
    captureScreen() {
        const {
            activeScreen,

        } = this;

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

    @action
    handleStream(stream) {
        const video = this.videoRef.current;

        video.srcObject = stream;

        video.onloadedmetadata = (e) => {
            video.play();
            this.takeImg();
        }
    }

    @action
    takeImg = () => {
        const canvas = this.canvasRef.current;
        const video = this.videoRef.current;
        
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, this.width, this.height);
        
        const data = canvas.toDataURL('image/png');

        this.imgDownloadHref = data;
    }

    @action.bound
    downoadImg() {
        const canvas = this.canvasRef.current;
        const data = canvas.toDataURL('image/png');

        this.imgDownloadHref = data;
    }

    @action.bound
    handleMouseMove(e) {
        const {
            color,
            lineWidth
        } = this;

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