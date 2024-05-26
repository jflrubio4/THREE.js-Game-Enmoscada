import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
 
class Enigma extends THREE.Object3D {
  constructor(gui,titleGui, resolucion) {
    super();
  
    
    var path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0.25, 0.5, 0),
      new THREE.Vector3(0.6, 0.65, 0),
      new THREE.Vector3(0.75, 1, 0),
      new THREE.Vector3(0.6, 1.35, 0),
      new THREE.Vector3(0.25, 1.5, 0),
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(-0.25, 1.35, 0),
      new THREE.Vector3(-0.25, 1, 0)
    ],false);

    var tubeGeometry = new THREE.TubeGeometry(path, resolucion, 0.2, resolucion, false);
    var tapaGeometry = new THREE.CylinderGeometry(0.2,0.2,0.01);
    tapaGeometry.translate(0,0.005,0);
    var mat = new THREE.MeshStandardMaterial({
      color: 0xFFA500, // Color dorado
      metalness: 0.9, // Alto valor para que parezca metálico
      roughness: 0.2, // Bajo valor para que sea suave y reflectante
    });

    var sphereGeom = new THREE.SphereGeometry(0.2);
    sphereGeom.translate(0,-0.3,0);

    var tapa1 = new THREE.Mesh(tapaGeometry, mat);
    var tapa2 = new THREE.Mesh(tapaGeometry, mat);
    tapa2.position.y = 1;
    tapa2.position.x = -0.25;

    var punto = new THREE.Mesh(sphereGeom, mat);
    var interrog = new THREE.Mesh(tubeGeometry, mat);

    this.enigma = new THREE.Group();
    this.enigma.add(punto);
    this.enigma.add(interrog);
    this.enigma.add(tapa1);
    this.enigma.add(tapa2);

    this.enigma.position.y = 0.3;
    this.enigma.rotation.y = Math.PI/2;
    this.add(this.enigma);
  }
  
  update() {}
}

export { Enigma };