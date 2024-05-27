import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class Nitro extends THREE.Object3D {
  constructor() {
    super();
    
    // Crear una instancia de THREE.Shape
    var shape = new THREE.Shape();

    // Definir los puntos para la forma del relámpago
    shape.moveTo(0, 2);
    shape.lineTo(-1, 2);
    shape.lineTo(-1.5, 0);
    shape.lineTo(0, 0);
    shape.lineTo(-0.5, -2);
    shape.lineTo(1, 0.5);
    shape.lineTo(0, 0.5);
    shape.lineTo(0, 2);

    // Configurar las opciones de extrusión
    var extrudeSettings = {
        steps: 2,
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0.25,
        bevelSegments: 2
    };

    // Crear la geometría extrudida a partir de la forma
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Crear un material
    var material = new THREE.MeshStandardMaterial({
      color: 0xfffb00, // color del material
      emissive: 0xfffb00, // color de la emisión de luz
      emissiveIntensity: 0.5 // intensidad de la emisión de luz
    });
    
    // Crear una malla a partir de la geometría y el material
    var mesh = new THREE.Mesh(geometry, material);

    mesh.scale.set(0.43, 0.53625, 0.215);
    mesh.position.set(0.25, 1.75, 0);

    // Añadir la malla a la escena
    this.add(mesh);

    var boxInvisible = new THREE.BoxGeometry(1.5, 3, 1);
    boxInvisible.translate(0.2, 1.5, 0);
    var cajaMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000, // El color no importa ya que la caja será transparente
      transparent: true,
      opacity: 0.0 // Hacer la caja completamente transparente
    });
    var cajaInvisible = new THREE.Mesh(boxInvisible, cajaMaterial);
    this.add(cajaInvisible);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(mesh);

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVsible); */

    this.rotar = false;

    mesh.userData.name = 'nitro';
  }
  
  update () {}
}

export { Nitro };