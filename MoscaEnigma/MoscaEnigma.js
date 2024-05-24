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
    var mat = new THREE.MeshNormalMaterial();

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
    this.alaI = new THREE.Mesh(alaIGeometry, mat);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.75,0.75,0.75);
    alaDGeometry.translate(-0.55,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, mat);

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
    var mat = new THREE.MeshNormalMaterial();

    var sphereGeom = new THREE.SphereGeometry(0.2, 8, 8);
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

    this.enigma.position.y = 0.3 + 0.2;
    this.enigma.position.set(0,0.9 + 0.8,0);
    this.enigma.scale.set(0.5,0.5,0.5);
    //this.enigma.rotation.set(0,Math.PI/2,0);
    //mosca.rotateY(Math.PI/2);


    //UNIMOS LAS PARTES DEL BRAZO.
    var moscaCSG = new CSG();
    moscaCSG.union([cuerpo, this.alaI, this.alaD]);
    var mosca = moscaCSG.toMesh();

    mosca.position.set(0,0.7,0);

    this.moscaEnigma = new THREE.Group();
    this.moscaEnigma.add(mosca);
    this.moscaEnigma.add(this.enigma);
    this.add(this.moscaEnigma);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(this.moscaEnigma);

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVisible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVisible); */

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

  setRotacion(value){
    if (value){
        this.rotar = true;
    }
    else{
        this.rotar = false;
    }
  }

  funcionAnimar(value){
    if(this.alaI.rotation.z < 0.055 && !this.topeAlaI){
      this.alaI.rotation.z += 0.01;
      if(this.alaI.rotation.z >= 0.055){
        this.topeAlaI = true;
      }
    }
    else{
      this.alaI.rotation.z -= 0.01;
      if(this.alaI.rotation.z <= -0.055){
        this.topeAlaI = false;
      }
    }

    if(this.alaD.rotation.z < 0.055 && !this.topeAlaD){
      this.alaD.rotation.z += 0.01;
      if(this.alaD.rotation.z >= 0.055){
        this.topeAlaD = true;
      }
    }
    else{
      this.alaD.rotation.z -= 0.01;
      if(this.alaD.rotation.z <= -0.055){
        this.topeAlaD = false;
      }
    }
  }
  
  update () {}
}

export { MoscaEnigma };