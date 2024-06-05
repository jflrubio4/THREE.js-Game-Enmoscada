import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Enigma } from '../Enigma/Enigma.js';
 
class MoscaEnigma extends THREE.Object3D {
  constructor() {
    super();
    
    this.nombre = 'Mosca Enigma';

    //VALORES PARA LAS ROTACIONES.
    this.topeAlaI = false;
    this.topeAlaD = false;
    this.rotar = true;
    
    //DEFINIMOS LE MATERIAL.
    var materialAlas = new THREE.MeshPhysicalMaterial({
      color: 0xcccccc, // Color gris claro
      roughness: 0.2, // Un poco rugoso para darle un toque natural
      metalness: 0.1, // Un toque de metalicidad para el brillo sutil
      transmission: 0.9, // Alta transmisión para transparencia
      opacity: 0.75, // Transparencia moderada
      transparent: true, // Permitir transparencia
      thickness: 0.01, // Grosor del material muy delgado
      clearcoat: 0.5, // Añadir una capa de recubrimiento transparente
      clearcoatRoughness: 0.1, // Un poco de rugosidad en la capa de recubrimiento
      reflectivity: 0.5, // Reflejos sutiles
      attenuationDistance: 1.0, // Distancia de atenuación de la luz
      attenuationColor: new THREE.Color(0xaaaaaa) // Color de atenuación gris claro
    });

    var mat = new THREE.MeshPhysicalMaterial({
      color: 0xFFA500,
      roughness: 0.5,
      map: new THREE.TextureLoader().load('../../imgs/textura-ajedrezada.jpg'),
      metalness: 0.5
    });

    //CUERPO MOSCA
    var cuerpoGeom = new THREE.SphereGeometry(0.7, 8, 8);
    var cuerpo = new THREE.Mesh(cuerpoGeom, mat);

    //ALAS
    var shape = new THREE.Shape();
    //shape.lineTo(-1,1);
    shape.moveTo(0,0);
    shape.quadraticCurveTo(-1,0.75, -1.5,0.5);
    shape.quadraticCurveTo(-2.5,0, -1.5,-0.5);
    //shape.lineTo(0,0)
    shape.quadraticCurveTo(-1,-0.75, 0,0);

    var options = {
      depth: 0.2, 
      steps: 2, 
      curveSegments: 8, 
      bevelSegments: 6,
      bevelThickness: 0.25,
      bevelSize: 0.6,
      bevelEnabled: false
    };

    var alaIGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaIGeometry.scale(0.75,0.75,0.75);
    alaIGeometry.translate(-0.55,0,-0.05);
    this.alaI = new THREE.Mesh(alaIGeometry, materialAlas);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.75,0.75,0.75);
    alaDGeometry.translate(-0.55,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, materialAlas);

    //Enigma
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
    var matEnigma = new THREE.MeshStandardMaterial({
      color: 0xFFA500, // Color dorado
      metalness: 0.9, // Alto valor para que parezca metálico
      roughness: 0.2, // Bajo valor para que sea suave y reflectante
    });

    var sphereGeom = new THREE.SphereGeometry(0.2, 8, 8);
    sphereGeom.translate(0,-0.3,0);

    var tapa1 = new THREE.Mesh(tapaGeometry, matEnigma);
    var tapa2 = new THREE.Mesh(tapaGeometry, matEnigma);
    tapa2.position.y = 1;
    tapa2.position.x = -0.25;

    var punto = new THREE.Mesh(sphereGeom, matEnigma);
    var interrog = new THREE.Mesh(tubeGeometry, matEnigma);

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

    this.enigma.position.set(0,1.1,0);
    this.enigma.scale.set(0.5,0.5,0.5);

    var mosca = new THREE.Group();
    mosca.add(cuerpo);
    mosca.add(this.alaI);
    mosca.add(this.alaD);
    mosca.add(this.enigma);
    mosca.position.set(0,0.7,0);
    mosca.rotation.set(0,Math.PI,0);
    this.add(mosca);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(mosca);

    mosca.userData.name = 'moscaEnigma';
    
  }

  setRotacion(value){
    if (value){
        this.rotar = true;
    }
    else{
        this.rotar = false;
    }
  }

  funcionAnimar(){
    if(this.alaI.rotation.y < 0.2 && !this.topeAlaI){
      this.alaI.rotation.y += 0.015;
      if(this.alaI.rotation.y >= 0.2){
        this.topeAlaI = true;
      }
    }
    else{
      this.alaI.rotation.y -= 0.015;
      if(this.alaI.rotation.y <= -0.2){
        this.topeAlaI = false;
      }
    }

    if(this.alaD.rotation.y > -0.2 && !this.topeAlaD){
      this.alaD.rotation.y -= 0.015;
      if(this.alaD.rotation.y <= -0.2){
        this.topeAlaD = true;
      }
    }
    else{
      this.alaD.rotation.y += 0.015;
      if(this.alaD.rotation.y >= 0.2){
        this.topeAlaD = false;
      }
    }
  }
  
  update () {
    this.funcionAnimar();
    
  }
}

export { MoscaEnigma };