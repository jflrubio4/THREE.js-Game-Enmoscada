import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Personaje } from '../Personaje/Personaje.js';
import { Circuito } from '../Circuito/Circuito.js';
import { Mosca } from '../Mosca/Mosca.js'; //HAY QUE PONER "Modelos_Calidad/".
import { MoscaReina } from '../MoscaReina/MoscaReina.js';
import { MoscaAgresiva } from '../MoscaAgresiva/MoscaAgresiva.js';
import { MoscaEnigma } from '../MoscaEnigma/MoscaEnigma.js';
import { MoscaLuz} from '../MoscaLuz/MoscaLuz.js';
import { Enigma } from '../Enigma/Enigma.js';
import { Bomba } from '../Bomba/Bomba.js';
import { Nitro } from '../Nitro/Nitro.js';
import { Escudo } from '../Escudo/Escudo.js';
import { Venus } from '../Venus/Venus.js';
import { BolaPinchos} from '../BolaPinchos/BolaPinchos.js';
import { PlanchaPinchos} from '../PlanchaPinchos/PlanchaPinchos.js';

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

    //PARA LA LUZ CON LAS BOMBAS.
    this.clock = new THREE.Clock();

    //LA VELOCIDAD INICIAL DEL PERSONAJE.
    this.rate = 0.00005;

    //VIDAS DEL PERSONAJE.
    this.vidas = 6;
    this.myScene.actualizarVidas(this.vidas);

    //PUNTUACION DEL PERSONAJE.
    this.puntuacion = 0;

    //FRAMES DE INVENCIBILIDAD.
    this.lastCollisionTime = 0;
    this.collisionCooldown = 2000; // tiempo en milisegundos
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    this.circuito = new Circuito();
    this.add(this.circuito);

    //PARA ESCALAR TODO
    this.factorEscalado = 0.2;

    this.personaje = new Personaje();
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

    for (var i=0; i<1; i++){ //A 100000000000000000000000000000000000
      var mosca = new Mosca();
      this.moscas.push(mosca);
      this.objetos.push(mosca);
      var moscaReina = new MoscaReina();
      this.moscas.push(moscaReina);
      this.objetos.push(moscaReina);
      var moscaAgresiva = new MoscaAgresiva();
      this.moscas.push(moscaAgresiva);
      this.objetos.push(moscaAgresiva);
      var moscaEnigma = new MoscaEnigma();
      this.moscas.push(moscaEnigma);
      this.objetos.push(moscaEnigma);
      var moscaLuz = new MoscaLuz();
      this.moscas.push(moscaLuz);
      this.objetos.push(moscaLuz);
    }

    for (var i=0; i<1; i++){ //A 8888888888888888888888888888888888888888888888888888
      var nitro = new Nitro();
      this.terrestres.push(nitro);
      this.objetos.push(nitro);
      var escudo = new Escudo();
      this.terrestres.push(escudo);
      this.objetos.push(escudo);
      var venus = new Venus();
      this.terrestres.push(venus);
      this.objetos.push(venus);
      var enigma = new Enigma();
      this.terrestres.push(enigma);
      this.objetos.push(enigma);
      var bomba = new Bomba();
      this.terrestres.push(bomba);
      this.objetos.push(bomba);
      var bolaPinchos = new BolaPinchos();
      this.terrestres.push(bolaPinchos);
      this.objetos.push(bolaPinchos);
      var planchaPinchos = new PlanchaPinchos();
      this.terrestres.push(planchaPinchos);
      this.objetos.push(planchaPinchos);

      planchaPinchos.name = 'Plancha de pinchos';
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

    //POSICIONAR LOS OBJETOS MANUALMENTE
    var pinchos = new PlanchaPinchos();
    this.add(this.posicionarObjeto(contador, pinchos, 0, 0, 0.01))
    contador++;
    this.terrestres.push(pinchos);
    this.objetos.push(pinchos);

    var bola = new BolaPinchos();
    this.add(this.posicionarObjeto(contador, bola, 0, 0, 0.02))
    contador++;
    this.terrestres.push(bola);
    this.objetos.push(bola);

    var bomb = new Bomba();
    this.add(this.posicionarObjeto(contador, bomb, 0, 0, 0.03))
    contador++;
    this.terrestres.push(bomb);
    this.objetos.push(bomb);

    var enigma = new Enigma();
    this.add(this.posicionarObjeto(contador, enigma, 0, 0, 0.04))
    contador++;
    this.terrestres.push(enigma);
    this.objetos.push(enigma);

    var venus = new Venus();
    this.add(this.posicionarObjeto(contador, venus, 0, 0, 0.05))
    contador++;
    this.terrestres.push(venus);
    this.objetos.push(venus);

    var escudo = new Escudo();
    this.add(this.posicionarObjeto(contador, escudo, 0, 0, 0.06))
    contador++;
    this.terrestres.push(escudo);
    this.objetos.push(escudo);

    var nitro = new Nitro();
    this.add(this.posicionarObjeto(contador, nitro, 0, 0, 0.07))
    contador++;
    this.terrestres.push(nitro);
    this.objetos.push(nitro);

    var moscaN = new Mosca();
    this.add(this.posicionarObjeto(contador, moscaN, 4, 0, 0.01))
    contador++;
    this.moscas.push(moscaN);

    var moscaR = new MoscaReina();
    this.add(this.posicionarObjeto(contador, moscaR, 4, 0, 0.02))
    contador++;
    this.moscas.push(moscaR);

    var moscaA = new MoscaAgresiva();
    this.add(this.posicionarObjeto(contador, moscaA, 4, 0, 0.03))
    contador++;
    this.moscas.push(moscaA);

    var moscaE = new MoscaEnigma();
    this.add(this.posicionarObjeto(contador, moscaE, 4, 0, 0.04))
    contador++;
    this.moscas.push(moscaE);

    var moscaL = new MoscaLuz();
    this.add(this.posicionarObjeto(contador, moscaL, 4, 0, 0.05))
    contador++;
    this.moscas.push(moscaL);


    //Rayo para las colisiones terrestres
    this.rayo = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(0,0,1), 0, 500); //BUSCA ELEMENTOS ENTRE 0 Y distancia (10).
    this.personaje.getWorldPosition(posicion);
    this.rayo.set(posicion, direccion.normalize());
    var impactados = this.rayo.intersectObjects(this.terrestres, true);
    if(impactados.length > 0){
      console.log("Colisión");
      this.remove(impactados[0].object);
    }

    this.bolaLuz = new THREE.SphereGeometry(5, 32, 32);
    this.matBolaLuz1 = new THREE.MeshBasicMaterial({color: 0x0d00ff});
    this.matBolaLuz2 = new THREE.MeshBasicMaterial({color: 0xff00a2});
    this.matBolaLuz3 = new THREE.MeshBasicMaterial({color: 0xff0000});
    this.matBolaLuz4 = new THREE.MeshBasicMaterial({color: 0xbe03fc});

    this.bolaLuzMesh1 = new THREE.Mesh(this.bolaLuz, this.matBolaLuz1);
    this.bolaLuzMesh2 = new THREE.Mesh(this.bolaLuz, this.matBolaLuz2);
    this.bolaLuzMesh3 = new THREE.Mesh(this.bolaLuz, this.matBolaLuz3);
    this.bolaLuzMesh4 = new THREE.Mesh(this.bolaLuz, this.matBolaLuz4);

    this.bolaLuzMesh1.position.set(-240, 20, 10);
    this.bolaLuzMesh2.position.set(125, 70, 125);
    this.bolaLuzMesh3.position.set(-80, 20, 170);
    this.bolaLuzMesh4.position.set(0, 70, 35);

    this.add(this.bolaLuzMesh1);
    this.add(this.bolaLuzMesh2);
    this.add(this.bolaLuzMesh3);
    this.add(this.bolaLuzMesh4);
    
  }

  getVidas() {
    return this.vidas;
  }

  onKeyDown(event) {
    const keyCode = event.keyCode;

    switch (keyCode) {
      case 65: //Flecha izquierda
          this.setAnguloRotacion(this.rot -= 0.1);
          break;
      case 68: //Flecha derecha
          this.setAnguloRotacion(this.rot += 0.1);
          break;
      case 32: //Barra espaciadora
          this.setThirdCamera()
          break;
    }
  }

  //COLISONES CON OBJETOS VOLADORES.
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

      var padre = pickedObjects[0].object.parent;
      var abuelo = padre.parent;

      if(abuelo instanceof Mosca){
        this.puntuacion += 1;
        this.myScene.sumarPuntuacion(this.puntuacion);
      }
      else if(abuelo instanceof MoscaReina){
        abuelo.reducirVida();
        if(abuelo.vida == 0){
          //La eliminamos.
          abuelo.remove(padre);
          
          //Sumamos la puntuacion al matarla.
          this.puntuacion += 3;
          this.myScene.sumarPuntuacion(this.puntuacion);
        }
      }
      else if(abuelo instanceof MoscaAgresiva){
        this.puntuacion += 5;
        this.myScene.sumarPuntuacion(this.puntuacion);
      }
      else if(abuelo instanceof MoscaEnigma){}
      else if(abuelo instanceof MoscaLuz){}

      //PARA ELIMINAR LOS OBJETOS VOLADORES UNA VEZ DISPARADOS.
      /* if(abuelo != null){
        abuelo.remove(padre);
      } */

      /* if (this.impactos.length > 0) {
        let object = this.impactos[0].object;
        while (object.parent && object.parent.parent && !(object instanceof Ovni  object instanceof Moneda  object instanceof Pinchos  object instanceof Escudo  object instanceof Puertas)) {
          object = object.parent;
        }
        const originalObject = object;

        if (!this.objetosConColision.has(originalObject)) { // Verificar si el objeto ya ha sido colisionado
          console.log(originalObject.userData.nombre);
          originalObject.colision(this);
          this.objetosConColision.add(originalObject); // Agregar el objeto al conjunto de objetos colisionados
        }
      } */

      console.log("Objeto seleccionado: " + abuelo.userData.name);
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
    this.t = (this.t + this.rate) % 1;
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

    //ACTUALIZAMOS EL TIEMPO DE LA ÚLTIMA COLISIÓN.
    var currentTime = Date.now();

    this.personaje.getWorldPosition(posicion);
    this.rayo.set(posicion, direccion.normalize());
    var impactados = this.rayo.intersectObjects(this.terrestres, true);
    if(currentTime - this.lastCollisionTime > this.collisionCooldown && impactados.length > 0){
      console.log("Colisión de rayos.");

      this.lastCollisionTime = currentTime; //ACTUALIZAMOS EL TIEMPO DE LA ÚLTIMA COLISIÓN.

      var padre = impactados[0].object.parent;
      var abuelo = padre.parent;

      //RESTAMOS UNA VIDA
      this.vidas--;
      this.myScene.actualizarVidas(this.vidas); //HAY QUE ARREGLAR LAS COLISIONES (QUITA 2 VIDAS POR COLISION).


      if (abuelo instanceof Bomba){
        console.log("TIENE UNA BOMBA");

        this.fadeOut = true;
        this.waitDuration = 5; // Duración de la espera en segundos
        this.timer = 0; // Variable de temporizador

        this.clock = new THREE.Clock();
        this.deltaTime = this.clock.getDelta(); // Tiempo transcurrido desde el último frame
        this.timer += this.deltaTime;

        if (this.fadeOut) {
          this.lightIntensity = 0;
          this.fadeOut = false;
          this.timer = 0;
        }
        this.myScene.setLuzPersonaje(this.lightIntensity);

        //this.myScene.asignarFondo("imgs/noche.mp4");

        //REDUCE LA VELOCIDAD DEL PERSONAJE.
        this.rate = 0.00001;
      }

      else{
        impactados[0].object.parent.remove(impactados[0].object);
      }

      if(abuelo != null){
        abuelo.remove(padre);
      }
    }

    this.deltaTime = this.clock.getDelta(); // Tiempo transcurrido desde el último frame
    this.timer += this.deltaTime;

    if (!this.fadeOut && this.timer >= this.waitDuration) {
      this.lightIntensity = 20000;
      this.fadeOut = true;
      this.timer = 0;
      this.myScene.setLuzPersonaje(this.lightIntensity);

      this.rate = 0.00005; //Vuelve a la velocidad normal.

      //this.myScene.asignarFondo("imgs/videoFondo.mp4"); //Vuelve al fondo original.
    }

    // if (impactados.length > 0) { 
    //   let object = impactados[0].object;
    //   while (object.parent && object.parent.parent && object instanceof Bomba) {
    //     object = object.parent;
    //   }
    //   const originalObject = object;
 
    //   // Lo probamos a ver?
    //   //if (!this.objetosConColision.has(originalObject)) { // Verificar si el objeto ya ha sido colisionado
    //     console.log(originalObject.userData.name);
    //     //originalObject.colision(this);
    //     //this.objetosConColision.add(originalObject); // Agregar el objeto al conjunto de objetos colisionados
    //   //} 
    // }

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