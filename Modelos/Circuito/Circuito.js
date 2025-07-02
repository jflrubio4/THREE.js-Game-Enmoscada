import * as THREE from '../libs/three.module.js'
 
class Circuito extends THREE.Object3D {
  constructor() {
    super();

    // var cielo = new THREE.SphereGeometry(1000, 8, 8);

    var loader = new THREE.TextureLoader();
    var texture = loader.load('../../imgs/cesped.jpg');
    // var textureCielo = loader.load('../../imgs/cielo.png');

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 1); // ajusta estos valores para cambiar la repetición de la textura

    var mat = new THREE.MeshPhysicalMaterial({
      color: 0x05f70d,
      //roughness: 0.5,
      map: texture,
      //metalness: 0.5
    });

    /* textureCielo.wrapS = THREE.RepeatWrapping;
    textureCielo.wrapT = THREE.RepeatWrapping;
    textureCielo.repeat.set(1, 1); // ajusta estos valores para cambiar la repetición de la textura */


    /* var materialCielo = new THREE.MeshBasicMaterial({
      map: textureCielo,
      side: THREE.DoubleSide
    }); */

    //var cieloMesh = new THREE.Mesh(cielo, materialCielo);
    
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
    //var mat = new THREE.MeshNormalMaterial();

    var tubo = new THREE.Mesh(tubeGeometry, mat);
    this.add(tubo);

    //GUARDAMOS LOS PARÁMETROS DEL TUBO
    this.tubo = tubeGeometry;
    this.path = tubeGeometry.parameters.path;
    this.radio = tubeGeometry.parameters.radius;
    this.segmentos = tubeGeometry.parameters.tubularSegments;

    //this.add(cieloMesh);

    // var esfera = new THREE.SphereGeometry(10, 32, 32);
    // var esfera1 = new THREE.Mesh(esfera, mat);

    // esfera1.position.set(-50, 0, 100);
    // this.add(esfera1); 

    /* this.rotar = false; */
  }

  getGeometry(){
    return this.tubo;
  }

  
  update () {}
}

export { Circuito };