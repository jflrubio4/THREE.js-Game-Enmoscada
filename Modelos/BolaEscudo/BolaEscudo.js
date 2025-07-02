import * as THREE from '../libs/three.module.js'
 
class BolaEscudo extends THREE.Object3D {
  constructor() {
    super();
    
    var geometry = new THREE.SphereGeometry(5.5, 32, 32);
    //geometry.translate(0, 5.5, 0);
    var material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.3,
      metalness: 0.7, // Alto valor para que parezca metálico
      roughness: 0.2 // Bajo valor para que sea suave y reflectante
    });
    
    this.bola = new THREE.Mesh(geometry, material);
    this.add(this.bola);
  }

  update(){}
    
}

export { BolaEscudo };