import * as THREE from '../libs/three.module.js'
 
class Rev extends THREE.Object3D {

  constructor() {
    super();

    // Crear el perfil del triángulo
    this.points = [];
    this.points.push(new THREE.Vector2(0, 0)); // Punto en el origen
    this.points.push(new THREE.Vector2(1, 0)); // Punto en la base
    this.points.push(new THREE.Vector2(0.5, 3)); // Punto en el vértice superior
    this.points.push(new THREE.Vector2(0, 0)); // Volver al origen para cerrar el triángulo
    
    // Un Mesh se compone de geometría y material
    var geom = new THREE.LatheGeometry (this.points, 8, 0, 2*Math.PI);
    // Como material se crea uno a partir de un color
    var mat = new THREE.MeshNormalMaterial({color: 0x44556f});

    // Crear una semiesfera
    const semiSphereGeom = new THREE.SphereGeometry(1, 8, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);    const semiSphereMat = new THREE.MeshNormalMaterial({color: 0x44556f});
    const semiSphere = new THREE.Mesh(semiSphereGeom, semiSphereMat);

    semiSphere.rotateX(Math.PI/2);
    
    // Ya podemos construir el Mesh
    this.revol = new THREE.Mesh (geom, mat);
    this.revol.rotateX(Math.PI/2);

    // Y añadirlo como hijo del Object3D (el this)
    this.add (this.revol);

    // Añadir la semiesfera al objeto 3D
    this.add(semiSphere);
  }

  update () {}
}

export { Rev };
