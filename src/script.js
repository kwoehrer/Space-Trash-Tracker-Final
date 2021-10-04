// Initialize the Cesium viewer.
const viewer = new Cesium.Viewer('cesiumContainer', {
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
    url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
  }),
  baseLayerPicker: false, geocoder: false, homeButton: false, infoBox: false,
  navigationHelpButton: false, sceneModePicker: false
});
// This causes a bug on android, see: https://github.com/CesiumGS/cesium/issues/7871
// viewer.scene.globe.enableLighting = true;

// Give SatelliteJS the TLE's and a specific time.
// Get back a longitude, latitude, height (km).
// We're going to generate a position every 10 seconds from now until 6 seconds from now. 
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



let dataFile = require('./debris.json');

var tleArr = [];
var tleArr1 = [];
//This code pushes the first 3000 objects on the json to the visualizer. From our query we could access more but loading time stalls out at 3000+.
for(let i = 0; i < 3000; i++){
  tleArr1.push(JSON.stringify(dataFile[i]));
}

for(let i = 0; i < 3000; i++){
  var totalTLE = JSON.parse(tleArr1[i]).TLE_LINE0 + "\n"+ JSON.parse(tleArr1[i]).TLE_LINE1 + "\n" + JSON.parse(tleArr1[i]).TLE_LINE2;
  addSatellite(viewer,totalTLE,false);
  tleArr.push(totalTLE);
}

//tleArr.forEach(element => addSatellite(viewer, element, false));


// Wait for globe to load then zoom out     
let initialized = false;
viewer.scene.globe.tileLoadProgressEvent.addEventListener(() => {
  if (!initialized && viewer.scene.globe.tilesLoaded === true) {
    viewer.clock.shouldAnimate = true;
    initialized = true;
    viewer.scene.camera.zoomOut(7000000);
    document.querySelector("#loading").classList.toggle('disappear', true)
  }
});


/**
 * This function adds the space debris or satellite to earths orbit
 * @param {cesium viewer instance} viewer 
 * @param {tle file string} tle 
 * @param {boolean} track 
 */
function addSatellite(viewer, tle, track){
  const satrec = satellite.twoline2satrec(
  tle.split('\n')[1].trim(),
  tle.split('\n')[2].trim()
  );

  var color;


//This if/else branch turns international space station white, any debris or broken satellites red, and active satellites yellow
  if(tle.includes("ZARYA")){
    color = Cesium.Color.WHITE;
    track = true;
    }
  else{
    if(tle.includes("DEB")||tle.includes("R/B")) color = Cesium.Color.RED;
    else color = Cesium.Color.YELLOW;
    }


//Update positions
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

  const satellitePoint = viewer.entities.add({
    position: positionsOverTime,
    point: { pixelSize: 5, color: color }
  });

  // Set the camera to follow the satellite 
  if(track) viewer.trackedEntity = satellitePoint;
}