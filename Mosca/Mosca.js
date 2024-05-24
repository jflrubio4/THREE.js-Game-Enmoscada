import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class Mosca extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    this.nombre = 'Mosca corriente';

    //VALORES PARA LAS ROTACIONES.
    //VALORES PARA LAS ROTACIONES.
    this.topeAlaI = false;
    this.topeAlaD = false;
    this.rotar = true;
    
    //DEFINIMOS LE MATERIAL.
    var mat = new THREE.MeshNormalMaterial();

    //CUERPO MOSCA
    var cuerpoGeom = new THREE.SphereGeometry(0.3, 8, 8);
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
    alaIGeometry.translate(-0.1,0,-0.05);
    this.alaI = new THREE.Mesh(alaIGeometry, mat);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.5,0.5,0.5);
    alaDGeometry.translate(-0.1,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, mat);


    /* //UNIMOS LAS PARTES DEL BRAZO.
    var moscaCSG = new CSG();
    moscaCSG.union([cuerpo, this.alaI, this.alaD]);
    var mosca = moscaCSG.toMesh();
    mosca.rotateY(Math.PI/2);

    this.add(mosca); */

    this.mosca = new THREE.Group();

    this.mosca.add(cuerpo);
    this.mosca.add(this.alaI);
    this.mosca.add(this.alaD);

    this.mosca.position.set(0,0.3,0);
    this.add(this.mosca);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(this.mosca);

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVsible); */
    
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
  
  update () {}
}

export { Mosca };