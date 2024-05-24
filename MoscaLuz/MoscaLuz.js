import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class MoscaLuz extends THREE.Object3D {
  constructor() {
    super();

    this.nombre = 'Mosca  de luz';
    
    //DEFINIMOS LE MATERIAL.
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
      steps: 2, 
      curveSegments: 8, 
      bevelSegments: 6,
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

    // Crear la geometría del toro (halo)
    var toroGeometry = new THREE.TorusGeometry(0.4, 0.1, 8, 8);
    // Posicionar el toro encima de la esfera de la mosca
    toroGeometry.rotateX(Math.PI/2);
    toroGeometry.translate(0, 0.8, 0);
    // Crear el mesh del toro con el mismo material que la mosca
    var toro = new THREE.Mesh(toroGeometry, mat);


    //UNIMOS LAS PARTES DEL BRAZO.
    var moscaCSG = new CSG();
    moscaCSG.union([cuerpo, this.alaI, this.alaD, toro]);
    var mosca = moscaCSG.toMesh();
    mosca.rotateY(Math.PI/2);

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

export { MoscaLuz };