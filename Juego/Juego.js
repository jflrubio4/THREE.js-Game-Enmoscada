import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'

 
class Juego extends THREE.Object3D {
  constructor(gui,titleGui, circuito, personaje) {
    super();

    this.cañon = new THREE.Group();

    this.circuito = circuito;
    /* this.personaje = personaje; */

    //PARAMETROS DEL TUBO
    this.tubo = this.circuito.tubo;
    this.path = this.circuito.path;
    this.radio = this.circuito.radio;
    this.segmentos = this.circuito.segmentos;

    this.rot = 0; //PARA LA ROTACION DEL PERSONAJE
    this.t = 0; //PARA ALMACENAR LA POSICION DEL PERSONAJE.

    //TRES DISTINTOS NODOS POR LOS QUE SE PASA PARA ACABAR CON EL PERSOANJE POSICIONADO.
    this.nodoPosOrientTubo = new THREE.Object3D();
    this.movimientoLateral = new THREE.Object3D();
    this.posSuperficie = new THREE.Object3D();

    this.posSuperficie.position.y = this.radio + 3.75;

    this.add(this.nodoPosOrientTubo);
    this.nodoPosOrientTubo.add(this.movimientoLateral);
    this.movimientoLateral.add(this.posSuperficie);
    this.movimientoLateral.rotateZ(this.rot);
    this.posSuperficie.add(this.personaje);

    //POSICION INICIAL.
    var posTmp = this.path.getPointAt(this.t);
    this.nodoPosOrientTubo.position.copy(posTmp);
    var tangente = this.path.getTangentAt(this.t);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(this.t * this.segmentos);
    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt(posTmp);
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);



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

    //ACTUALIZAMOS T
    this.t += 0.0001;
    if (this.t > 1) {
      this.t = 0;
    }

    //ACTUALIZAMOS LA ROTACION.
    this.rot += 0.00001%Math.PI*2;

    var posTmp = this.path.getPointAt(this.t);
    this.nodoPosOrientTubo.position.copy(posTmp);
    var tangente = this.path.getTangentAt(this.t);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(this.t * this.segmentos);
    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt(posTmp);



    /* //PARA ROTAR EL OBEJTO.
    if(this.rotar){
        this.resultadoMesh1.rotation.x += 0.01;
        this.resultadoMesh1.rotation.y += 0.01;
        
        this.resultadoMesh2.rotation.x -= 0.01;
        this.resultadoMesh2.rotation.z -= 0.01;
    } */
    
  }
}

export { Juego };