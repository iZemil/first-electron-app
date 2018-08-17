const {app, BrowserWindow} = require('electron');

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600})
  
    // и загрузит index.html приложение.
    win.loadFile('./public/index.html')
}
  
app.on('ready', createWindow)