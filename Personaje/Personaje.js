import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Rev } from '../Rev/Rev.js'; //Importamos Rev para la cabeza.
 
class Personaje extends THREE.Object3D {
  constructor() {
    super();

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
    this.cabeza = new Rev();
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
    this.piernaDer.translateX(-0.5);
    this.piernaDer.translateY(-2.25);


    this.piernaIzq = new THREE.Mesh(piernaGeometry, mat);
    this.piernaIzq.translateX(0.5);
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
    tobilloPie1.translateX(-0.5);

    var tobilloPie2 = csg.toMesh();
    tobilloPie2.translateZ(0.25);
    tobilloPie2.translateY(-3.25);
    tobilloPie2.translateX(0.5);

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

    this.funcionAnimar(this.rotar);
  }
}

export { Personaje };