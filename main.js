const electron = require('electron');
const {app, BrowserWindow, ipcMain} = require('electron');

function createWindow () {
    // let mousePos = electron.screen.getCursorScreenPoint();
    // console.log(mousePos);

    // Create the browser window.
    win = new BrowserWindow({width: 1024, height: 800});
    // win.setMenu(null);
    // win.webContents.on('context-menu', (event) => {
    //     console.log('context-menu')
    // });
    ipcMain.on('check', (event, {width, height}) => {
        const mainScreen = electron.screen.getPrimaryDisplay();
        console.log(mainScreen);

        win.setSize(400, 100);
        win.setPosition(0, mainScreen.size.height);

        // setTimeout(() => event.sender.send('takeImg'), 500);
        event.sender.send('takeImg');
    })

    win.loadFile('./public/index.html');
    // win.webContents.openDevTools();
}
  
app.on('ready', createWindow);
