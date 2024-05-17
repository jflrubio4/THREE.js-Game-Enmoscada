import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Enigma } from '../Enigma/Enigma.js';
 
class MoscaEnigma extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    //VALORES PARA LAS ROTACIONES.
    this.topeAlaI = false;
    this.topeAlaD = false;
    this.rotar = true;
    
    //DEFINIMOS LE MATERIAL.
    var mat = new THREE.MeshNormalMaterial();

    //CUERPO MOSCA
    var cuerpoGeom = new THREE.SphereGeometry(0.7, 32, 32);
    var cuerpo = new THREE.Mesh(cuerpoGeom, mat);

    //ALAS
    var shape = new THREE.Shape();
    //shape.lineTo(-1,1);
    shape.moveTo(0,0);
    shape.quadraticCurveTo(-1,0.75, -1.5,0.5);
    shape.quadraticCurveTo(-2.5,0, -1.5,-0.5);
    //shape.lineTo(0,0)
    shape.quadraticCurveTo(-1,-0.75, 0,0);

    var options = {
      depth: 0.2, 
      steps: 10, 
      curveSegments: 32, 
      bevelSegments: 12,
      bevelThickness: 0.25,
      bevelSize: 0.6
    };

    var alaIGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaIGeometry.scale(0.5,0.5,0.5);
    alaIGeometry.translate(-0.8,0,-0.05);
    this.alaI = new THREE.Mesh(alaIGeometry, mat);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.5,0.5,0.5);
    alaDGeometry.translate(-0.8,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, mat);

    this.enigma = new Enigma(gui, "Controles Enigma", 100);
    this.enigma.position.set(0,0.9,0);
    this.enigma.scale.set(0.5,0.5,0.5);
    this.enigma.rotation.set(0,Math.PI/2,0);


    //UNIMOS LAS PARTES DEL BRAZO.
    var moscaCSG = new CSG();
    moscaCSG.union([cuerpo, this.alaI, this.alaD]);
    var mosca = moscaCSG.toMesh();
    mosca.rotateY(Math.PI/2);

    this.add(mosca);
    this.add(this.enigma);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(mosca);

    //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVisible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVisible);

    /* //PATRA LAS COLISIONES.
    this.cajaEnvolventeEnigma = new THREE.Box3();
    this.cajaEnvolventeEnigma.setFromObject(enigma);

    //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeEnigmaVisible = new THREE.Box3Helper(this.cajaEnvolventeEnigma, 0x00ff00);
    this.add(cajaEnvolventeEnigmaVisible); */

    /* this.add(cuerpo);
    this.add(this.alaI);
    this.add(this.alaD);
    this.add(enigma); */
    
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

  funcionAnimar(value){
    if(this.alaI.rotation.z < 0.055 && !this.topeAlaI){
      this.alaI.rotation.z += 0.01;
      if(this.alaI.rotation.z >= 0.055){
        this.topeAlaI = true;
      }
    }
    else{
      this.alaI.rotation.z -= 0.01;
      if(this.alaI.rotation.z <= -0.055){
        this.topeAlaI = false;
      }
    }

    if(this.alaD.rotation.z < 0.055 && !this.topeAlaD){
      this.alaD.rotation.z += 0.01;
      if(this.alaD.rotation.z >= 0.055){
        this.topeAlaD = true;
      }
    }
    else{
      this.alaD.rotation.z -= 0.01;
      if(this.alaD.rotation.z <= -0.055){
        this.topeAlaD = false;
      }
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

    //this.funcionAnimar(this.rotar);
    
  }
}

export { MoscaEnigma };