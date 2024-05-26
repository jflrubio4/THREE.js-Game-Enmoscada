import * as THREE from '../libs/three.module.js'
 
class Circuito extends THREE.Object3D {
  constructor(gui,titleGui,resolucion, divisiones) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    var cielo = new THREE.SphereGeometry(2000, 32, 32);

    var loader = new THREE.TextureLoader();
    var texture = loader.load('../../imgs/cesped.jpg');
    var textureCielo = loader.load('../../imgs/cielo.png');

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 1); // ajusta estos valores para cambiar la repetición de la textura

    var mat = new THREE.MeshPhysicalMaterial({
      color: 0x05f70d,
      //roughness: 0.5,
      map: texture,
      //metalness: 0.5
    });

    textureCielo.wrapS = THREE.RepeatWrapping;
    textureCielo.wrapT = THREE.RepeatWrapping;
    textureCielo.repeat.set(1, 1); // ajusta estos valores para cambiar la repetición de la textura


    var materialCielo = new THREE.MeshBasicMaterial({
      map: textureCielo,
      side: THREE.DoubleSide
    });

    var cieloMesh = new THREE.Mesh(cielo, materialCielo);
    
    var path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-200, -35, 100),
      new THREE.Vector3(-250, 0, 0),
      new THREE.Vector3(-125, 100, -50),
      new THREE.Vector3(0, 25, 35),
      new THREE.Vector3(50, 50, -25),
      new THREE.Vector3(100, -25, 10),
      new THREE.Vector3(-50, 0, 100),
      new THREE.Vector3(0, 75, 150),
      new THREE.Vector3(50, 100, 175),
      new THREE.Vector3(50, 25, 25),
      new THREE.Vector3(50, 25, -50),
      new THREE.Vector3(100, 50, -75),
      new THREE.Vector3(150, -35, 50),
      new THREE.Vector3(125, 50, 125),
      new THREE.Vector3(-25, -25, 0),
      new THREE.Vector3(-100, 150, -75),
      new THREE.Vector3(-150, 150, 50),
      new THREE.Vector3(-175, 50, 100),
      new THREE.Vector3(-100, 0, 150),
      new THREE.Vector3(-150, -50, 200)
      
      //NO SE REPITE EL PRIMER PUNTO.
    ],true);

    var tubeGeometry = new THREE.TubeGeometry(path, resolucion, 5, divisiones, true);
    //var mat = new THREE.MeshNormalMaterial();

    var tubo = new THREE.Mesh(tubeGeometry, mat);
    this.add(tubo);

    //GUARDAMOS LOS PARÁMETROS DEL TUBO
    this.tubo = tubeGeometry;
    this.path = tubeGeometry.parameters.path;
    this.radio = tubeGeometry.parameters.radius;
    this.segmentos = tubeGeometry.parameters.tubularSegments;

    this.add(cieloMesh);

    // var esfera = new THREE.SphereGeometry(10, 32, 32);
    // var esfera1 = new THREE.Mesh(esfera, mat);

    // esfera1.position.set(-200, -35, 100);
    // this.add(esfera1); 

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

export { Circuito };