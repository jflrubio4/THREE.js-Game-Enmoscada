import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class Bomba extends THREE.Object3D {
  constructor() {
    super();

    this.nombre = 'Bomba';

    var mat = new THREE.MeshPhysicalMaterial({
      color: 0x555555, // color base
      metalness: 0.0,
      roughness: 1,
      clearcoat: 1.0, // intensidad del clearcoat, 1.0 es el máximo
      clearcoatRoughness: 1 // rugosidad del clearcoat, 0.5 es un valor medio
    });

    var matBomba = new THREE.MeshPhysicalMaterial({
      color: 0x444444, // color base
      map: new THREE.TextureLoader().load('../../imgs/bomba.jpg'),
      /* roughness: 1,
      clearcoat: 1.0, // intensidad del clearcoat, 1.0 es el máximo
      clearcoatRoughness: 0.3 // rugosidad del clearcoat, 0.3 es un valor medio */
    });
    
    //DEFINIMOS EL MATERIAL.
    //var mat = new THREE.MeshNormalMaterial();

    var cuerpoGeom = new THREE.SphereGeometry(2, 8, 8);
    var cuerpo = new THREE.Mesh(cuerpoGeom, mat);

    var topeGeom = new THREE.CylinderGeometry(1.5, 1.5, 1, 8);
    topeGeom.translate(0,4,0);
    var topeMesh = new THREE.Mesh(topeGeom, mat);

    var torusGeometry = new THREE.TorusGeometry(2, 0.7, 8, 8); //Hasta 60 grados
    //0.5 de la base y 1.5 para situarlo encima de la esfera
    //torusGeometry.translate(-2,4,0);
    var toro = new THREE.Mesh(torusGeometry, mat);

    var caja = new THREE.BoxGeometry(10,3,2);
    var caja2 = new THREE.BoxGeometry(10,10,2);
    caja.translate(0,-1.5,0);
    caja2.translate(-5,0,0);
    var cajaMesh = new THREE.Mesh(caja, mat);
    var cajaMesh2 = new THREE.Mesh(caja2, mat);

    var csg = new CSG();
    csg.subtract([toro, cajaMesh]);
    csg.subtract([cajaMesh2]);
    var toroCortado = csg.toMesh();

    toroCortado.position.set(-2,4.5,0);

    // var tapaToro = new THREE.CylinderGeometry(0.7, 0.7, 0.01, 32);
    // tapaToro.rotateY(-Math.PI/2);
    // tapaToro.rotateZ(Math.PI/2);
    // tapaToro.translate(-2,6,0);
    // var tapaToroMesh = new THREE.Mesh(tapaToro, mat);
    
    //this.add(tapaToroMesh);


    //UNIMOS LAS PARTES DEL BRAZO.
    var fuseCSG = new CSG();
    fuseCSG.union([topeMesh, toroCortado]);
    var fuse = fuseCSG.toMesh();
    fuse.scale.set(0.5,0.5,0.5);
    fuse.rotation.set(0,Math.PI,Math.PI/6);

    var bombaCSG = new CSG();
    bombaCSG.union([fuse, cuerpo]);
    var bomba = bombaCSG.toMesh();

    bomba.position.set(0,2,0);

    this.add(bomba);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(bomba);

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVisible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVisible); */
    
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

export { Bomba };