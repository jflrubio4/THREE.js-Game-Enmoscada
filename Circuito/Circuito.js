import * as THREE from '../libs/three.module.js'
 
class Circuito extends THREE.Object3D {
  constructor() {
    super();
    
    var path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-200, -35, 100),
      new THREE.Vector3(-250, 0, -20),
      new THREE.Vector3(-125, 100, 20),
      new THREE.Vector3(0, 50, 35),
      new THREE.Vector3(50, 70, -25),
      new THREE.Vector3(100, -50, 10),
      new THREE.Vector3(-50, 0, 100),
      new THREE.Vector3(0, 75, 150),
      new THREE.Vector3(125, 50, 125),
      new THREE.Vector3(-25, 0, 0),
      new THREE.Vector3(-100, 150, -75),
      new THREE.Vector3(-150, 150, 50),
      new THREE.Vector3(-175, 50, 100),
      new THREE.Vector3(-100, 0, 150),
      new THREE.Vector3(-150, -50, 200)
      
      //NO SE REPITE EL PRIMER PUNTO.
    ],true);

    var tubeGeometry = new THREE.TubeGeometry(path, 400, 8, 8, true);
    var mat = new THREE.MeshNormalMaterial();

    var tubo = new THREE.Mesh(tubeGeometry, mat);
    this.add(tubo);

    //GUARDAMOS LOS PARÁMETROS DEL TUBO
    this.tubo = tubeGeometry;
    this.path = tubeGeometry.parameters.path;
    this.radio = tubeGeometry.parameters.radius;
    this.segmentos = tubeGeometry.parameters.tubularSegments;

    // var esfera = new THREE.SphereGeometry(10, 32, 32);
    // var esfera1 = new THREE.Mesh(esfera, mat);

    // esfera1.position.set(-50, 0, 100);
    // this.add(esfera1); 

    /* this.rotar = false; */
  }

  setRotacion(value){
    if (value){
        this.rotar = true;
    }
    else{
        this.rotar = false;
    }
  }

  getGeometry(){
    return this.tubo;
  }

  
  update () {}
}

export { Circuito };