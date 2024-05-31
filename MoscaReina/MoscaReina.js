import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Mosca } from '../Mosca/Mosca.js';
 
class MoscaReina extends THREE.Object3D {
  constructor() {
    super();

    this.nombre = 'Mosca Reina';

    //CLICKS NECESARIOS PARA MATAR A LA MOSCA REINA.
    this.vida = 3;
    
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
      color: 0xee82ee,
      roughness: 0.5,
      metalness: 0.2
    });

    var crownMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffd700, // Color dorado
      metalness: 1.0, // Máxima metalicidad para un efecto metálico
      roughness: 0.2, // Un poco rugoso para dar realismo
      reflectivity: 1.0, // Alta reflectividad para un brillo metálico
      clearcoat: 1.0, // Añadir una capa de recubrimiento transparente para más realismo
      clearcoatRoughness: 0.1 // Un poco de rugosidad en la capa de recubrimiento
    });

    // var mosca = new Mosca(gui, "Controles Mosca");
    // // Escalar la corona con la mosca
    // mosca.scale.set(1.5, 1.5, 1.5);
    // this.add(mosca);

    //CODIGO DE LA MOSCA
    var cuerpoGeom = new THREE.SphereGeometry(1, 8, 8);
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
    alaIGeometry.scale(0.5,0.5,0.5);
    alaIGeometry.translate(-0.9,0,-0.05);
    this.alaI = new THREE.Mesh(alaIGeometry, materialAlas);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.5,0.5,0.5);
    alaDGeometry.translate(-0.9,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, materialAlas);

    /* var moscaCSG = new CSG();
    moscaCSG.union([cuerpo, this.alaI, this.alaD]);
    var mosca = moscaCSG.toMesh(); */
    //mosca.rotateY(Math.PI/2);
    //FIN MOSCA

    var shape = new THREE.Shape();
    shape.moveTo(0,0);
    shape.lineTo(-0.31,0.5);
    shape.lineTo(0.31,0.5);
    shape.lineTo(0,0);

    var options = {
      depth: 1, // Aumentamos la profundidad para que el prisma sea más visible
      steps: 1, // Reducimos el número de pasos para una geometría más simple
      curveSegments: 0, // No hay segmentos curvos en una forma triangular
      bevelSegments: 1, // Reducimos el número de segmentos del bisel para mantenerlo simple
      bevelThickness: 0, // Grosor del bisel, puede ajustarse según el efecto deseado
      bevelSize: 0, // Tamaño del bisel, puede ajustarse según el efecto deseado
      bevelEnabled: false
    };

    var restaGeom = new THREE.ExtrudeGeometry(shape, options);
    restaGeom.scale(1,1,2);
    restaGeom.translate(0,0.5,-1);

    //Para generar la forma de la corona con prismas de triangulos invertidos
    var restas = [];

    for (let i=0; i<8; i++){
      var restaMesh = new THREE.Mesh(restaGeom, mat);
      restaMesh.rotateY(Math.PI/5*i);
      restas.push(restaMesh);
    }

    var baseGeometry = new THREE.CylinderGeometry(1, 1, 1, 8);
    baseGeometry.translate(0,0.5,0);
    var baseMesh = new THREE.Mesh(baseGeometry, crownMaterial);

    var restaCSG = new CSG();
    for (let i=0; i<restas.length; i++){
      restaCSG.union([restas[i]]);
    }
    var restaTotal = restaCSG.toMesh();

    // Convertir las geometrías en CSG
    var csg = new CSG();
    csg.union([baseMesh]);
    csg.subtract([restaTotal]);
    var coronaMesh = csg.toMesh();
    coronaMesh.scale.set(0.3,0.4,0.3);
    coronaMesh.position.y = 0.9;

    /* var reinaCSG = new CSG();
    reinaCSG.union([coronaMesh, mosca]);
    var moscaReina = reinaCSG.toMesh(); */

    var mosca = new THREE.Group();
    mosca.add(cuerpo);
    mosca.add(this.alaI);
    mosca.add(this.alaD);
    mosca.add(coronaMesh);
    mosca.position.set(0,1,0);
    this.add(mosca);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(mosca);

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVsible); */

    mosca.userData.name = 'moscaReina';
  }

  // Método para reducir la vida de la mosca
  reducirVida() {
    this.vida--;
  }
  
  funcionAnimar(value){
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
    this.funcionAnimar(this.rotar);
    
  }
}

export { MoscaReina };