import * as THREE from '../libs/three.module.js'
 
class BolaPinchos extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    var materialPinchos = new THREE.MeshPhysicalMaterial({
      color: 0xff0000, // color base
      map: new THREE.TextureLoader().load('../../imgs/metal.jpg'),
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 1.0, // intensidad del clearcoat, 1.0 es el máximo
      clearcoatRoughness: 1 // rugosidad del clearcoat, 0.5 es un valor medio
    });

    var mat = new THREE.MeshPhysicalMaterial({
      color: 0x555555, // color base
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 1.0, // intensidad del clearcoat, 1.0 es el máximo
      clearcoatRoughness: 1 // rugosidad del clearcoat, 0.5 es un valor medio
    });

    var bola = new THREE.SphereGeometry(1, 32, 32);
    var pinchoGrande = new THREE.ConeGeometry(0.5, 1.75, 64);
    var pinchoPeque = new THREE.ConeGeometry(0.5, 1, 64);

    var bolaMesh = new THREE.Mesh(bola, mat);
    var pinchoGrandeMesh1 = new THREE.Mesh(pinchoGrande, materialPinchos);
    var pinchoGrandeMesh2 = new THREE.Mesh(pinchoGrande, materialPinchos);
    var pinchoGrandeMesh3 = new THREE.Mesh(pinchoGrande, materialPinchos);
    var pinchoGrandeMesh4 = new THREE.Mesh(pinchoGrande, materialPinchos);
    var pinchoGrandeMesh5 = new THREE.Mesh(pinchoGrande, materialPinchos);
    var pinchoGrandeMesh6 = new THREE.Mesh(pinchoGrande, materialPinchos);


    var pinchoPequeMesh1 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh2 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh3 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh4 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh5 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh6 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh7 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh8 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh9 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh10 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh11 = new THREE.Mesh(pinchoPeque, materialPinchos);
    var pinchoPequeMesh12 = new THREE.Mesh(pinchoPeque, materialPinchos);


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

    this.add(this.BolaPinchos);
    /* this.rotar = false; */
  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      sizeX : 0.5,
      sizeY : 0.5,
      sizeZ : 0.5,
      
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.0,
      
      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.sizeX = 1.0;
        this.guiControls.sizeY = 1.0;
        this.guiControls.sizeZ = 1.0;
        
        this.guiControls.rotX = 0.0;
        this.guiControls.rotY = 0.0;
        this.guiControls.rotZ = 0.0;
        
        this.guiControls.posX = 0.0;
        this.guiControls.posY = 0.0;
        this.guiControls.posZ = 0.0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.01).name ('Tamaño X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.01).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.01).name ('Tamaño Z : ').listen();
    
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI/2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI/2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.01).name ('Rotación Z : ').listen();
    
    folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.01).name ('Posición X : ').listen();
    folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.01).name ('Posición Y : ').listen();
    folder.add (this.guiControls, 'posZ', -20.0, 20.0, 0.01).name ('Posición Z : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
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

  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
   
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);


    /* //PARA ROTAR EL OBEJTO.
    if(this.rotar){
        this.resultadoMesh1.rotation.x += 0.01;
        this.resultadoMesh1.rotation.y += 0.01;
        
        this.resultadoMesh2.rotation.x -= 0.01;
        this.resultadoMesh2.rotation.z -= 0.01;
    } */
    
  }
}

export { BolaPinchos };