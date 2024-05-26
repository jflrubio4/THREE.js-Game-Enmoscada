import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Enigma } from '../Enigma/Enigma.js';
 
class MoscaEnigma extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();


    //VALORES PARA LAS ROTACIONES.
    this.topeAlaI = false;
    this.topeAlaD = false;
    this.rotar = true;
    
    //DEFINIMOS LE MATERIAL.
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
    var cuerpoGeom = new THREE.SphereGeometry(0.7, 64, 64);
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
    alaIGeometry.translate(-0.8,0,-0.05);
    this.alaI = new THREE.Mesh(alaIGeometry, materialAlas);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.5,0.5,0.5);
    alaDGeometry.translate(-0.8,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, materialAlas);

    this.enigma = new Enigma(gui, "Controles Enigma");
    this.enigma.position.set(0,0.9,0);
    this.enigma.scale.set(0.5,0.5,0.5);
    this.enigma.rotation.set(0,Math.PI/2,0);


    /* //UNIMOS LAS PARTES DEL BRAZO.
    var moscaCSG = new CSG();
    moscaCSG.union([cuerpo, this.alaI, this.alaD]);
    var mosca = moscaCSG.toMesh();
    mosca.rotateY(Math.PI/2); */

    var mosca = new THREE.Group();
    mosca.add(cuerpo);
    mosca.add(this.alaI);
    mosca.add(this.alaD);
    mosca.add(this.enigma);
    mosca.rotateY(-Math.PI/2); 
    this.add(mosca);
    
    //this.add(this.enigma);

    /* //PATRA LAS COLISIONES.
    this.cajaEnvolventeEnigma = new THREE.Box3();
    this.cajaEnvolventeEnigma.setFromObject(enigma);

    //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeEnigmaVisible = new THREE.Box3Helper(this.cajaEnvolventeEnigma, 0x00ff00);
    this.add(cajaEnvolventeEnigmaVisible); */

    /* this.add(cuerpo);
    this.add(this.alaI);
    this.add(this.alaD);
    this.add(enigma); */
    
  }
  update(){}
}

export { MoscaEnigma };