import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Rev } from '../Rev/Rev.js'; //Importamos Rev para la cabeza.
 
class Personaje extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    var loader = new THREE.TextureLoader();
    var textureCamiseta = loader.load('../../imgs/hawai2.png');
    var texturaPatas = loader.load('../../imgs/vaqueros.png');

    textureCamiseta.wrapS = THREE.ClampToEdgeWrapping;
    textureCamiseta.wrapT = THREE.ClampToEdgeWrapping;
    textureCamiseta.repeat.set(0.75, 0.75);

    var matCamiseta = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      roughness: 0.5,
      map: textureCamiseta,
      metalness: 0.5
    });

    var matPantalon = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      roughness: 0.5,
      map: texturaPatas,
      metalness: 0.5
    }); 


    //PARA LAS ROTACIONES.
    this.topeIzqBrazo = false;
    this.topeIzqPata = false;
    this.topeDerBrazo = false;
    this.topeDerPata = false;
    this.rotar = true;
    //this.velocidad = 1.0;

    //DEFINIMOS LE MATERIAL.
    var mat = new THREE.MeshPhysicalMaterial({
      color: 0x5D68B8, // color base
      map: new THREE.TextureLoader().load('../../imgs/bomba.jpg'),
      /* roughness: 1,
      clearcoat: 1.0, // intensidad del clearcoat, 1.0 es el máximo
      clearcoatRoughness: 0.3 // rugosidad del clearcoat, 0.3 es un valor medio */
    });


    //CABEZA:
    this.cabeza = new Rev(gui, "Controles de la Cabeza");
    this.cabeza.scale.set(1.5, 1.5, 1.5);
    //cabeza.rotateX(Math.PI/2);
    this.cabeza.translateY(2.75);
    //this.add(this.cabeza);

    //BRAZOS:
    var manoGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    var brazoGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    var hombroGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    manoGeometry.translate(0, -3, 0);
    brazoGeometry.translate(0, -1.5, 0);
    hombroGeometry.translate(0, -0.5, 0);

    //COLOCAMOS EL PRIMER BRAZO
    var mano = new THREE.Mesh(manoGeometry, mat);
    var brazo = new THREE.Mesh(brazoGeometry, mat);
    var hombro = new THREE.Mesh(hombroGeometry, matCamiseta);

    this.brazoIzquierda = new THREE.Group();
    this.brazoIzquierda.add(mano);
    this.brazoIzquierda.add(brazo);
    this.brazoIzquierda.add(hombro);
    
    this.brazoIzquierda.translateX(2.5);
    this.brazoIzquierda.translateY(1);

    //COLOCAMOS EL SEGUNDO BRAZO
    this.brazoDerecha = new THREE.Group();
    this.brazoDerecha.add(mano.clone());
    this.brazoDerecha.add(brazo.clone());
    this.brazoDerecha.add(hombro.clone());

    this.brazoDerecha.translateX(-2.5);
    this.brazoDerecha.translateY(1);
    

    //UNIMOS LAS PARTES DEL BRAZO.
    /* var cgsBrazoI = new CSG();
    cgsBrazoI.union([mano, brazo, hombro]);
    this.brazoIzquierda = cgsBrazoI.toMesh();

    this.brazoIzquierda.translateX(2.5);
    this.brazoIzquierda.translateY(1); */
    //this.add(this.brazoIzquierda);
    
    /* var cgsBrazoD = new CSG();
    cgsBrazoD.union([mano, brazo, hombro]);
    this.brazoDerecha = cgsBrazoD.toMesh();

    this.brazoDerecha.translateX(-2.5);
    this.brazoDerecha.translateY(1); */
    //this.add(this.brazoDerecha);
    

    //TORSO:
    var torsoGeometry = new THREE.CylinderGeometry(2, 2, 2.5, 32);
    this.torso = new THREE.Mesh(torsoGeometry, matCamiseta);

    //this.add(this.torso);

    //PIERNAS:
    var piernaGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);

    this.piernaDer = new THREE.Mesh(piernaGeometry, matPantalon);
    this.piernaDer.translateX(-0.5);
    this.piernaDer.translateY(-2.25);


    this.piernaIzq = new THREE.Mesh(piernaGeometry, matPantalon);
    this.piernaIzq.translateX(0.5);
    this.piernaIzq.translateY(-2.25);


    //PIES:
    var tobilloGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    var pieGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    tobilloGeometry.rotateX(Math.PI/2);

    var tobillo = new THREE.Mesh(tobilloGeometry, mat);

    var pie1 = new THREE.Mesh(pieGeometry, mat);
    pie1.position.z = 0.5;

    var pie2 = new THREE.Mesh(pieGeometry, mat);
    pie2.position.z = -0.5;
    
    this.tobilloPie1 = new THREE.Group();
    this.tobilloPie1.add(tobillo);
    this.tobilloPie1.add(pie1);
    this.tobilloPie1.add(pie2);

    this.tobilloPie2 = new THREE.Group();
    this.tobilloPie2.add(tobillo.clone());
    this.tobilloPie2.add(pie1.clone());
    this.tobilloPie2.add(pie2.clone());
    
    /* var csg = new CSG();
    csg.union([tobillo, pie1, pie2]);
    var tobilloPie1 = csg.toMesh(); */
    this.tobilloPie1.translateZ(0.5);
    this.tobilloPie1.translateY(-3.25);
    this.tobilloPie1.translateX(-0.5);

    // var tobilloPie2 = csg.toMesh();
    this.tobilloPie2.translateZ(0.5);
    this.tobilloPie2.translateY(-3.25);
    this.tobilloPie2.translateX(0.5);

    /* var csgIzq = new CSG();
    csgIzq.union([this.piernaIzq, tobilloPie2]);
    this.pataIzq = csgIzq.toMesh(); */

    this.pataIzq = new THREE.Group();
    this.pataIzq.add(this.piernaIzq);
    this.pataIzq.add(this.tobilloPie2);

    /* var csgDer = new CSG();
    csgDer.union([this.piernaDer, tobilloPie1]);
    this.pataDer = csgDer.toMesh(); */

    this.pataDer = new THREE.Group();
    this.pataDer.add(this.piernaDer);
    this.pataDer.add(this.tobilloPie1);

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