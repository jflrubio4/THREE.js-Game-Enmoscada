import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
 
class Venus extends THREE.Object3D {
  constructor() {
    super();

    this.nombre = 'Venus';

    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('venus/model.mtl',
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load('venus/model.obj',
          (object) => {
            this.resultadoMesh1 = object;
            this.resultadoMesh1.scale.set(0.2,0.2,0.2);
            this.resultadoMesh1.translateX(-9.75);
            this.resultadoMesh1.translateZ(-5.25);
            this.resultadoMesh1.translateY(-1);
            this.add(this.resultadoMesh1);

/*             //PATRA LAS COLISIONES.
            this.cajaEnvolvente = new THREE.Box3(
              new THREE.Vector3(-0.5, -0.5, -0.5), // min
              new THREE.Vector3(0.5, 0.5, 0.5) // max
            ); */
            //this.cajaEnvolvente.setFromObject(this.resultadoMesh1);
            //this.cajaEnvolvente.scale.set(0.05,0.05,0.05);

            /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
            var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
            this.add(cajaEnvolventeVsible);     */ 
          }, null, null);
      });
  }
  
  update () {}
}

export { Venus };