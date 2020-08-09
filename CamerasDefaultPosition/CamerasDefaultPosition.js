const xapi = require('xapi');

function handleError(error) {
console.log('Error', error);
}


xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
  console.log(event.PanelId);
    if(event.PanelId == 'TopLeft'){
         xapi.command("Camera PositionSet", {CameraId:1,Zoom:8000,Pan: 7963,Tilt:1785,Focus:4241}).catch(handleError);
         xapi.command("Camera PositionSet", {CameraId:2,Zoom:8000,Pan: 7963,Tilt:1785,Focus:4241}).catch(handleError);
         xapi.command("Camera PositionSet", {CameraId:3,Zoom:8000,Pan: 7963,Tilt:1785,Focus:4241}).catch(handleError);
    }
});

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
  console.log(event.PanelId);
    if(event.PanelId == 'BottomRight'){
         xapi.command("Camera PositionSet", {CameraId:1, Zoom:8000,Pan:-9471,Tilt:-876,Focus:4240}).catch(handleError);
         xapi.command("Camera PositionSet", {CameraId:2, Zoom:8000,Pan:-9471,Tilt:-876,Focus:4240}).catch(handleError);
         xapi.command("Camera PositionSet", {CameraId:3, Zoom:8000,Pan:-9471,Tilt:-876,Focus:4240}).catch(handleError);
    }
});