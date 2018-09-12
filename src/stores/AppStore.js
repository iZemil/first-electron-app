import {observable, action, computed} from 'mobx';
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
        this.ctx = that.canvasRef.current.getContext('2d');
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
        const video = this.videoRef.current;
        
        this.ctx.drawImage(video, 0, 0, this.width, this.height);

        this.imgDownloadHref = this.canvasRef.current.toDataURL('image/png');
    }

    @action.bound
    downoadImg() {
        const canvas = this.canvasRef.current;
        const data = canvas.toDataURL('image/png');

        this.imgDownloadHref = data;
    }

    @action.bound
    handleMouseMove(e) {
        if (e.buttons !== 1) return;
        
        this.doPencil(e);
    }

    @action.bound
    handleMouseDown(e) {
        console.log('handleMouseDown');
    }

    @action.bound
    handleMouseUp(e) {
        console.log('handleMouseUp');
    }

    @action.bound
    handleMouseOut(e) {
        console.log('handleMouseOut');
    }

    getCurPos(e) {
        const { top, left } = this.canvasRef.current.getBoundingClientRect();

        return [
            e.clientX - left,
            e.clientY - top
        ];
    }

    doPencil(e) {
        const {
            color,
            lineWidth,
            ctx
        } = this;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round'; // "butt" || "round" || "square"

        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;

        ctx.moveTo(...this.getCurPos(e));
        ctx.lineTo(...this.getCurPos(e));

        ctx.stroke();
    }

    doRect(e) {

    }

    doLine(e) {

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