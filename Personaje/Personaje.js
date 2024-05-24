import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Rev } from '../Rev/Rev.js'; //Importamos Rev para la cabeza.
 
class Personaje extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);


    //PARA LAS ROTACIONES.
    this.topeIzqBrazo = false;
    this.topeIzqPata = false;
    this.topeDerBrazo = false;
    this.topeDerPata = false;
    this.rotar = true;
    //this.velocidad = 1.0;

    //DEFINIMOS LE MATERIAL.
    var mat = new THREE.MeshNormalMaterial();

    //CABEZA:
    this.cabeza = new Rev(gui, "Controles de la Cabeza");
    this.cabeza.scale.set(1.5, 1.5, 1.5);
    //cabeza.rotateX(Math.PI/2);
    this.cabeza.translateY(2.75);
    //this.add(this.cabeza);

    //BRAZOS:
    var manoGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    var brazoGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
    var hombroGeometry = new THREE.SphereGeometry(0.5, 8, 8);

    manoGeometry.translate(0, -3, 0);
    brazoGeometry.translate(0, -1.5, 0);
    hombroGeometry.translate(0, -0.5, 0);

    //COLOCAMOS EL PRIMER BRAZO
    var mano = new THREE.Mesh(manoGeometry, mat);
    var brazo = new THREE.Mesh(brazoGeometry, mat);
    var hombro = new THREE.Mesh(hombroGeometry, mat);

    //UNIMOS LAS PARTES DEL BRAZO.
    var cgsBrazoI = new CSG();
    cgsBrazoI.union([mano, brazo, hombro]);
    this.brazoIzquierda = cgsBrazoI.toMesh();

    this.brazoIzquierda.translateX(2.5);
    this.brazoIzquierda.translateY(1);
    //this.add(this.brazoIzquierda);
    
    var cgsBrazoD = new CSG();
    cgsBrazoD.union([mano, brazo, hombro]);
    this.brazoDerecha = cgsBrazoD.toMesh();

    this.brazoDerecha.translateX(-2.5);
    this.brazoDerecha.translateY(1);
    //this.add(this.brazoDerecha);
    

    //TORSO:
    var torsoGeometry = new THREE.CylinderGeometry(2, 2, 2.5, 8);
    this.torso = new THREE.Mesh(torsoGeometry, mat);

    //this.add(this.torso);

    //PIERNAS:
    var piernaGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);

    this.piernaDer = new THREE.Mesh(piernaGeometry, mat);
    this.piernaDer.translateX(-1.25);
    this.piernaDer.translateY(-2.25);


    this.piernaIzq = new THREE.Mesh(piernaGeometry, mat);
    this.piernaIzq.translateX(1.25);
    this.piernaIzq.translateY(-2.25);


    //PIES:
    var tobilloGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
    var pieGeometry = new THREE.SphereGeometry(0.5, 8, 8);

    tobilloGeometry.rotateX(Math.PI/2);

    var tobillo = new THREE.Mesh(tobilloGeometry, mat);

    var pie1 = new THREE.Mesh(pieGeometry, mat);
    pie1.position.z = 0.5;

    var pie2 = new THREE.Mesh(pieGeometry, mat);
    pie2.position.z = -0.5;
    
    var csg = new CSG();
    csg.union([tobillo, pie1, pie2]);
    var tobilloPie1 = csg.toMesh();
    tobilloPie1.translateZ(0.25);
    tobilloPie1.translateY(-3.25);
    tobilloPie1.translateX(-1.25);

    var tobilloPie2 = csg.toMesh();
    tobilloPie2.translateZ(0.25);
    tobilloPie2.translateY(-3.25);
    tobilloPie2.translateX(1.25);

    var csgIzq = new CSG();
    csgIzq.union([this.piernaIzq, tobilloPie2]);
    this.pataIzq = csgIzq.toMesh();

    var csgDer = new CSG();
    csgDer.union([this.piernaDer, tobilloPie1]);
    this.pataDer = csgDer.toMesh();


    //this.add(this.pataIzq);
    //this.add(this.pataDer);


    // var csgPersonaje = new CSG();
    // csgPersonaje.union([this.cabeza, this.brazoIzquierda, this.brazoDerecha, this.pataDer, this.pataIzq, this.torso]);
    // this.personaje = csgPersonaje.toMesh();

    this.personaje = new THREE.Group();
    this.personaje.add(this.cabeza);
    this.personaje.add(this.brazoIzquierda);
    this.personaje.add(this.brazoDerecha);
    this.personaje.add(this.torso);
    this.personaje.add(this.pataDer);
    this.personaje.add(this.pataIzq);
    this.add(this.personaje);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(this.personaje);

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVsible); */
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
    if(this.brazoIzquierda.rotation.x < Math.PI/4 && !this.topeIzqBrazo){
      this.brazoIzquierda.rotation.x += 0.01;
      if(this.brazoIzquierda.rotation.x >= Math.PI/4){
        this.topeIzqBrazo = true;
      }
    }
    else{
      this.brazoIzquierda.rotation.x -= 0.01;
      if(this.brazoIzquierda.rotation.x <= -Math.PI/4){
        this.topeIzqBrazo = false;
      }
    }

    if(this.brazoDerecha.rotation.x > -Math.PI/4 && !this.topeDerBrazo){
      this.brazoDerecha.rotation.x -= 0.01;
      if(this.brazoDerecha.rotation.x <= -Math.PI/4){
        this.topeDerBrazo = true;
      }
    }
    else{
      this.brazoDerecha.rotation.x += 0.01;
      if(this.brazoDerecha.rotation.x >= +Math.PI/4){
        this.topeDerBrazo = false;
      }
    }

    if(this.pataDer.rotation.x < Math.PI/4 && !this.topeIzqPata){
      this.pataDer.rotation.x += 0.01;
      if(this.pataDer.rotation.x >= Math.PI/4){
        this.topeIzqPata = true;
      }
    }
    else{
      this.pataDer.rotation.x -= 0.01;
      if(this.pataDer.rotation.x <= -Math.PI/4){
        this.topeIzqPata = false;
      }
    }

    if(this.pataIzq.rotation.x > -Math.PI/4 && !this.topeDerPata){
      this.pataIzq.rotation.x -= 0.01;
      if(this.pataIzq.rotation.x <= -Math.PI/4){
        this.topeDerPata = true;
      }
    }
    else{
      this.pataIzq.rotation.x += 0.01;
      if(this.pataIzq.rotation.x >= +Math.PI/4){
        this.topeDerPata = false;
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

    this.funcionAnimar(this.rotar);
    //PARA ROTAR EL OBEJTO.
    /* if(this.rotar){
      
    } */

    // //ACTUALIZAMOS LA ROTACION.
    // this.movimientoLateral.rotateZ(this.rot);

    // var posTmp = this.path.getPointAt(this.t);
    // this.nodoPosOrientTubo.position.copy(posTmp);
    // var tangente = this.path.getTangentAt(this.t);
    // posTmp.add(tangente);
    // var segmentoActual = Math.floor(this.t * this.segmentos);
    // this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    // this.nodoPosOrientTubo.lookAt(posTmp);

    // Obtenemos la normal de la superficie en la posición actual del personaje

    /* var posTmp = this.path.getPointAt(this.t);
    this.nodoPosOrientTubo.position.copy(posTmp);
    var tangente = this.path.getTangentAt(this.t);

    var normal = new THREE.Vector3(-tangente.y, tangente.x, 0);
    posTmp.add(normal);

    // Calculamos un punto hacia el que el personaje debe mirar sumando la normal a la posición actual del personaje
    this.nodoPosOrientTubo.position.copy(posTmp);

    var segmentoActual = Math.floor(this.t * this.segmentos);
    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];

    // Hacemos que el personaje mire hacia ese punto
    this.nodoPosOrientTubo.lookAt(posTmp); */

    //ACTUALIZAMOS T
  }
}

export { Personaje };