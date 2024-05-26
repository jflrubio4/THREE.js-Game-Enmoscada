import * as THREE from '../libs/three.module.js'
 
class PlanchaPinchos extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    var loader = new THREE.TextureLoader();
    var texturePinchos = loader.load('../../imgs/metal.jpg');
    var textureMadera = loader.load('../../imgs/madera.jpg');

    var materialPinchos = new THREE.MeshPhysicalMaterial({
      //color: 0xff0000, // color base
      map: texturePinchos,
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 1.0, // intensidad del clearcoat, 1.0 es el máximo
      clearcoatRoughness: 1 // rugosidad del clearcoat, 0.5 es un valor medio
    });

    //var materialPinchos = new THREE.MeshStandardMaterial({map: texturePinchos});
    var materialMadera = new THREE.MeshStandardMaterial({map: textureMadera});

    var plancha = new THREE.BoxGeometry(3, 0.25, 3);
    
    var pinchoGrande = new THREE.ConeGeometry(0.25, 0.75, 32);

    var planchaMesh = new THREE.Mesh(plancha, materialMadera);

    // Crear múltiples instancias de los pinchos y distribuirlos
    var pinchos = [];
    for (let i = 0; i < 25; i++) {
        pinchos[i] = new THREE.Mesh(pinchoGrande, materialPinchos);
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
    

    this.planchaPincho = new THREE.Group();

    this.planchaPincho.add(planchaMesh);

    for (let i=0; i<pinchos.length; i++){
      this.planchaPincho.add(pinchos[i]);
    }

    this.add(this.planchaPincho);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(this.planchaPincho);

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVsible); */
    
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

  
  update () {}
}

export { PlanchaPinchos };