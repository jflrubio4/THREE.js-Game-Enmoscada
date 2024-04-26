import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class Personaje extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    this.tope = false;
    
    //DEFINIMOS LE MATERIAL.
    var mat = new THREE.MeshNormalMaterial();
    
    //CREAMOS LAS PARTES.

    //BRAZOS:
    var manoGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    var brazoGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    var hombroGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    manoGeometry.translate(0, -3.5, 0);
    brazoGeometry.translate(0, -2, 0);
    hombroGeometry.translate(0, -0.5, 0);

    //COLOCAMOS EL PRIMER BRAZO
    var mano1 = new THREE.Mesh(manoGeometry, mat);

    var brazo1 = new THREE.Mesh(brazoGeometry, mat);

    var hombro1 = new THREE.Mesh(hombroGeometry, mat);

    //UNIMOS LAS PARTES DEL BRAZO.
    var cgsBrazo1 = new CSG();
    cgsBrazo1.union([mano1, brazo1, hombro1]);
    this.brazoIzquierda = cgsBrazo1.toMesh();

    this.add(this.brazoIzquierda);

    /* //COLOCAMOS EL SEGUNDO BRAZO
    var mano2 = new THREE.Mesh(articulacionGeometry, mat);
    this.add(mano2);
    
    var hombro2 = new THREE.Mesh(articulacionGeometry, mat);
    this.add(hombro2);
    
    var brazo2 = new THREE.Mesh(brazoGeometry, mat);
    this.add(brazo2); */

    //TORSO:
    var torsoGeometry = new THREE.CylinderGeometry(2, 2, 2, 32);

    var torso = new THREE.Mesh(torsoGeometry, mat);

    //PIERNAS:
    var piernaGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);

    var pierna1 = new THREE.Mesh(piernaGeometry, mat);
    var pierna2 = new THREE.Mesh(piernaGeometry, mat);

    //PIES:
    var tobilloGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    var pieGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    tobilloGeometry.rotateX(Math.PI/2);
    pieGeometry.translate(0, 0, 0.5);

    var tobillo = new THREE.Mesh(tobilloGeometry, mat);
    var pie = new THREE.Mesh(pieGeometry, mat);

    var csg = new CSG();
    csg.union([tobillo, pie]);
    var tobilloPie1 = csg.toMesh();
    var tobilloPie2 = csg.toMesh(); //ARREGLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAR

    //POSICIONAMOS LAS PARTES.
    




    


    this.rotar = false;
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

    //PARA ROTAR EL OBEJTO.
    if(this.rotar){
      if(this.brazoIzquierda.rotation.x < Math.PI/4 && !this.tope){
        this.brazoIzquierda.rotation.x += 0.05;
        if(this.brazoIzquierda.rotation.x == Math.PI/4){
          this.tope = true;
        }
      }
      else{
        this.brazoIzquierda.rotation.x -= 0.05;
        if(this.brazoIzquierda.rotation.x == -Math.PI/4){
          this.tope = false;
        }
      }
    }
    
  }
}

export { Personaje };