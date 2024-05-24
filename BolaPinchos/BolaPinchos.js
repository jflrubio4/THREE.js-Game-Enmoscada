import * as THREE from '../libs/three.module.js'
 
class BolaPinchos extends THREE.Object3D {
  constructor() {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz

    this.nombre = 'Bola de pinchos';

    var mat = new THREE.MeshNormalMaterial();

    var bola = new THREE.SphereGeometry(1, 32, 32);
    var pinchoGrande = new THREE.ConeGeometry(0.5, 1.75, 32);
    var pinchoPeque = new THREE.ConeGeometry(0.5, 1, 32);

    var bolaMesh = new THREE.Mesh(bola, mat);
    var pinchoGrandeMesh1 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh2 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh3 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh4 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh5 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh6 = new THREE.Mesh(pinchoGrande, mat);


    var pinchoPequeMesh1 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh2 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh3 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh4 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh5 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh6 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh7 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh8 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh9 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh10 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh11 = new THREE.Mesh(pinchoPeque, mat);
    var pinchoPequeMesh12 = new THREE.Mesh(pinchoPeque, mat);


    //PINCHOS GRANDES  
    pinchoGrandeMesh1.translateY(1);

    pinchoGrandeMesh2.rotateZ(Math.PI/2);
    pinchoGrandeMesh2.translateY(1);

    pinchoGrandeMesh3.rotateZ(-Math.PI/2);
    pinchoGrandeMesh3.translateY(1);

    pinchoGrandeMesh4.rotateZ(Math.PI);
    pinchoGrandeMesh4.translateY(1);

    pinchoGrandeMesh5.rotateX(Math.PI/2);
    pinchoGrandeMesh5.translateY(1);

    pinchoGrandeMesh6.rotateX(-Math.PI/2);
    pinchoGrandeMesh6.translateY(1);

    //PINCHOS PEQUEÑOS
    pinchoPequeMesh1.rotateY(Math.PI/4);
    pinchoPequeMesh1.rotateZ(Math.PI/4);
    pinchoPequeMesh1.translateY(1);

    pinchoPequeMesh2.rotateY(-Math.PI/4);
    pinchoPequeMesh2.rotateZ(-Math.PI/4);
    pinchoPequeMesh2.translateY(1);

    pinchoPequeMesh3.rotateY(Math.PI/4);
    pinchoPequeMesh3.rotateZ(-Math.PI/4);
    pinchoPequeMesh3.translateY(1);

    pinchoPequeMesh4.rotateY(-Math.PI/4);
    pinchoPequeMesh4.rotateZ(Math.PI/4);
    pinchoPequeMesh4.translateY(1);

    pinchoPequeMesh5.rotateY(Math.PI/4);
    pinchoPequeMesh5.rotateZ(3*Math.PI/4);
    pinchoPequeMesh5.translateY(1);

    pinchoPequeMesh6.rotateY(-Math.PI/4);
    pinchoPequeMesh6.rotateZ(-3*Math.PI/4);
    pinchoPequeMesh6.translateY(1);

    pinchoPequeMesh7.rotateY(Math.PI/4);
    pinchoPequeMesh7.rotateZ(-3*Math.PI/4);
    pinchoPequeMesh7.translateY(1);

    pinchoPequeMesh8.rotateY(-Math.PI/4);
    pinchoPequeMesh8.rotateZ(3*Math.PI/4);
    pinchoPequeMesh8.translateY(1);

    //PINCHOS INTERMEDIOS.
    pinchoPequeMesh9.rotateY(Math.PI/4);
    pinchoPequeMesh9.rotateX(Math.PI/2);
    pinchoPequeMesh9.translateY(1);

    pinchoPequeMesh10.rotateY(-Math.PI/4);
    pinchoPequeMesh10.rotateX(Math.PI/2);
    pinchoPequeMesh10.translateY(1);

    pinchoPequeMesh11.rotateY(Math.PI/4);
    pinchoPequeMesh11.rotateX(-Math.PI/2);
    pinchoPequeMesh11.translateY(1);

    pinchoPequeMesh12.rotateY(-Math.PI/4);
    pinchoPequeMesh12.rotateX(-Math.PI/2);
    pinchoPequeMesh12.translateY(1);
    
    
    
    this.BolaPinchos = new THREE.Group();

    this.BolaPinchos.add(bolaMesh);
    this.BolaPinchos.add(pinchoGrandeMesh1);
    this.BolaPinchos.add(pinchoGrandeMesh2);
    this.BolaPinchos.add(pinchoGrandeMesh3);
    this.BolaPinchos.add(pinchoGrandeMesh4);
    this.BolaPinchos.add(pinchoGrandeMesh5);
    this.BolaPinchos.add(pinchoGrandeMesh6);

    this.BolaPinchos.add(pinchoPequeMesh1);
    this.BolaPinchos.add(pinchoPequeMesh2);
    this.BolaPinchos.add(pinchoPequeMesh3);
    this.BolaPinchos.add(pinchoPequeMesh4);
    this.BolaPinchos.add(pinchoPequeMesh5);
    this.BolaPinchos.add(pinchoPequeMesh6);
    this.BolaPinchos.add(pinchoPequeMesh7);
    this.BolaPinchos.add(pinchoPequeMesh8);

    this.BolaPinchos.add(pinchoPequeMesh9);
    this.BolaPinchos.add(pinchoPequeMesh10);
    this.BolaPinchos.add(pinchoPequeMesh11);
    this.BolaPinchos.add(pinchoPequeMesh12);

    this.BolaPinchos.translateY(1.87);

    this.add(this.BolaPinchos);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(this.BolaPinchos);

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVsible); */

    
    
    
    /* this.rotar = false; */
  }

  setRotacion(value){
    if (value){
        this.rotar = true;
    }
    else{
        this.rotar = false;
    }
  }

  getGeometry(){
    return this.tubo;
  }

  
  update () {}
}

export { BolaPinchos };