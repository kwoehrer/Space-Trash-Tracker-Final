//Was missing () after myfunction
function myFunction(){
  console.log("We did it");
}
const satellite = require("satellite.js")
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

//Double declaration of function name here lead to an error
//function addSatellite(String tle, Cesium.Viewer viewer){
  //addSat(tle, viewer, false);
//}