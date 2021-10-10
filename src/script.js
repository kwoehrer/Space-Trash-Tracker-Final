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

// Debris json is collected from a query against celestrak database. We should contact them for a better optimized query to remove irrelavent information. It will speed up runtime.
let dataFile = require('./debris.json');
// Name Array in case we want to add label functionality per event click on entity
let satNamArr =[];

//This code pushes the first 7000 objects on the json to the visualizer. From our query we could access more but loading time stalls out at 7000+.
for(let i = 0; i < 7000; i++){
  var json = JSON.stringify(dataFile[i]);
  var totalTLE = JSON.parse(json).TLE_LINE0 + "\n"+ JSON.parse(json).TLE_LINE1 + "\n" + JSON.parse(json).TLE_LINE2;
  addSatellite(viewer,totalTLE,false,i);
}

// Wait for globe to load then zoom out     
let initialized = false;
viewer.scene.globe.tileLoadProgressEvent.addEventListener(() => {
  if (!initialized && viewer.scene.globe.tilesLoaded === true) {
    viewer.clock.shouldAnimate = true;
    initialized = true;
    viewer.scene.camera.zoomOut(7000000);
    //Code below is for use in loading bar
    document.getElementById("loading").style.display = "none";
  }
});

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
  //Change deb to debris
  if(satName.endsWith("DEB")){
    satName = satName + "RIS";
  }



  const id = i;

  satNamArr.push[satName];

  const satrec = satellite.twoline2satrec(
  tle.split('\n')[1].trim(),
  tle.split('\n')[2].trim()
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