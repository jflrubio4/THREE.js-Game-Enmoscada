import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class MoscaAgresiva extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
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
      color: 0xff0000,
      roughness: 0.5,
      metalness: 0.2
    });

    var matCejas = new THREE.MeshPhysicalMaterial({
      color: 0x222222,
      roughness: 0.5,
      metalness: 0.1,
      map: new THREE.TextureLoader().load('../../imgs/pelaje.jpg')
    });

    //CUERPO MOSCA
    var cuerpoGeom = new THREE.SphereGeometry(0.65, 32, 32);
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
      steps: 10, 
      curveSegments: 32, 
      bevelSegments: 12,
      bevelThickness: 0.25,
      bevelSize: 0.6
    };

    var alaIGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaIGeometry.scale(0.5,0.5,0.5);
    alaIGeometry.translate(-0.7,0,-0.05);
    this.alaI = new THREE.Mesh(alaIGeometry, materialAlas);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.5,0.5,0.5);
    alaDGeometry.translate(-0.7,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, materialAlas);

    var cejasShape = new THREE.Shape();
    cejasShape.moveTo(-0.1,0.02);
    cejasShape.lineTo(-0.9,0.1);
    cejasShape.quadraticCurveTo(-1,0.15, -1,0.2);
    cejasShape.lineTo(-0.95,0.55);
    cejasShape.quadraticCurveTo(-0.9,0.65, -0.8,0.65);
    cejasShape.lineTo(-0.15,0.5);
    cejasShape.quadraticCurveTo(-0.05,0.45, -0.05,0.35);
    cejasShape.lineTo(0,0.05);
    cejasShape.quadraticCurveTo(0,0, -0.1,0.02);

    var cejasOptions = {
      depth: 0.05, 
      steps: 1, 
      curveSegments: 8, 
      bevelSegments: 12,
      bevelSize: 0.1
    };

    var cejaIGeometry = new THREE.ExtrudeGeometry(cejasShape, cejasOptions);
    cejaIGeometry.scale(0.4,0.4,0.4);
    cejaIGeometry.rotateZ(-Math.PI/16);
    cejaIGeometry.translate(-0.2,0.1,0.6);
    var cejaI = new THREE.Mesh(cejaIGeometry, matCejas);

    var cejaDGeometry = new THREE.ExtrudeGeometry(cejasShape, cejasOptions);
    cejaDGeometry.scale(0.4,0.4,0.4);
    cejaDGeometry.rotateZ(-Math.PI/16);
    cejaDGeometry.rotateY(Math.PI);
    cejaDGeometry.translate(0.2,0.1,0.6);
    var cejaD = new THREE.Mesh(cejaDGeometry, matCejas);

    //UNIMOS LAS PARTES DEL BRAZO.
    // var moscaCSG = new CSG();
    // moscaCSG.union([cuerpo, this.alaI, this.alaD, cejaI, cejaD]);
    // var mosca = moscaCSG.toMesh();

    var mosca = new THREE.Group();
    mosca.add(cuerpo);
    mosca.add(this.alaI);
    mosca.add(this.alaD);
    mosca.add(cejaI);
    mosca.add(cejaD);
    mosca.rotateY(Math.PI/2);
    this.add(mosca);
    
  
  }

  setRotacion(value){
    if (value){
        this.rotar = true;
    }
    else{
        this.rotar = false;
    }
}
  
  update () {
  }
}

export { MoscaAgresiva };