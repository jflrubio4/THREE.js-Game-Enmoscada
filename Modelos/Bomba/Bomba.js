import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class Bomba extends THREE.Object3D {
  constructor() {
    super();

    this.nombre = 'Bomba';

    //DEFINIMOS LE MATERIAL.
    var matBomba = new THREE.MeshStandardMaterial({color: 0x444444});
    matBomba.bumpMap = new THREE.TextureLoader().load('../../imgs/rock-texture.jpg');
    //textureCuerda.wrapS = THREE.RepeatWrapping;
    //textureCuerda.wrapT = THREE.RepeatWrapping;
    /* textureAlas.offset.set(-0.5, 0.5);
    textureAlas.wrapS = THREE.RepeatWrapping;
    textureAlas.wrapT = THREE.RepeatWrapping; */

    //var matCuerda = new THREE.MeshStandardMaterial({map: textureCuerda});

    
    //DEFINIMOS EL MATERIAL.
    // var matBomba = new THREE.MeshPhysicalMaterial({
    //   color: 0x444444, // color base
    //   map: new THREE.TextureLoader().load('../../imgs/bomba.jpg'),
    //   /* roughness: 1,
    //   clearcoat: 1.0, // intensidad del clearcoat, 1.0 es el máximo
    //   clearcoatRoughness: 0.3 // rugosidad del clearcoat, 0.3 es un valor medio */
    // });

    var matCuerda = new THREE.MeshPhysicalMaterial({
      map: new THREE.TextureLoader().load('../../imgs/cuerda.jpg'),
    });

    var cuerpoGeom = new THREE.SphereGeometry(2, 8, 8);
    var cuerpo = new THREE.Mesh(cuerpoGeom, matBomba);

    var topeGeom = new THREE.CylinderGeometry(1.5, 1.5, 1, 8);
    topeGeom.translate(0,4,0);
    var topeMesh = new THREE.Mesh(topeGeom, matBomba);

    var torusGeometry = new THREE.TorusGeometry(2, 0.7, 8, 8); //Hasta 60 grados
    //0.5 de la base y 1.5 para situarlo encima de la esfera
    //torusGeometry.translate(-2,4,0);
    var toro = new THREE.Mesh(torusGeometry, matCuerda);

    var caja = new THREE.BoxGeometry(10,3,2);
    var caja2 = new THREE.BoxGeometry(10,10,2);
    caja.translate(0,-1.5,0);
    caja2.translate(-5,0,0);
    var cajaMesh = new THREE.Mesh(caja, matCuerda);
    var cajaMesh2 = new THREE.Mesh(caja2, matCuerda);

    var csg = new CSG();
    csg.subtract([toro, cajaMesh]);
    csg.subtract([cajaMesh2]);
    var toroCortado = csg.toMesh();

    toroCortado.position.set(1,2.25,0);

    this.bombaFinal = new THREE.Group();
    topeMesh.scale.set(0.5,0.5,0.5);
    topeMesh.rotation.set(0,Math.PI,0);
    this.bombaFinal.add(topeMesh);
    toroCortado.scale.set(0.5,0.5,0.5);
    toroCortado.rotation.set(0,Math.PI,0);
    this.bombaFinal.add(toroCortado);
    this.bombaFinal.add(cuerpo);

    this.bombaFinal.translateY(1.5);

    this.add(this.bombaFinal);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(this.bombaFinal);

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVisible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVisible); */

    this.bombaFinal.userData.name = 'bomba';
    
  }
  
  update () {}
}

export { Bomba };