import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
 
class Enigma extends THREE.Object3D {
  constructor() {
    super();

    this.nombre = 'Enigma';
    
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

    var tubeGeometry = new THREE.TubeGeometry(path, 12, 0.2, 12, false);
    var tapaGeometry = new THREE.CylinderGeometry(0.2,0.2,0.01);
    tapaGeometry.translate(0,0.005,0);
    var mat = new THREE.MeshStandardMaterial({
      color: 0xFFA500, // Color dorado
      metalness: 0.9, // Alto valor para que parezca metálico
      roughness: 0.2, // Bajo valor para que sea suave y reflectante
    });

    var sphereGeom = new THREE.SphereGeometry(0.2, 8, 8);
    sphereGeom.translate(0,-0.3,0);

    var tapa1 = new THREE.Mesh(tapaGeometry, mat);
    var tapa2 = new THREE.Mesh(tapaGeometry, mat);
    tapa2.position.y = 1;
    tapa2.position.x = -0.25;

    var punto = new THREE.Mesh(sphereGeom, mat);
    var interrog = new THREE.Mesh(tubeGeometry, mat);

    // Crear la geometría de la caja
    var cajaGeometry = new THREE.BoxGeometry(1.415, 2.3, 0.5); // Ajusta las dimensiones según tus necesidades
    cajaGeometry.translate(0.23,0.65,0);
    // Crear un material transparente
    var cajaMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000, // El color no importa ya que la caja será transparente
      transparent: true,
      opacity: 0.0 // Hacer la caja completamente transparente
    });

    // Crear la caja
    var caja = new THREE.Mesh(cajaGeometry, cajaMaterial);
    
    this.enigma = new THREE.Group();
    this.enigma.add(punto);
    this.enigma.add(interrog);
    this.enigma.add(tapa1);
    this.enigma.add(tapa2);
    this.enigma.add(caja);

    this.enigma.rotateY(-Math.PI);
    this.enigma.position.y = 0.3 + 0.7;
    this.enigma.scale.set(2,2,2);
    this.add(this.enigma);


    this.enigma.userData.name = 'enigma';
  }
  
  update () {}
}

export { Enigma };