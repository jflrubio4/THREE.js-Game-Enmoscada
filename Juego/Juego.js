import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Personaje } from '../Personaje/Personaje.js';
import { Circuito } from '../Circuito/Circuito.js';
import { Mosca } from '../Mosca/Mosca.js';
import { MoscaReina } from '../MoscaReina/MoscaReina.js';
import { Enigma } from '../Enigma/Enigma.js';
import { Bomba } from '../Bomba/Bomba.js';
import { Nitro } from '../Nitro/Nitro.js';
import { Escudo } from '../Escudo/Escudo.js';

 
class Juego extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    this.circuito = new Circuito(gui, "Controles del circuito");
    this.add(this.circuito);

    //PARA ESCALAR TODO
    this.factorEscalado = 0.2;

    this.personaje = new Personaje(gui, "Controles del personaje");
    this.personaje.scale.set(this.factorEscalado, this.factorEscalado, this.factorEscalado);
    //this.mosca.scale.set(this.factorEscalado, this.factorEscalado, this.factorEscalado);

    this.crearObjetos(gui);

    this.geomTubo = this.circuito.getGeometry();
    var mat = new THREE.MeshNormalMaterial();

    this.rot = 0; //PARA LA ROTACION DEL PERSONAJE
    this.rotMosca = 0;
    this.t = 0.0001; //PARA ALMACENAR LA POSICION DEL PERSONAJE.
    this.thirdCamera = false;

    /* var esferaGeom = new THREE.SphereGeometry(2);
    var esfera = new THREE.Mesh(esferaGeom, mat); */

    //OBTENEMOS LA INFORMACION DEL TUBO.
    this.tubo = this.geomTubo;
    this.path = this.geomTubo.parameters.path;
    this.radio = this.geomTubo.parameters.radius;
    this.segmentos = this.geomTubo.parameters.tubularSegments;
  

    //TRES DISTINTOS NODOS POR LOS QUE SE PASA PARA ACABAR CON EL PERSOANJE POSICIONADO.
    this.posSuperficie = new THREE.Object3D();
    this.posSuperficie.add(this.personaje);
    //this.posSuperficie.add(esfera);
    //SE HACE LA TRANSFORMACIÓN Y ACABA EL NODO
    this.posSuperficie.position.y = this.radio + 3.75 * this.factorEscalado; //3.75 ES LA ALTURA DEL PERSONAJE DESDE LA MITAD.

    this.movimientoLateral = new THREE.Object3D();
    this.movimientoLateral.add(this.posSuperficie);
    this.setAnguloRotacion(this.rot); //ESTA FUNCIÓN MODIFICA LA ROTACIÓN EN EL NODO

    this.nodoPosOrientTubo = new THREE.Object3D();
    this.nodoPosOrientTubo.add(this.movimientoLateral);
    this.avanzaPersonaje(this.t);

    this.add(this.nodoPosOrientTubo);
    this.posicionarObjeto(this.mosca); //La posiciona
    this.add(this.mosca);


    document.addEventListener('keydown', (event) => this.onKeyDown(event), false);
  }

  crearObjetos(gui){
    this.mosca = new Mosca(gui, "A");
    this.moscaReina = new MoscaReina(gui, "B");
    this.enigma = new Enigma(gui, "C");
    this.bomba = new Bomba(gui, "D");
    this.nitro = new Nitro(gui, "E");
    this.escudo = new Escudo(gui, "F");
    
    this.moscaReina.position.x = 6;
    this.enigma.position.y = 5;
    this.bomba.position.x = -5;
    this.nitro.position.y = -10;
    this.escudo.position.x = -10;
    this.escudo.position.y = -10;

    this.add(this.mosca);
    this.add(this.moscaReina);
    this.add(this.enigma);
    this.add(this.bomba);
    this.add(this.nitro);
    this.add(this.escudo);
  }

  onKeyDown(event) {
    const keyCode = event.keyCode;

    switch (keyCode) {
      case 37: //Flecha izquierda
          this.setAnguloRotacion(this.rot -= 0.1);
          break;
      case 39: //Flecha derecha
          this.setAnguloRotacion(this.rot += 0.1);
          break;
      case 32: //Barra espaciadora
          this.setThirdCamera()
    }
  }

  setAnguloRotacion(valor){
    this.movimientoLateral.rotation.z = valor;
  }

  setAnguloRotacionObj(valor){
    this.movimientoLateralObj.rotation.z = valor;
  }

  avanzaPersonaje(valor){
    //POSICION INICIAL.
    var posTmp = this.path.getPointAt(valor);
    this.nodoPosOrientTubo.position.copy(posTmp);

    var tangente = this.path.getTangentAt(valor);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(valor * this.segmentos);
    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt(posTmp);
  }

  posicionarObjeto(objeto){
    this.posSuperficieObj = new THREE.Object3D();
    this.posSuperficieObj.add(objeto);
    this.posSuperficieObj.position.y = this.radio + 8 * this.factorEscalado;

    this.movimientoLateralObj = new THREE.Object3D();
    this.movimientoLateralObj.add(this.posSuperficieObj);
    this.setAnguloRotacionObj(this.rotMosca);

    this.nodoPosOrientTuboObj = new THREE.Object3D();
    this.nodoPosOrientTuboObj.add(this.movimientoLateralObj);

    this.add(this.nodoPosOrientTubo);
  }

  getPersonaje(){
    return this.personaje;
  }

  setThirdCamera(){
    this.thirdCamera = !this.thirdCamera;
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

  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
   
    this.t = (this.t + 0.0005) % 1;
    this.rotMosca += 0.1;
    this.avanzaPersonaje(this.t);
    this.setAnguloRotacion(this.rot);
    this.setAnguloRotacionObj(this.rotMosca);
    this.personaje.update();
    
  }
}

export { Juego };