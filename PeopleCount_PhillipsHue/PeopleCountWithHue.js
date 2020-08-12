import xapi from 'xapi';

// Update for your Hue deployment
const BRIDGE_IP = '192.168.2.1'
const BRIDGE_USER = 'XXXXXXXXXXXXXXXXXXX' //insert here your Hue user token
const LIGHT_ID = 1 // number of your Bulb as registered at your Hue Bridge


const COLOR_RED = 65535
const COLOR_BLUE = 46920
const COLOR_GREEN = 25500
const COLOR_STANDBY = 39998
const COLOR_TWO = 54380
const COLOR_THREE = 62108
const COLOR_FOUR = 57460
const COLOR_FIVE = 35055

function changeColorForLight(light, color) {
  console.debug(`changeColor: ${color} ForLight: ${light}`)
  updateLight(BRIDGE_IP, BRIDGE_USER, light, { "hue": color,"sat":255 }, console.log)
}

function toggleLight(light, bool) {
  console.debug(`toggleLight: ${light} to: ${bool}`)
  updateLight(BRIDGE_IP, BRIDGE_USER, light, { "on": bool,"sat":255 }, console.log) 
}

function updateLight(bridgeip, username, light, payload, cb) {
  console.debug('updateLight: pushing payload')
  console.debug(`bridgeip: ${bridgeip} light: ${light} payload: ${JSON.stringify(payload)}`)

  // Post message
  xapi.command(
    'HttpClient Put',
    {
      Header: ["Content-Type: application/json"],
      Url: `http://${bridgeip}/api/${username}/lights/${light}/state`
    },
    
    JSON.stringify(payload))

    .then((response) => {
      if (response.StatusCode == 200) {
        console.log("message pushed to bridge")
        if (cb) cb(null, response.StatusCode)
        return
      }

      console.warn("updateLight: request failed with status code: " + response.StatusCode)
      if (cb) cb("failed with status code: " + response.StatusCode, response.StatusCode)
    })
    .catch((err) => {
      console.error("updateLight: failed with err: " + err.message)
      if (cb) cb("Could not contact the bridge")
    })
}
function GoToVerifyToggleOn (Value) {
  console.log('Value of the number of peopel: ', Value)
  if (Value=='on') {
  CheckAndSetColorBasedOnNymberOfPeopel();
  console.log('Executing change of the color');
  }
 
}

function onInroomEvent(event) {
console.log('In-room event occured', event);
//VERY IMPORTANT HERE
//Please, double check the correct Widget number, as it can be shuffeled
//Command CLI: xstatus UserInterface Extensions Widget WidgetId
xapi.status.get('UserInterface Extensions Widget 1 Value').then(GoToVerifyToggleOn);
}

function CheckAndSetColorBasedOnNymberOfPeopel () {
  var People = xapi.status.get('RoomAnalytics PeopleCount');
  People.then(function(result){
    console.log("Below is the Current result of the number of people detected:")
    console.log(result.Current)
    switch(result.Current){
      case '-1':
        console.debug("-1");
        toggleLight(LIGHT_ID, true)
        changeColorForLight(LIGHT_ID, COLOR_STANDBY)
        break;
      case '0':
        console.debug("0");
        toggleLight(LIGHT_ID, true)
        changeColorForLight(LIGHT_ID, COLOR_BLUE)
        xapi.config.set('UserInterface CustomMessage', "Note: No people in this room detected ");
        break;
      case '1':
        console.debug("1");
        toggleLight(LIGHT_ID, true)
        changeColorForLight(LIGHT_ID, COLOR_GREEN)
        xapi.config.set('UserInterface CustomMessage', "Note: 1 person in this room ");
        break;
      case '2':
        console.debug("2");
        toggleLight(LIGHT_ID, true)
        changeColorForLight(LIGHT_ID, COLOR_TWO)
        xapi.config.set('UserInterface CustomMessage', "Note: 2 persons in this room ");
        break;
      case '3':
          console.debug("3");
          toggleLight(LIGHT_ID, true)
          changeColorForLight(LIGHT_ID, COLOR_THREE)
          xapi.config.set('UserInterface CustomMessage', "Note: 3 people in this room ");
          break;
      case '4':
          console.debug("4");
          toggleLight(LIGHT_ID, true)
          changeColorForLight(LIGHT_ID, COLOR_FOUR)
          xapi.config.set('UserInterface CustomMessage', "Note: 4 people in this room ");
          break;
      case '5':
          console.debug("5");
          toggleLight(LIGHT_ID, true)
          changeColorForLight(LIGHT_ID, COLOR_FIVE)
          xapi.config.set('UserInterface CustomMessage', "Note: 5 people in this room ");
          break;
      case '6':
          console.debug("6");
          toggleLight(LIGHT_ID, true)
          changeColorForLight(LIGHT_ID, COLOR_RED)
          xapi.config.set('UserInterface CustomMessage', "WARNING: Too many people in this huddle room! Get out!  Get out :) ");
          break;
    }
  })
}

xapi.status.on('RoomAnalytics PeopleCount Current', onInroomEvent)

xapi.event.on('UserInterface Extensions Widget Action', (action) => {
  console.log(`new event from group: ${action.WidgetId}`);
  console.log(action);

  if ((action.WidgetId === 'people_count_activate') && (action.Value === 'on')) {
    console.info(`running check on the number of people as well`);
    CheckAndSetColorBasedOnNymberOfPeopel()}
  if ((action.WidgetId === 'people_count_activate') && (action.Value === 'off')) {
    console.info(`Turning the light off`);
    toggleLight(LIGHT_ID, false)}
    xapi.config.set('UserInterface CustomMessage', " ");
  })
