var loaded = false;

// Initialize the Cesium viewer.
const viewer = new Cesium.Viewer('cesiumContainer', {
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
    url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
  }),
  baseLayerPicker: false, geocoder: false, homeButton: true, infoBox: true,
  navigationHelpButton: true, sceneModePicker: false
});
// This causes a bug on android, see: https://github.com/CesiumGS/cesium/issues/7871
// viewer.scene.globe.enableLighting = true;

// We're going to generate a position every 10 seconds from now until 60*60*60 seconds from now. 
// Set up the clock widget on cesium
const totalSeconds = 60 * 60 * 6;
const timestepInSeconds = 10;
const start = Cesium.JulianDate.fromDate(new Date());
const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.timeline.zoomTo(start, stop);
viewer.clock.multiplier = 40;
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

// Wait for globe to load then zoom out     
let initialized = false;
viewer.scene.globe.tileLoadProgressEvent.addEventListener(() => {
  if (!initialized && viewer.scene.globe.tilesLoaded === true) {
    viewer.clock.shouldAnimate = true;
    initialized = true;
    viewer.scene.camera.zoomOut(7000000);
    //Code below is for use in loading bar
    document.getElementById("loading").style.display = "none";
    document.getElementById("objCount").innerHTML = objCount.toString();
  }
});


// Debris json is collected from a query against celestrak database. We parse relevant data with the JSON Parser and then store that as a parsedTLEList. That list is then utilized here as an array of srings.
let dataFile = require('./parsedTLEList.json');
// Set an array equal to datafile, this step is technically not needed but done for making the code cleaner.
let arrTLE = dataFile;
let objCount = 0;

//This code pushes ALL parsed objects
for(let i = 0; i < arrTLE.length; i++){
  addSatellite(viewer,arrTLE[i],false,i);
  objCount = i;
}

/**
 * This function adds the space debris or satellite to earths orbit.
 * Give SatelliteJS the TLE's and a specific time.
 * Get back a longitude, latitude, height (km).
 * Then create cesium entity
 * @param {cesium viewer instance} viewer 
 * @param {tle file string} tle 
 * @param {boolean} track 
 */
function addSatellite(viewer, tle, track,i){
  //Trim name to match actual satellite name
  var satName = tle.split('\n')[0].trim().substring(2);
  
  
  //Remove Debris so we dont double up
  if(satName.endsWith("DEB")){
    satName = satName.substring(0,satName.length-3)
  }
  
  satName += "          Object Type: " + tle.split('\n')[1].trim();

  const id = i;

  const satrec = satellite.twoline2satrec(
  tle.split('\n')[2].trim(),
  tle.split('\n')[3].trim()
  );

  var color;


//This if/else branch turns international space station white, any debris or broken satellites red, and active satellites yellow
  if(tle.includes("ZARYA")){
    color = Cesium.Color.WHITE;
    }
  else{
    if(tle.includes("DEB")||tle.includes("R/B")) color = Cesium.Color.RED;
    else color = Cesium.Color.LIME;
    }


//Update positions so cesium knows what position to display when
  const positionsOverTime = new Cesium.SampledPositionProperty();
  for (let i = 0; i < totalSeconds; i += timestepInSeconds) {
    const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
    const jsDate = Cesium.JulianDate.toDate(time);

    const positionAndVelocity = satellite.propagate(satrec, jsDate);
    const gmst = satellite.gstime(jsDate);
    const p = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

    const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
    positionsOverTime.addSample(time, position);
  }


  //Tried displaying orbital paths but leads to lag on view model
  //Tried displaying labels (names of satellites) directly on screen but lead too much clutter, used cesium UI to access names instead
  const satellitePoint = viewer.entities.add({
    position: positionsOverTime,
    point: { pixelSize: 5, color: color },
    name: satName,
    id:i,

  });

  // Set the camera to follow the satellite 
  if(track) viewer.trackedEntity = satellitePoint;
}