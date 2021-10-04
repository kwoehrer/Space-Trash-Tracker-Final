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



//const { default: Color } = require('cesium/Source/Core/Color');
let dataFile = require('./debris.json');
let satNamArr =[]

//This code pushes the first 3000 objects on the json to the visualizer. From our query we could access more but loading time stalls out at 3000+.
for(let i = 0; i < 2000; i++){
  var json = JSON.stringify(dataFile[i]);
  var totalTLE = JSON.parse(json).TLE_LINE0 + "\n"+ JSON.parse(json).TLE_LINE1 + "\n" + JSON.parse(json).TLE_LINE2;
  addSatellite(viewer,totalTLE,false,i);
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
function addSatellite(viewer, tle, track,i){
  const satName = tle.split('\n')[0].trim();
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
    else color = Cesium.Color.GREEN;
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

  const satellitePoint = viewer.entities.add({
    position: positionsOverTime,
    point: { pixelSize: 5, color: color },
    name: satName,
    id: i,

    label : {
      text : satName,
        font : '6pt monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth : 2,
        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
    }

  });

  // Set the camera to follow the satellite 
  if(track) viewer.trackedEntity = satellitePoint;
}

const clickHandler = new Cesium.ScreenSpaceEventHandler('cesiumContainer');
clickHandler.handler.setInputAction(function (movement) {
  var pick = widget.scene.pick(movement.position);
  if (Cesium.defined(pick) && (pick.id.match(/label_([0-9]+)/))) {
      var id = parseInt(RegExp.$1);
      var point = constant.points[id];
      widget.infoBox.viewModel.titleText = point.label;
      widget.infoBox.viewModel.descriptionRawHtml = point.description;
      widget.infoBox.viewModel.showInfo = true;
      widget.infoBox.viewModel.closeClicked.addEventListener(function() {widget.infoBox.viewModel.showInfo = false;});
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//Search bar

/**
 * Returns the top-most entity at the provided window coordinates
 * or undefined if no entity is at that location.
 *
 * @param {Cartesian2} windowPosition The window coordinates.
 * @returns {Entity} The picked entity or undefined.
 */
 function pickEntity(viewer, windowPosition) {
  var picked = viewer.scene.pick(windowPosition);
  if (defined(picked)) {
    var id = Cesium.defaultValue(picked.id, picked.primitive.id);
    if (id instanceof Cesium.Entity) {
      return id;
    }
  }
  return undefined;
};

/**
 * Returns the list of entities at the provided window coordinates.
 * The entities are sorted front to back by their visual order.
 *
 * @param {Cartesian2} windowPosition The window coordinates.
 * @returns {Entity[]} The picked entities or undefined.
 */
function drillPickEntities(viewer, windowPosition) {
  var i;
  var entity;
  var picked;
  var pickedPrimitives = viewer.scene.drillPick(windowPosition);
  var length = pickedPrimitives.length;
  var result = [];
  var hash = {};

  for (i = 0; i < length; i++) {
    picked = pickedPrimitives[i];
    entity = Cesium.defaultValue(picked.id, picked.primitive.id);
    if (entity instanceof Cesium.Entity &&
        !Cesium.defined(hash[entity.id])) {
      result.push(entity);
      hash[entity.id] = true;
    }
  }
  return result;
};