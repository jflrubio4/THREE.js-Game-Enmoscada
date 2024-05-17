import * as THREE from '../libs/three.module.js'
 
class PlanchaPinchos extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    var mat = new THREE.MeshNormalMaterial();

    var plancha = new THREE.BoxGeometry(3, 0.25, 3);
    
    var pinchoGrande = new THREE.ConeGeometry(0.25, 0.75, 32);


    var planchaMesh = new THREE.Mesh(plancha, mat);

    var pinchoGrandeMesh1 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh2 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh3 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh4 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh5 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh6 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh7 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh8 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh9 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh10 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh11= new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh12 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh13 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh14 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh15 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh16 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh17 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh18 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh19 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoGrandeMesh20 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoPequeMesh21 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoPequeMesh22 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoPequeMesh23 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoPequeMesh24 = new THREE.Mesh(pinchoGrande, mat);
    var pinchoPequeMesh25 = new THREE.Mesh(pinchoGrande, mat);

    //FILA 
    pinchoGrandeMesh1.translateY(0.375 + 0.125);

    pinchoGrandeMesh2.translateY(0.375 + 0.125);
    pinchoGrandeMesh2.translateX(0.55);

    pinchoGrandeMesh3.translateY(0.375 + 0.125);
    pinchoGrandeMesh3.translateX(1.1);

    pinchoGrandeMesh4.translateY(0.375 + 0.125);
    pinchoGrandeMesh4.translateX(-0.55);

    pinchoGrandeMesh5.translateY(0.375 + 0.125);
    pinchoGrandeMesh5.translateX(-1.1);

    //FILA
    pinchoGrandeMesh6.translateY(0.375 + 0.125);
    pinchoGrandeMesh6.translateZ(0.55);

    pinchoGrandeMesh7.translateY(0.375 + 0.125);
    pinchoGrandeMesh7.translateX(0.55);
    pinchoGrandeMesh7.translateZ(0.55);

    pinchoGrandeMesh8.translateY(0.375 + 0.125);
    pinchoGrandeMesh8.translateX(1.1);
    pinchoGrandeMesh8.translateZ(0.55);

    pinchoGrandeMesh9.translateY(0.375 + 0.125);
    pinchoGrandeMesh9.translateX(-0.55);
    pinchoGrandeMesh9.translateZ(0.55);

    pinchoGrandeMesh10.translateY(0.375 + 0.125);
    pinchoGrandeMesh10.translateX(-1.1);
    pinchoGrandeMesh10.translateZ(0.55);

    //FILA
    pinchoGrandeMesh11.translateY(0.375 + 0.125);
    pinchoGrandeMesh11.translateZ(1.1);

    pinchoGrandeMesh12.translateY(0.375 + 0.125);
    pinchoGrandeMesh12.translateX(0.55);
    pinchoGrandeMesh12.translateZ(1.1);

    pinchoGrandeMesh13.translateY(0.375 + 0.125);
    pinchoGrandeMesh13.translateX(1.1);
    pinchoGrandeMesh13.translateZ(1.1);

    pinchoGrandeMesh14.translateY(0.375 + 0.125);
    pinchoGrandeMesh14.translateX(-0.55);
    pinchoGrandeMesh14.translateZ(1.1);

    pinchoGrandeMesh15.translateY(0.375 + 0.125);
    pinchoGrandeMesh15.translateX(-1.1);
    pinchoGrandeMesh15.translateZ(1.1);

    //FILA
    pinchoGrandeMesh16.translateY(0.375 + 0.125);
    pinchoGrandeMesh16.translateZ(-0.55);
    
    pinchoGrandeMesh17.translateY(0.375 + 0.125);
    pinchoGrandeMesh17.translateX(0.55);
    pinchoGrandeMesh17.translateZ(-0.55);

    pinchoGrandeMesh18.translateY(0.375 + 0.125);
    pinchoGrandeMesh18.translateX(1.1);
    pinchoGrandeMesh18.translateZ(-0.55);

    pinchoGrandeMesh19.translateY(0.375 + 0.125);
    pinchoGrandeMesh19.translateX(-0.55);
    pinchoGrandeMesh19.translateZ(-0.55);

    pinchoGrandeMesh20.translateY(0.375 + 0.125);
    pinchoGrandeMesh20.translateX(-1.1);
    pinchoGrandeMesh20.translateZ(-0.55);

    //FILA
    pinchoPequeMesh21.translateY(0.375 + 0.125);
    pinchoPequeMesh21.translateZ(-1.1);

    pinchoPequeMesh22.translateY(0.375 + 0.125);
    pinchoPequeMesh22.translateX(0.55);
    pinchoPequeMesh22.translateZ(-1.1);

    pinchoPequeMesh23.translateY(0.375 + 0.125);
    pinchoPequeMesh23.translateX(1.1);
    pinchoPequeMesh23.translateZ(-1.1);

    pinchoPequeMesh24.translateY(0.375 + 0.125);
    pinchoPequeMesh24.translateX(-0.55);
    pinchoPequeMesh24.translateZ(-1.1);

    pinchoPequeMesh25.translateY(0.375 + 0.125);
    pinchoPequeMesh25.translateX(-1.1);
    pinchoPequeMesh25.translateZ(-1.1);
    

    this.planchaPincho = new THREE.Group();

    this.planchaPincho.add(planchaMesh);

    this.planchaPincho.add(pinchoGrandeMesh1);
    this.planchaPincho.add(pinchoGrandeMesh2);
    this.planchaPincho.add(pinchoGrandeMesh3);
    this.planchaPincho.add(pinchoGrandeMesh4);
    this.planchaPincho.add(pinchoGrandeMesh5);
    this.planchaPincho.add(pinchoGrandeMesh6);
    this.planchaPincho.add(pinchoGrandeMesh7);
    this.planchaPincho.add(pinchoGrandeMesh8);
    this.planchaPincho.add(pinchoGrandeMesh9);
    this.planchaPincho.add(pinchoGrandeMesh10);
    this.planchaPincho.add(pinchoGrandeMesh11);
    this.planchaPincho.add(pinchoGrandeMesh12);
    this.planchaPincho.add(pinchoGrandeMesh13);
    this.planchaPincho.add(pinchoGrandeMesh14);
    this.planchaPincho.add(pinchoGrandeMesh15);
    this.planchaPincho.add(pinchoGrandeMesh16);
    this.planchaPincho.add(pinchoGrandeMesh17);
    this.planchaPincho.add(pinchoGrandeMesh18);
    this.planchaPincho.add(pinchoGrandeMesh19);
    this.planchaPincho.add(pinchoGrandeMesh20);
    this.planchaPincho.add(pinchoPequeMesh21);
    this.planchaPincho.add(pinchoPequeMesh22);
    this.planchaPincho.add(pinchoPequeMesh23);
    this.planchaPincho.add(pinchoPequeMesh24);
    this.planchaPincho.add(pinchoPequeMesh25);

    this.add(this.planchaPincho);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(this.planchaPincho);

    //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVsible);

    
    
    
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

export { PlanchaPinchos };