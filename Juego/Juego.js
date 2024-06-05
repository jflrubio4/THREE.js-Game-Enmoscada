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
import { BolaEscudo } from '../BolaEscudo/BolaEscudo.js';

class Juego extends THREE.Object3D {
  constructor(scene) {
    super();

    /*********************************************************************************************************/
    /* VARIABLES GLOBALES */
    /*********************************************************************************************************/
    this.myScene = scene;

    //PARA LA LUZ CON LAS BOMBAS.
    this.clock = new THREE.Clock();

    //LA VELOCIDAD INICIAL DEL PERSONAJE.
    this.rate = 0.0001;

    //VELOCIDAD DE ANIMACIÓN DEL PERSONAJE
    this.velocidadAnim = 15;

    //VIDAS DEL PERSONAJE.
    this.vidas = 6;
    this.myScene.actualizarVidas(this.vidas);

    //PUNTUACION DEL PERSONAJE Y EL MULTIPLLICADOR.
    this.puntuacion = 0;
    this.multiplicador = 1;

    //FRAMES DE INVENCIBILIDAD.
    this.lastCollisionTime = 0;
    this.collisionCooldown = 2000; // tiempo en milisegundos

    //VARIABLES DE MOVIMIENTO EN EL JUEGO
    this.rot = 0; //PARA LA ROTACION DEL PERSONAJE
    this.rotMosca = 0;
    this.t = 0.0001; //PARA ALMACENAR LA POSICION DEL PERSONAJE.

    //CÁMARA EN TERCERA PERSONA
    this.thirdCamera = false;

    //PROTECCIÓN DEL ESCUDO
    this.protegido = false;

    //FACTOR PARA ESCALAR TODO A DIMENSIONES DEL CIRCUITO
    this.factorEscalado = 0.2;

    //EFECTOS DE LOS ENIGMAS.
    this.efectosEnigma = ['inverso', 'x2', 'daño', 'cura', 'lento', 'rapido'];
    this.efectoActual = '';
    this.mezclarEfectos(); //Mezclamos los efectos para que no se repitan.

    //GESTIONAR LA ROTACIÓN DE LAS MOSCAS
    this.rotaciones = []; //Velocidades de rotación
    this.valorRotaciones = []; //Posición alrededor del tubo en la que empiezan

    //VECTOR DE NODOS PARA APLICAR LA ROTACION A CADA NODO INDEPENDIENTEMENTE.
    this.nodosPosSuperficie = [];
    this.nodosMovLateral = [];
    this.nodosPosOrientacion = [];

    //VECTORES DE OBJETOS PARA COLISIONES Y PICKING
    this.moscas = [];
    this.terrestres = [];
    this.objetos = [];
    
    /*********************************************************************************************************/
    /* CREACIÓN DE OBJETOS */
    /*********************************************************************************************************/
    this.circuito = new Circuito();
    this.add(this.circuito);

    this.bolaEscudo = new BolaEscudo();

    this.personaje = new Personaje();
    this.personaje.scale.set(this.factorEscalado, this.factorEscalado, this.factorEscalado);
    //this.mosca.scale.set(this.factorEscalado, this.factorEscalado, this.factorEscalado);

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

    this.geomTubo = this.circuito.getGeometry();
    //OBTENEMOS LA INFORMACION DEL TUBO.
    this.tubo = this.geomTubo;
    this.path = this.geomTubo.parameters.path;
    this.radio = this.geomTubo.parameters.radius;
    this.segmentos = this.geomTubo.parameters.tubularSegments;

    for (var i=0; i<8; i++){
      var mosca = new Mosca();
      this.moscas.push(mosca);
      this.objetos.push(mosca);
    }

    for (var i=0; i<3; i++){
      var moscaEnigma = new MoscaEnigma();
      this.moscas.push(moscaEnigma);
      this.objetos.push(moscaEnigma);
      var moscaLuz = new MoscaLuz();
      this.moscas.push(moscaLuz);
      this.objetos.push(moscaLuz);
    }

    for (var i=0; i<6; i++){
      var moscaReina = new MoscaReina();
      this.moscas.push(moscaReina);
      this.objetos.push(moscaReina);
    }

    for (var i=0; i<3; i++){
      var moscaAgresiva = new MoscaAgresiva();
      this.moscas.push(moscaAgresiva);
      this.objetos.push(moscaAgresiva);
    }

    for (var i=0; i<4; i++){
      var nitro = new Nitro();
      this.terrestres.push(nitro);
      this.objetos.push(nitro);
      var escudo = new Escudo();
      this.terrestres.push(escudo);
      this.objetos.push(escudo);
      var venus = new Venus();
      this.terrestres.push(venus);
      var bomba = new Bomba();
      this.terrestres.push(bomba);
      this.objetos.push(bomba);
    }

    for(var i=0; i<7; i++){
      this.objetos.push(venus);
      var enigma = new Enigma();
      this.terrestres.push(enigma);
      this.objetos.push(enigma);
    }

    for (var i=0; i<8; i++){ 
      var bolaPinchos = new BolaPinchos();
      this.terrestres.push(bolaPinchos);
      this.objetos.push(bolaPinchos);
      var planchaPinchos = new PlanchaPinchos();
      this.terrestres.push(planchaPinchos);
      this.objetos.push(planchaPinchos);
    }
  

    /*********************************************************************************************************/
    /* POSICIONAMIENTO DE LOS MODELOS */
    /*********************************************************************************************************/
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


    //Para la rotación de las moscas en general
    for (var i=0; i<this.moscas.length - 9; i++){
      var valorAleatorio = Math.random() * (0.05 - 0.005) + 0.005;
      this.rotaciones.push(valorAleatorio);
      this.valorRotaciones.push(0);
    }

    //Para la velocidad de rotación de las moscas reina
    for (var i=this.moscas.length - 9; i<this.moscas.length - 3; i++){
      var valorAleatorio = Math.random() * (0.005 - 0.001) + 0.001;
      this.rotaciones.push(valorAleatorio);
      this.valorRotaciones.push(0);
    }
    
    //Para la velocidad de rotación de las moscas agresivas
    for (var i=this.moscas.length - 3; i<this.moscas.length; i++){
      var valorAleatorio = Math.random() * (0.1 - 0.05) + 0.05;
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

    //POSICIONAR LOS OBJETOS MANUALMENTE
    var nitro = new Nitro();
    this.add(this.posicionarObjeto(contador, nitro, 0, 0, 0.012))
    contador++;
    this.terrestres.push(nitro);
    this.objetos.push(nitro);

    var bomb = new Bomba();
    this.add(this.posicionarObjeto(contador, bomb, 0, 0, 0.024))
    contador++;
    this.terrestres.push(bomb);
    this.objetos.push(bomb);

    var pinchos = new PlanchaPinchos();
    this.add(this.posicionarObjeto(contador, pinchos, 0, 0, 0.036))
    contador++;
    this.terrestres.push(pinchos);
    this.objetos.push(pinchos);

    var escudo = new Escudo();
    this.add(this.posicionarObjeto(contador, escudo, 0, 0, 0.048))
    contador++;
    this.terrestres.push(escudo);
    this.objetos.push(escudo);

    var bola = new BolaPinchos();
    this.add(this.posicionarObjeto(contador, bola, 0, 0, 0.06))
    contador++;
    this.terrestres.push(bola);
    this.objetos.push(bola);

    var venus = new Venus();
    this.add(this.posicionarObjeto(contador, venus, 0, 0, 0.072))
    contador++;
    this.terrestres.push(venus);
    this.objetos.push(venus);

    var enigma = new Enigma();
    this.add(this.posicionarObjeto(contador, enigma, 0, 0, 0.084))
    contador++;
    this.terrestres.push(enigma);
    this.objetos.push(enigma);

    var moscaN = new Mosca();
    var valorAleatorio = Math.random() * (0.05 - 0.005) + 0.005;
    this.rotaciones.push(valorAleatorio);
    this.add(this.posicionarObjeto(contador, moscaN, 4, 0, 0.015))
    contador++;
    this.moscas.push(moscaN);

    var moscaR = new MoscaReina();
    valorAleatorio = Math.random() * (0.005 - 0.001) + 0.001;
    this.rotaciones.push(valorAleatorio);
    this.add(this.posicionarObjeto(contador, moscaR, 4, 0, 0.03))
    contador++;
    this.moscas.push(moscaR);

    var moscaA = new MoscaAgresiva();
    valorAleatorio = Math.random() * (0.1 - 0.05) + 0.05;
    this.rotaciones.push(valorAleatorio);
    this.add(this.posicionarObjeto(contador, moscaA, 4, 0, 0.045))
    contador++;
    this.moscas.push(moscaA);

    var moscaE = new MoscaEnigma();
    valorAleatorio = Math.random() * (0.05 - 0.005) + 0.005;
    this.rotaciones.push(valorAleatorio);
    this.add(this.posicionarObjeto(contador, moscaE, 4, 0, 0.06))
    contador++;
    this.moscas.push(moscaE);

    var moscaL = new MoscaLuz();
    valorAleatorio = Math.random() * (0.05 - 0.005) + 0.005;
    this.rotaciones.push(valorAleatorio);
    this.add(this.posicionarObjeto(contador, moscaL, 4, 0, 0.075))
    contador++;
    this.moscas.push(moscaL);


    /*********************************************************************************************************/
    /* INICIALIZACIÓN DEL RAYO PARA COLISIONES */
    /*********************************************************************************************************/
    var posicion = new THREE.Vector3();
    var direccion = new THREE.Vector3(0,0,1);

    //Rayo para las colisiones terrestres
    this.rayo = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(0,0,1), 0, 500); //BUSCA ELEMENTOS ENTRE 0 Y distancia (10).
    this.personaje.getWorldPosition(posicion);
    this.rayo.set(posicion, direccion.normalize());
    var impactados = this.rayo.intersectObjects(this.terrestres, true);
    if(impactados.length > 0){
      console.log("Colisión");
      this.remove(impactados[0].object);
    } 
    
    /*********************************************************************************************************/
    /* EVENTOS PARA EL PICKING Y ACCIONES DE TECLAS */
    /*********************************************************************************************************/
    document.addEventListener('keydown', (event) => this.onKeyDown(event), false);
    document.addEventListener('mousedown', (event) => this.onDocumentMouseDown(event), false);
  }

  getVidas() {
    return this.vidas;
  }

  mezclarEfectos() {
    let array = this.efectosEnigma;
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // Mientras queden elementos para mezclar...
    while (0 !== currentIndex) {
  
      // Selecciona un elemento sin mezclar...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // Y lo intercambia con el elemento actual
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    this.efectosEnigma = array;
  }

  aplicaEfecto(){
    //PROCESAMOS EL EFECTO DE LOS ENIGMAS.
    switch(this.efectoActual){
      case 'inverso':
        this.mostrarMensajeTemporal("Controles inversos", false);
        this.tiempoEfecto = 10;
        break;
      case 'x2':
        this.mostrarMensajeTemporal("Multiplicador", true);
        this.multiplicador = this.multiplicador * 2;
        this.tiempoEfecto = 10;
        this.myScene.actualizarMultiplicador('x'+this.multiplicador);
        break;
      case 'daño':
        this.mostrarMensajeTemporal("-1 Vida", false);
        this.vidas--;
        this.myScene.actualizarVidas(this.vidas);
        break;
      case 'cura':
        this.mostrarMensajeTemporal("+1 Vida", true);
        this.vidas++;
        this.myScene.actualizarVidas(this.vidas);
        break;
      case 'lento':
        this.mostrarMensajeTemporal("Velocidad reducida", true);
        this.rate = 0.00008;
        this.tiempoEfecto = 10;
        break;
      case 'rapido':
        this.mostrarMensajeTemporal("Velocidad aumentada", false);
        this.rate = 0.00035;
        this.tiempoEfecto = 10;
        break;
    }
  }

  eliminaEfecto(){
    //REVERTIMOS EL EFECTO DE LOS ENIGMAS.
    switch(this.efectoActual){
      case 'inverso':
        this.efectoActual = '';
      case 'x2':
        this.multiplicador = 1;
        this.myScene.actualizarMultiplicador('x1');
        break;
      case 'lento':
        this.rate = 0.0001;
        break;
      case 'rapido':
        this.rate = 0.0001;
        break;
    }

    //RESETEAMOS EL EFECTO ACTUAL.
    this.efectoActual = '';
  }

  mostrarMensajeTemporal(mensaje, esBueno, duracion = 10000) {
    // Obtén el elemento #listaMensajes
    var listaMensajes = document.getElementById('listaMensajes');

    // Crea un nuevo elemento de lista y establece su contenido en el mensaje
    var nuevoMensaje = document.createElement('li');
    nuevoMensaje.innerHTML = mensaje;

    // Establece la clase del nuevo mensaje en función de si el efecto es bueno o malo
    nuevoMensaje.className = esBueno ? 'bueno' : 'malo';

    // Agrega el nuevo mensaje a la lista
    listaMensajes.appendChild(nuevoMensaje);

    // Usa setTimeout para eliminar el mensaje de la lista después de 'duracion' milisegundos
    setTimeout(function() {
        listaMensajes.removeChild(nuevoMensaje);
    }, duracion);
  }

  verificarFinJuego() {
    if (this.vidas == 0) {
      // Elimina el personaje del nodo
      this.nodoPosOrientTubo.remove(this.movimientoLateral);

      // Mostrar el menú de fin de juego
      document.getElementById('menu-fin').style.display = 'block';
    }
  }

  onKeyDown(event) {
    const keyCode = event.keyCode;

    switch (keyCode) {
      case 65: //Flecha izquierda
        if(this.efectoActual == 'inverso'){
          this.setAnguloRotacion(this.rot += 0.1);
        }
        else{          
          this.setAnguloRotacion(this.rot -= 0.1);
        }
        break;
      case 68: //Flecha derecha
      if(this.efectoActual == 'inverso'){
        this.setAnguloRotacion(this.rot -= 0.1);
      }
      else{          
        this.setAnguloRotacion(this.rot += 0.1);
      }
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
        this.puntuacion += 1 * this.multiplicador;
        this.myScene.sumarPuntuacion(this.puntuacion);
        abuelo.remove(padre);
      }
      else if(abuelo instanceof MoscaReina){
        abuelo.reducirVida();
        if(abuelo.vida == 0 || this.venusActivo){
          //La eliminamos.
          abuelo.remove(padre);
          
          //Sumamos la puntuacion al matarla.
          this.puntuacion += 10 * this.multiplicador;
          this.myScene.sumarPuntuacion(this.puntuacion);
        }
      }
      else if(abuelo instanceof MoscaAgresiva){
        abuelo.reducirVida();
        if(abuelo.vida == 0 || this.venusActivo){
          //La eliminamos.
          abuelo.remove(padre);

          //Sumamos la puntuacion al matarla.
          this.puntuacion += 5 * this.multiplicador;
          this.myScene.sumarPuntuacion(this.puntuacion);
        }
      }
      else if(abuelo instanceof MoscaEnigma){ //1 vida
        this.efectoActual = this.efectosEnigma[0];
        this.aplicaEfecto();
        console.log("Efecto actual: " + this.efectoActual);
        this.mezclarEfectos(); //Mezclamos los efectos para que no se repitan.
        abuelo.remove(padre);
      }
      else if(abuelo instanceof MoscaLuz){ //2 vida
        abuelo.reducirVida();
        if(abuelo.vida == 0 || this.venusActivo){
          //La eliminamos.
          abuelo.remove(padre);

          //Sumamos una vida al personaje.
          this.vidas++;
          this.myScene.actualizarVidas(this.vidas);
        }
      }
      console.log("Objeto seleccionado: " + abuelo.nombre);
    }
  }

  setAnguloRotacion(valor){
    this.movimientoLateral.rotation.z = valor;
  }

  setAnguloRotacionObj(index, valor){
    this.nodosMovLateral[index].rotation.z = valor;
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
  
  update () {
    /*********************************************************************************************************/
    /* AVANCE DEL PERSONAJE Y ROTACIONES DE LAS MOSCAS */
    /*********************************************************************************************************/
    this.t = (this.t + this.rate) % 1;
    //this.rotMosca += 0.01;
    this.avanzaPersonaje(this.t);

    this.setAnguloRotacion(this.rot);
    for (var i=0; i < this.moscas.length; i++){
      this.valorRotaciones[i] += this.rotaciones[i];
      this.setAnguloRotacionObj(i, this.valorRotaciones[i]);
    }
    this.personaje.update(this.velocidadAnim);

    for (var i=0; i<this.moscas.length; i++){
      this.moscas[i].update();
    }
    

    //CON CADA VUELTA, AUMENTA LA VELOCIDAD.
    if (this.t.toFixed(2) >= 0.99) {
      // Aumenta la velocidad
      this.rate += 0.00005;
      // Restablece this.t a 0 para la próxima vuelta
      this.t = 0;
      this.velocidadAnim += 10;
    }

    /*********************************************************************************************************/
    /* COLISIONES RAY-CASTING CON LOS OBJETOS */
    /*********************************************************************************************************/    
    //COLISIONES TERRESTRES.
    var posicion = new THREE.Vector3();
    var direccion = new THREE.Vector3(0,0,1);

    //ACTUALIZAMOS EL TIEMPO DE LA ÚLTIMA COLISIÓN.
    var currentTime = Date.now();

    this.personaje.getWorldPosition(posicion);
    this.rayo.set(posicion, direccion.normalize());
    if(currentTime - this.lastCollisionTime > this.collisionCooldown){
      var impactados = this.rayo.intersectObjects(this.terrestres, true);
      if(impactados.length > 0){
        console.log("Colisión de rayos.");

        this.lastCollisionTime = currentTime; //ACTUALIZAMOS EL TIEMPO DE LA ÚLTIMA COLISIÓN.

        var padre = impactados[0].object.parent;
        var abuelo = padre.parent;

        if((abuelo instanceof BolaPinchos) || (abuelo instanceof PlanchaPinchos) || (abuelo instanceof Bomba)){
          if (!this.protegido){
            //RESTAMOS UNA VIDA
            this.vidas--;
            this.myScene.actualizarVidas(this.vidas);

            if(abuelo instanceof BolaPinchos){
              //Restamos 5 puntos (NO SEA NEGAIVO)
              this.puntuacion = Math.max(0, this.puntuacion - 5);
              this.myScene.sumarPuntuacion(this.puntuacion);
            }
            else if(abuelo instanceof PlanchaPinchos){
              //Restamos 3 puntos (NO SEA NEGAIVO)
              this.puntuacion = Math.max(0, this.puntuacion - 3);
              this.myScene.sumarPuntuacion(this.puntuacion);
            }
          }
        }

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

          //REDUCE LA VELOCIDAD DEL PERSONAJE.
          this.rate = 0.00001;

          //Restamos 10 puntos (NO SEA NEGAIVO)
          this.puntuacion = Math.max(0, this.puntuacion - 10);
          this.myScene.sumarPuntuacion(this.puntuacion);
        }
        else if(abuelo instanceof Enigma){ //EFECTOS DE LOS ENIGMAS.
            this.efectoActual = this.efectosEnigma[0];
            this.aplicaEfecto();
            console.log("Efecto actual: " + this.efectoActual);
            this.mezclarEfectos(); //Mezclamos los efectos para que no se repitan.
        }
        else if (abuelo instanceof Escudo){
          this.personaje.add(this.bolaEscudo);
          this.protegido = true;
      
          setTimeout(() => {
            this.personaje.remove(this.bolaEscudo);
            this.protegido = false;
          }, 20000);
        }
        else if(abuelo instanceof Venus){
          this.tiempoVenus = 10;
          this.venusActivo = true;
        }
        else if(abuelo instanceof PlanchaPinchos){}
        else if(abuelo instanceof BolaPinchos){}
        else if(!(abuelo instanceof Bomba) && !(abuelo instanceof Enigma) && !(abuelo instanceof Escudo) && !(abuelo instanceof Venus) && !(abuelo instanceof PlanchaPinchos) && !(abuelo instanceof BolaPinchos)){ //SI TOCA EL RAYO
          this.multiplicador = this.multiplicador * 2;
          this.myScene.actualizarMultiplicador('x'+this.multiplicador);
          this.nitroActivado = true;
          this.tiempoNitro = 10;
        }

        //SE ELIMINAN TODOS LOS OBJETOS COLISIONADOS, MENOS LOS PINCHOS.
        if(abuelo != null && !(abuelo instanceof PlanchaPinchos) && !(abuelo instanceof BolaPinchos)){
          abuelo.remove(padre);
        }
      }
    }

    //Vuelve la luz y velocidad normal tras la bomba
    this.deltaTime = this.clock.getDelta(); // Tiempo transcurrido desde el último frame
    this.timer += this.deltaTime;

    if (!this.fadeOut && this.timer >= this.waitDuration){
      this.lightIntensity = 20000;
      this.fadeOut = true;
      this.timer = 0;
      this.myScene.setLuzPersonaje(this.lightIntensity);

      this.rate = 0.0001;//Vuelve a la velocidad normal.
    }

    /*********************************************************************************************************/
    /* GESTIÓN EFECTOS DE OBJETOS */
    /*********************************************************************************************************/
    if(this.efectoActual != '' && this.tiempoEfecto > 0){
      this.tiempoEfecto -= this.deltaTime;
      //console.log("Tiempo efecto: " + this.tiempoEfecto);
      if(this.tiempoEfecto <= 0){
        this.eliminaEfecto();
        console.log("Efecto eliminado.");
      }
    }

    if(this.venusActivo && this.tiempoVenus > 0){
      console.log("Venus activado");
      this.tiempoVenus -= this.deltaTime;
      if(this.tiempoVenus <= 0){
        this.venusActivo = false;
        console.log("Venus desactivado");
      }
    }

    if(this.nitroActivado && this.tiempoNitro > 0){
      console.log("Nitro activo");
      this.tiempoNitro -= this.deltaTime;
      if(this.tiempoNitro <= 0){
        this.multiplicador = 1;
        this.myScene.actualizarMultiplicador('x1');
        this.nitroActivado = false;
        console.log("Nitro desactivado");
      }
    }

    /*********************************************************************************************************/
    /* FINAL DEL JUEGO */
    /*********************************************************************************************************/
    this.verificarFinJuego();
    
    document.getElementById('boton-reiniciar').addEventListener('click', function() {
      location.reload();
    });
    
  }
}

export { Juego };