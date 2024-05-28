import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class Bomba extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    //DEFINIMOS LE MATERIAL.
    //DEFINIMOS LE MATERIAL.
    var matBomba = new THREE.MeshStandardMaterial({color: 0x444444});
    matBomba.bumpMap = new THREE.TextureLoader().load('../../imgs/rock-texture.jpg');
    //textureCuerda.wrapS = THREE.RepeatWrapping;
    //textureCuerda.wrapT = THREE.RepeatWrapping;
    /* textureAlas.offset.set(-0.5, 0.5);
    textureAlas.wrapS = THREE.RepeatWrapping;
    textureAlas.wrapT = THREE.RepeatWrapping; */

    //var matCuerda = new THREE.MeshStandardMaterial({map: textureCuerda});

    
    //DEFINIMOS EL MATERIAL.
    // var matBomba = new THREE.MeshPhysicalMaterial({
    //   color: 0x444444, // color base
    //   map: new THREE.TextureLoader().load('../../imgs/bomba.jpg'),
    //   /* roughness: 1,
    //   clearcoat: 1.0, // intensidad del clearcoat, 1.0 es el máximo
    //   clearcoatRoughness: 0.3 // rugosidad del clearcoat, 0.3 es un valor medio */
    // });

    var matCuerda = new THREE.MeshPhysicalMaterial({
      map: new THREE.TextureLoader().load('../../imgs/cuerda.jpg'),
    });

    var cuerpoGeom = new THREE.SphereGeometry(2, 32, 32);
    var cuerpo = new THREE.Mesh(cuerpoGeom, matBomba);

    var topeGeom = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    topeGeom.translate(0,4,0);
    var topeMesh = new THREE.Mesh(topeGeom, matBomba);

    var torusGeometry = new THREE.TorusGeometry(2, 0.7, 32, 32); //Hasta 60 grados
    //0.5 de la base y 1.5 para situarlo encima de la esfera
    //torusGeometry.translate(-2,4,0);
    var toro = new THREE.Mesh(torusGeometry, matCuerda);

    var caja = new THREE.BoxGeometry(10,3,2);
    var caja2 = new THREE.BoxGeometry(10,10,2);
    caja.translate(0,-1.5,0);
    caja2.translate(-5,0,0);
    var cajaMesh = new THREE.Mesh(caja, matCuerda);
    var cajaMesh2 = new THREE.Mesh(caja2, matCuerda);

    var csg = new CSG();
    csg.subtract([toro, cajaMesh]);
    csg.subtract([cajaMesh2]);
    var toroCortado = csg.toMesh();

    toroCortado.position.set(1,2.25,0);

    // var tapaToro = new THREE.CylinderGeometry(0.7, 0.7, 0.01, 32);
    // tapaToro.rotateY(-Math.PI/2);
    // tapaToro.rotateZ(Math.PI/2);
    // tapaToro.translate(-2,6,0);
    // var tapaToroMesh = new THREE.Mesh(tapaToro, matCuerda);
    
    //this.add(tapaToroMesh);


    this.bombaFinal = new THREE.Group();
    topeMesh.scale.set(0.5,0.5,0.5);
    topeMesh.rotation.set(0,Math.PI,0);
    this.bombaFinal.add(topeMesh);
    toroCortado.scale.set(0.5,0.5,0.5);
    toroCortado.rotation.set(0,Math.PI,0);
    this.bombaFinal.add(toroCortado);
    this.bombaFinal.add(cuerpo);


   /*  var fuseCSG = new CSG();
    fuseCSG.union([topeMesh, toroCortado]);
    var fuse = fuseCSG.toMesh();
    fuse.scale.set(0.5,0.5,0.5);
    fuse.rotation.set(0,Math.PI,Math.PI/6);

    var bombaCSG = new CSG();
    bombaCSG.union([fuse, cuerpo]);
    var bomba = bombaCSG.toMesh(); */


    this.add(this.bombaFinal);
    
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
    
  }
}

export { Bomba };