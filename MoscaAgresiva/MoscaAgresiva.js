import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class MoscaAgresiva extends THREE.Object3D {
  constructor() {
    super();

    this.nombre = 'Mosca Agresiva';
    
    //DEFINIMOS LE MATERIAL.
    var mat = new THREE.MeshNormalMaterial();

    //CUERPO MOSCA
    var cuerpoGeom = new THREE.SphereGeometry(0.65, 8, 8);
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
      bevelSize: 0.6,
      bevelEnabled: false
    };

    var alaIGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaIGeometry.scale(0.75,0.75,0.75);
    alaIGeometry.translate(-0.5,0,-0.05);
    this.alaI = new THREE.Mesh(alaIGeometry, mat);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.75,0.75,0.75);
    alaDGeometry.translate(-0.5,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, mat);

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
      depth: 0.5, 
      steps: 1, 
      curveSegments: 8, 
      bevelSegments: 1,
      bevelSize: 0.1,
      bevelEnabled: false
    };

    var cejaIGeometry = new THREE.ExtrudeGeometry(cejasShape, cejasOptions);
    cejaIGeometry.scale(0.4,0.4,0.4);
    cejaIGeometry.rotateZ(-Math.PI/16);
    cejaIGeometry.translate(-0.2,0.1,0.45);
    var cejaI = new THREE.Mesh(cejaIGeometry, mat);

    var cejaDGeometry = new THREE.ExtrudeGeometry(cejasShape, cejasOptions);
    cejaDGeometry.scale(0.4,0.4,0.4);
    cejaDGeometry.rotateZ(-Math.PI/16);
    cejaDGeometry.rotateY(Math.PI);
    cejaDGeometry.translate(0.2,0.1,0.65);
    var cejaD = new THREE.Mesh(cejaDGeometry, mat);

    //UNIMOS LAS PARTES DEL BRAZO.
    var moscaCSG = new CSG();
    moscaCSG.union([cuerpo, this.alaI, this.alaD, cejaI, cejaD]);
    var mosca = moscaCSG.toMesh();
    //mosca.rotateY(Math.PI/2);

    mosca.position.set(0,0.65,0);
    this.add(mosca);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(mosca);

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
  
  update () {}
}

export { MoscaAgresiva };