import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
 
class Escudo extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    this.nombre = 'Escudo';

    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('escudo/escudo.mtl',
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load('escudo/escudo.obj',
          (object) => {
            this.resultadoMesh1 = object;
            this.resultadoMesh1.scale.set(0.025,0.025,0.025);
            this.resultadoMesh1.rotateX(-Math.PI/2);
            this.resultadoMesh1.translateZ(1.9);
            this.resultadoMesh1.translateY(0.75);
            this.add(this.resultadoMesh1);
            
            /* //PATRA LAS COLISIONES.
            this.cajaEnvolvente = new THREE.Box3();
            this.cajaEnvolvente.setFromObject(this.resultadoMesh1);
            this.cajaEnvolvente.translate(new THREE.Vector3(0,0,1.5));

            //PARA VISUALIZAR LA CAJA ENVOLVENTE.
            var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
            this.add(cajaEnvolventeVsible);    */  
          }, null, null);
      });
      
     
    

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
        this.resultadoMesh1.rotation.x += 0.01;
        this.resultadoMesh1.rotation.y += 0.01;
        
        this.resultadoMesh2.rotation.x -= 0.01;
        this.resultadoMesh2.rotation.z -= 0.01;
    }
    
  }
}

export { Escudo };