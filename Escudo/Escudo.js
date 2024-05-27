import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
 
class Escudo extends THREE.Object3D {
  constructor() {
    super();

    this.nombre = 'Escudo';

    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('escudo/escudo.mtl',
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load('escudo/escudo.obj',
          (object) => {
            this.resultadoMesh1 = object;
            this.resultadoMesh1.scale.set(0.025,0.025,0.025);
            this.resultadoMesh1.rotateX(-Math.PI/2);
            this.resultadoMesh1.translateZ(1.9);
            this.resultadoMesh1.translateY(0.75);
            this.add(this.resultadoMesh1);
            
            /* //PATRA LAS COLISIONES.
            this.cajaEnvolvente = new THREE.Box3();
            this.cajaEnvolvente.setFromObject(this.resultadoMesh1);
            this.cajaEnvolvente.translate(new THREE.Vector3(0,0,1.5));

            //PARA VISUALIZAR LA CAJA ENVOLVENTE.
            var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
            this.add(cajaEnvolventeVsible);    */

            this.resultadoMesh1.userData.name = 'escudo';
          }, null, null);
      });
      
     
    

    this.rotar = false;
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

export { Escudo };