//const myFunction = require('addSat');
  //import{finDat} from "../catalogBuild.js"
  window.CESIUM_BASE_URL = '../node_modules/cesium';
  require('../node_modules/cesium/CesiumUnminified/Cesium.js');
  require('../node_modules/cesium/Cesium/Widgets/widgets.css');
  var Cesium = window.Cesium;

  //const Cesium = require("../node_modules/cesium/Source/Cesium.js");
  satellite = require('satellite.js');
  //console.log(finDat);
  var sample = require("./addSat.js");

    // Initialize the Cesium viewer.B:\Space-Trash\node_modules\cesium\Source\Cesium.js
    const viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl("../node_modules/cesium/Build/Cesium/Assets/Textures/NaturalEarthII"),
      }),
      baseLayerPicker: false, geocoder: false, homeButton: false, infoBox: false,
      navigationHelpButton: false, sceneModePicker: false
    });
    viewer.scene.globe.enableLighting = true;
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
    
    
    const TLEs = [
      "1 25544U 98067A   21275.52277778  .00006056  00000-0  11838-3 0  9993 \n2 25544  51.6451 172.0044 0004138  50.9000 316.9051 15.48905523305232",
      "1 43556U 18046C   21275.50447154  .00005947  00000-0  19779-3 0  9990 \n2 43556  51.6410 353.2863 0007286 185.4130 174.6774 15.32550473179690",
      "1 43557U 18046D   21274.86157532  .00006681  00000-0  22555-3 0  9999 \n2 43557  51.6411 358.7000 0007508 181.2634 178.8329 15.31852388179517",
    ];

    //FUNCTION CALL

    for (var x of TLEs){
      addSatellite(x, viewer, false);
    }

    // addSat.addSat(TLEs[0], viewer);

    

    //const ISS_TLE = 
    //`1 25544U 98067A   21121.52590485  .00001448  00000-0  34473-4 0  9997
    //2 25544  51.6435 213.5204 0002719 305.2287 173.7124 15.48967392281368`;

    //addsat(ISS_TLE, viewer, true);

    //var fnAction = addSat(ISS_TLE, viewer, true);
    //fnAction;
    
    // This causes a bug on android, see: https://github.com/CesiumGS/cesium/issues/7871
    // viewer.scene.globe.enableLighting = true;
    // These 2 lines are published by NORAD and allow us to predict where
    // the ISS is at any given moment. They are regularly updated.
    // Get the latest from: https://celestrak.com/satcat/tle.php?CATNR=25544. 
    
    const ISS_TLE = 
    `1 25544U 98067A   21121.52590485  .00001448  00000-0  34473-4 0  9997
    2 25544  51.6435 213.5204 0002719 305.2287 173.7124 15.48967392281368`;
    const satrec = satellite.twoline2satrec(
      ISS_TLE.split('\n')[0].trim(), 
      ISS_TLE.split('\n')[1].trim()
    );
    //HERE DOWN: Change to a function that we call for each TLE object, take TLE parsed text as a parameter

    const positionsOverTime = new Cesium.SampledPositionProperty();
    for (let i = 0; i < totalSeconds; i+= timestepInSeconds) {
      const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
      const jsDate = Cesium.JulianDate.toDate(time);

      const positionAndVelocity = satellite.propagate(satrec, jsDate);
      const gmst = satellite.gstime(jsDate);
      const p   = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

      const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
      positionsOverTime.addSample(time, position);
    }
    

    // Visualize the satellite with a red dot.
    const satellitePoint = viewer.entities.add({
      position: positionsOverTime,
      point: { pixelSize: 5, color: Cesium.Color.BLUE }
    });


    // Set the camera to follow the satellite 
    viewer.trackedEntity = satellitePoint;

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
  


viewer.toggle


function addSatellite(tle, viewer, track){
  const satrec = satellite.twoline2satrec(
    tle.split('\n')[0].trim(), 
    tle.split('\n')[1].trim()
  );

  const positionsOverTime = new Cesium.SampledPositionProperty();
  for (let i = 0; i < totalSeconds; i+= timestepInSeconds) {
    const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
    const jsDate = Cesium.JulianDate.toDate(time);

    const positionAndVelocity = satellite.propagate(satrec, jsDate);
    const gmst = satellite.gstime(jsDate);
    const p   = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

    const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
    positionsOverTime.addSample(time, position);
  }

  const satellitePoint = viewer.entities.add({
    position: positionsOverTime,
    point: { pixelSize: 5, color: Cesium.Color.BLUE }
  });

if(track) viewer.trackedEntity = satellitePoint;
  }


function toggle(){
  // viewer.toggle
  //entities.
  //gethtmlelement button
  //change entitie.show = entitie.show
  //Will need to define unique IDs for each 
  //id = index for each entity
  //isShowing = false or = true;
}
/*
function addSatellite(String tle, Cesium.Viewer viewer){
  addSat(tle, viewer, false);
}
*/
