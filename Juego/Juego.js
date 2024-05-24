import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Personaje } from '../Personaje/Personaje.js';
import { Circuito } from '../Circuito/Circuito.js';
import { Mosca } from '../Mosca/Mosca.js'; //HAY QUE PONER "Modelos_Calidad/".
import { MoscaReina } from '../MoscaReina/MoscaReina.js';
import { MoscaAgresiva } from '../MoscaAgresiva/MoscaAgresiva.js';
import { MoscaEnigma } from '../MoscaEnigma/MoscaEnigma.js';
import { Enigma } from '../Enigma/Enigma.js';
import { Bomba } from '../Bomba/Bomba.js';
import { Nitro } from '../Nitro/Nitro.js';
import { Escudo } from '../Escudo/Escudo.js';
import { Venus } from '../Venus/Venus.js';

class GestorBalas {
  constructor() {
    this.almacen = [];
  }

  crearBala() {
    var mat = new THREE.MeshNormalMaterial();
    var sphereGeom = new THREE.SphereGeometry(0.2, 8, 8);
    return new THREE.Mesh(sphereGeom, mat);
  }

  getBala() {
    if (this.almacen.length){
      return this.almacen.pop();
    } else {return this.crearBala()}
  }

  devolverBala(p) {
    this.almacen.push(p);
  }
}

class Juego extends THREE.Object3D {
  constructor(gui,titleGui,scene) {
    super();

    this.myScene = scene;
    
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

    //NODOS PARA LOS OBJETOS
    
    
    /* this.posicionarObjeto(this.enigma, 0.01);
    this.posicionarObjeto(this.moscaReina, 0.02);
    this.posicionarObjeto(this.mosca, 0.01); */

    //this.add(this.mosca);

    var posicion = new THREE.Vector3();
    var direccion = new THREE.Vector3(0,0,1);


    document.addEventListener('keydown', (event) => this.onKeyDown(event), false);

    document.addEventListener('mousedown', (event) => this.onDocumentMouseDown(event), false);

/*     this.candidatos = [this.enigma, this.bomba, this.nitro, this.escudo, this.venus];
    this.voladores = [this.mosca, this.moscaReina, this.moscaAgresiva, this.moscaEnigma]; */

    /* //Balas
    this.gestorBalas = new GestorBalas();
    this.nodoBalas = new THREE.Object3D();
    this.balasADestruir = []; */
    
    /* //NODOS PARA LOS OBJETOS.
    this.add(this.posicionarObjeto(this.enigma, 4, 0, 0.005));
    this.add(this.posicionarObjeto(this.moscaReina, 6, 0, 0.02));
    this.add(this.posicionarObjeto(this.bomba, 0, 0, 0.01));
    this.add(this.posicionarObjeto(this.mosca, 5, this.rotMosca, 0.01)); //La posiciona */

/*     var valores = []; */
    this.moscas = [];
    this.terrestres = [];
    this.objetos = [];

    this.nodosPosSuperficie = []; //VECTOR DE NODOS PARA APLICAR LA ROTACION A CADA NODO INDEPENDIENTEMENTE.
    this.nodosMovLateral = [];
    this.nodosPosOrientacion = [];
    this.rotaciones = [];
    this.valorRotaciones = [];

    for (var i=0; i<10; i++){
      var mosca = new Mosca(gui, i);
      this.moscas.push(mosca);
      this.objetos.push(mosca);
      var moscaReina = new MoscaReina(gui, i + 10);
      this.moscas.push(moscaReina);
      this.objetos.push(moscaReina);
      var moscaAgresiva = new MoscaAgresiva(gui, i + 20);
      this.moscas.push(moscaAgresiva);
      this.objetos.push(moscaAgresiva);
      var moscaEnigma = new MoscaEnigma(gui, i+30);
      this.moscas.push(moscaEnigma);
      this.objetos.push(moscaEnigma);
    }

    for (var i=0; i<8; i++){
      var nitro = new Nitro(gui, i + 60);
      this.terrestres.push(nitro);
      this.objetos.push(nitro);
      var escudo = new Escudo(gui, i + 70);
      this.terrestres.push(escudo);
      this.objetos.push(escudo);
      var venus = new Venus(gui, i+80);
      this.terrestres.push(venus);
      this.objetos.push(venus);
      var enigma = new Enigma(gui, i+90);
      this.terrestres.push(enigma);
      this.objetos.push(enigma);
      var bomba = new Bomba(gui, i + 50);
      this.terrestres.push(bomba);
      this.objetos.push(bomba);
    }

    for (var i=0; i<this.moscas.length; i++){
      var valorAleatorio = Math.random() * (0.01 - 0.001) + 0.001;
      this.rotaciones.push(valorAleatorio);
      this.valorRotaciones.push(0);
    }

    var contador = 0;

    for (var i=0; i<this.moscas.length; i++){
      var altura = Math.random() * (8 - 4) + 4; // un número aleatorio entre 4 y 8
      var rotacion = Math.random() * 2 * Math.PI; // un número aleatorio entre 0 y 2*Math.PI
      var valor = Math.random(); // un número aleatorio entre 0 y 1
      
      this.add(this.posicionarObjeto(contador, this.moscas[i], altura, rotacion, valor));
      contador++;
    }

    for (var i=0; i<this.terrestres.length; i++){
      var rotacion = Math.random() * 2 * Math.PI; // un número aleatorio entre 0 y 2*Math.PI
      var valor = Math.random(); // un número aleatorio entre 0 y 1
      
      this.add(this.posicionarObjeto(contador, this.terrestres[i], 0, rotacion, valor));
      contador++;
    }
    
    /* for (var j=0; j<this.voladores.length; j++){
      var altura = Math.random() * (8 - 4) + 4; // un número aleatorio entre 4 y 8
      var rotacion = Math.random() * 2 * Math.PI; // un número aleatorio entre 0 y 2*Math.PI
      var valor = Math.random(); // un número aleatorio entre 0 y 1
      
      this.add(this.posicionarObjeto(this.voladores[j], altura, rotacion, valor));
    }

    for (var k=0; k<this.candidatos.length; k++){
      var rotacion = Math.random() * 2 * Math.PI; // un número aleatorio entre 0 y 2*Math.PI
      var valor = Math.random(); // un número aleatorio entre 0 y 1
      this.add(this.posicionarObjeto(this.candidatos[k], 0, rotacion, valor));
    } */

    //Rayo para las colisiones terrestres
    this.rayo = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(0,0,1), 0, 500); //BUSCA ELEMENTOS ENTRE 0 Y distancia (10).
    this.personaje.getWorldPosition(posicion);
    this.rayo.set(posicion, direccion.normalize());
    var impactados = this.rayo.intersectObjects(this.terrestres, true);
    if(impactados.length > 0){
      console.log("Colisión");
      this.remove(impactados[0].object);
    }
    
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
          break;
    }
  }

  onDocumentMouseDown(event){
    //Creamos el mouse y el rayo para el picking.
    this.mouse = new THREE.Vector2();
    this.rayoPick = new THREE.Raycaster();

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    this.rayoPick.setFromCamera(this.mouse, this.myScene.getCamera());

    var pickedObjects = this.rayoPick.intersectObjects(this.moscas, true);

    if(pickedObjects.length > 0){
      var selectedObject = pickedObjects[0].object;
      
       var selectedPoint = pickedObjects[0].point;

      console.log("Objeto seleccionado: " + selectedObject.nombre);
    }
  }

  setAnguloRotacion(valor){
    this.movimientoLateral.rotation.z = valor;
  }

  setAnguloRotacionObj(index, valor){
    this.nodosMovLateral[index].rotation.z = valor;
  }

  disparar() {
    var bala = this.gestorBalas.getBala();

    //Configurar posicion, direccion, velocidad...
    //bala.set (...);

    this.nodoBalas.add(bala);
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

  situarObjeto(valor){
    //POSICION INICIAL.
    var posTmp = this.path.getPointAt(valor);
    this.nodoPosOrientTuboObj.position.copy(posTmp);

    var tangente = this.path.getTangentAt(valor);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(valor * this.segmentos);
    this.nodoPosOrientTuboObj.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTuboObj.lookAt(posTmp);
  }

  getPosSuperficie(index, objeto, altura){
    this.posSuperficieObj = new THREE.Object3D();
    this.posSuperficieObj.add(objeto);
    this.posSuperficieObj.position.y = this.radio + altura; //3.75 ES LA ALTURA DEL PERSONAJE DESDE LA MITAD.
    this.nodosPosSuperficie[index] = this.posSuperficieObj;

    return this.nodosPosSuperficie[index];
  }

  getMovimientoLateralObj(index, objeto, altura, angulo){
    this.movimientoLateralObj = new THREE.Object3D();

    var posicion = this.getPosSuperficie(index, objeto, altura);
    this.movimientoLateralObj.add(posicion);

    //this.setAnguloRotacionObj(angulo); //ESTA FUNCIÓN MODIFICA LA ROTACIÓN EN EL NODO
    this.movimientoLateralObj.rotation.z = angulo;
    this.nodosMovLateral[index] = this.movimientoLateralObj;

    return this.nodosMovLateral[index];
  }

  posicionarObjeto(index, objeto, altura, angulo, valorPosicion){
    this.nodoPosOrientTuboObj = new THREE.Object3D();

    var movLateral = this.getMovimientoLateralObj(index, objeto, altura, angulo);
    this.nodoPosOrientTuboObj.add(movLateral);
    this.situarObjeto(valorPosicion);
    this.nodosPosOrientacion[index] = this.nodoPosOrientTuboObj;

    return this.nodosPosOrientacion[index];
  }

  /* posicionarObjeto(objeto, posicion){
    this.posSuperficieObj = new THREE.Object3D();
    this.posSuperficieObj.add(objeto);
    this.posSuperficieObj.position.y = this.radio + 5;

    this.movimientoLateralObj = new THREE.Object3D();
    this.movimientoLateralObj.add(this.posSuperficieObj);
    this.setAnguloRotacionObj(this.rotMosca);

    this.nodoPosOrientTuboObj = new THREE.Object3D();
    this.nodoPosOrientTuboObj.add(this.movimientoLateralObj);
    this.situarObjeto(posicion);

    this.add(this.nodoPosOrientTuboObj);
  } */

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
   
    //0
    this.t = (this.t + 0.00005) % 1;
    //this.rotMosca += 0.01;
    this.avanzaPersonaje(this.t);
    this.setAnguloRotacion(this.rot);
    for (var i=0; i < this.moscas.length; i++){
      this.valorRotaciones[i] += this.rotaciones[i];
      this.setAnguloRotacionObj(i, this.valorRotaciones[i]);
    }
    this.personaje.update();
    
    
    //COLISIONES.
    var posicion = new THREE.Vector3();
    var direccion = new THREE.Vector3(0,0,1);

    this.personaje.getWorldPosition(posicion);
    this.rayo.set(posicion, direccion.normalize());
    var impactados = this.rayo.intersectObjects(this.terrestres, true);
    if(impactados.length > 0){
      console.log("Colisión de rayos.");
      impactados[0].object.parent.remove(impactados[0].object);
      //this.t = (this.t - 0.0015) % 1;
    }

    /* //BALAS
    var bala;
    for (var i=0; i<this.nodoBalas.children.length; i++){
      bala = this.nodoBalas.children[i];
      //bala.update();
      //Si la bala llega al fin del recorrido, es decir, se necesita descartar, se manda a destruir
      if (bala.debeDesaparecer())
        this.balasADestruir.push(bala);
    }

    //Se descartan las balas innecesarias, pero se reciclan, no destruyen
    for (var i=0; i<this.balasADestruir.length; i++){
      bala = this.balasADestruir[i];
      this.nodoBalas.remove(bala);
      this.gestorBalas.devolverBala(bala);
    }

    this.balasADestruir.length = 0; */
  }
}

export { Juego };