import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class PlanchaPinchos extends THREE.Object3D {
  constructor() {
    super();

    this.nombre = 'Plancha de pinchos';

    var mat = new THREE.MeshNormalMaterial();

    var plancha = new THREE.BoxGeometry(3, 0.25, 3);
    
    var pinchoGrande = new THREE.ConeGeometry(0.25, 0.75, 8);

    var planchaMesh = new THREE.Mesh(plancha, mat);

    // Crear múltiples instancias de los pinchos y distribuirlos
    var pinchos = [];
    for (let i = 0; i < 25; i++) {
        pinchos[i] = new THREE.Mesh(pinchoGrande, mat);
    }

    // Posicionar los pinchos
    pinchos[0].translateY(0.375 + 0.125);

    pinchos[1].translateY(0.375 + 0.125);
    pinchos[1].translateX(0.55);

    pinchos[2].translateY(0.375 + 0.125);
    pinchos[2].translateX(1.1);

    pinchos[3].translateY(0.375 + 0.125);
    pinchos[3].translateX(-0.55);

    pinchos[4].translateY(0.375 + 0.125);
    pinchos[4].translateX(-1.1);

    //FILA
    pinchos[5].translateY(0.375 + 0.125);
    pinchos[5].translateZ(0.55);

    pinchos[6].translateY(0.375 + 0.125);
    pinchos[6].translateX(0.55);
    pinchos[6].translateZ(0.55);

    pinchos[7].translateY(0.375 + 0.125);
    pinchos[7].translateX(1.1);
    pinchos[7].translateZ(0.55);

    pinchos[8].translateY(0.375 + 0.125);
    pinchos[8].translateX(-0.55);
    pinchos[8].translateZ(0.55);

    pinchos[9].translateY(0.375 + 0.125);
    pinchos[9].translateX(-1.1);
    pinchos[9].translateZ(0.55);

    //FILA
    pinchos[10].translateY(0.375 + 0.125);
    pinchos[10].translateZ(1.1);

    pinchos[11].translateY(0.375 + 0.125);
    pinchos[11].translateX(0.55);
    pinchos[11].translateZ(1.1);

    pinchos[12].translateY(0.375 + 0.125);
    pinchos[12].translateX(1.1);
    pinchos[12].translateZ(1.1);

    pinchos[13].translateY(0.375 + 0.125);
    pinchos[13].translateX(-0.55);
    pinchos[13].translateZ(1.1);

    pinchos[14].translateY(0.375 + 0.125);
    pinchos[14].translateX(-1.1);
    pinchos[14].translateZ(1.1);

    //FILA
    pinchos[15].translateY(0.375 + 0.125);
    pinchos[15].translateZ(-0.55);
    
    pinchos[16].translateY(0.375 + 0.125);
    pinchos[16].translateX(0.55);
    pinchos[16].translateZ(-0.55);

    pinchos[17].translateY(0.375 + 0.125);
    pinchos[17].translateX(1.1);
    pinchos[17].translateZ(-0.55);

    pinchos[18].translateY(0.375 + 0.125);
    pinchos[18].translateX(-0.55);
    pinchos[18].translateZ(-0.55);

    pinchos[19].translateY(0.375 + 0.125);
    pinchos[19].translateX(-1.1);
    pinchos[19].translateZ(-0.55);

    //FILA
    pinchos[20].translateY(0.375 + 0.125);
    pinchos[20].translateZ(-1.1);

    pinchos[21].translateY(0.375 + 0.125);
    pinchos[21].translateX(0.55);
    pinchos[21].translateZ(-1.1);

    pinchos[22].translateY(0.375 + 0.125);
    pinchos[22].translateX(1.1);
    pinchos[22].translateZ(-1.1);

    pinchos[23].translateY(0.375 + 0.125);
    pinchos[23].translateX(-0.55);
    pinchos[23].translateZ(-1.1);

    pinchos[24].translateY(0.375 + 0.125);
    pinchos[24].translateX(-1.1);
    pinchos[24].translateZ(-1.1);
    
    /* let csg = new CSG();

    for (let i = 0; i < pinchos.length; i++) {
      csg.union([pinchos[i]]);
    }

    // Convertir el CSG resultante de nuevo a Mesh
    let finalMesh = csg.toMesh();

    this.add(finalMesh); */

    this.planchaPincho = new THREE.Object3D();

    this.planchaPincho.add(planchaMesh);

    for (let i=0; i<pinchos.length; i++){
      this.planchaPincho.add(pinchos[i]);
    }

    this.add(this.planchaPincho);

    /* //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(this.planchaPincho); */

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVsible); */
  }
  
  update(){}
}

export { PlanchaPinchos };