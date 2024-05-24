import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { Mosca } from '../Mosca/Mosca.js';
 
class MoscaReina extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    this.nombre = 'Mosca Reina';
    
    //DEFINIMOS LE MATERIAL.
    var mat = new THREE.MeshNormalMaterial();

    // var mosca = new Mosca(gui, "Controles Mosca");
    // // Escalar la corona con la mosca
    // mosca.scale.set(1.5, 1.5, 1.5);
    // this.add(mosca);

    //CODIGO DE LA MOSCA
    var cuerpoGeom = new THREE.SphereGeometry(1, 8, 8);
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
      steps: 2, 
      curveSegments: 8, 
      bevelSegments: 6,
      bevelThickness: 0.25,
      bevelSize: 0.6,
      bevelEnabled: false
    };

    var alaIGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaIGeometry.scale(0.5,0.5,0.5);
    alaIGeometry.translate(-0.9,0,-0.05);
    this.alaI = new THREE.Mesh(alaIGeometry, mat);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.5,0.5,0.5);
    alaDGeometry.translate(-0.9,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, mat);

    var moscaCSG = new CSG();
    moscaCSG.union([cuerpo, this.alaI, this.alaD]);
    var mosca = moscaCSG.toMesh();
    //mosca.rotateY(Math.PI/2);
    //FIN MOSCA

    var shape = new THREE.Shape();
    shape.moveTo(0,0);
    shape.lineTo(-0.31,0.5);
    shape.lineTo(0.31,0.5);
    shape.lineTo(0,0);

    var options = {
      depth: 1, // Aumentamos la profundidad para que el prisma sea más visible
      steps: 1, // Reducimos el número de pasos para una geometría más simple
      curveSegments: 0, // No hay segmentos curvos en una forma triangular
      bevelSegments: 1, // Reducimos el número de segmentos del bisel para mantenerlo simple
      bevelThickness: 0, // Grosor del bisel, puede ajustarse según el efecto deseado
      bevelSize: 0, // Tamaño del bisel, puede ajustarse según el efecto deseado
      bevelEnabled: false
    };

    var restaGeom = new THREE.ExtrudeGeometry(shape, options);
    restaGeom.scale(1,1,2);
    restaGeom.translate(0,0.5,-1);

    //Para generar la forma de la corona con prismas de triangulos invertidos
    var restas = [];

    for (let i=0; i<8; i++){
      var restaMesh = new THREE.Mesh(restaGeom, mat);
      restaMesh.rotateY(Math.PI/5*i);
      restas.push(restaMesh);
    }

    var baseGeometry = new THREE.CylinderGeometry(1, 1, 1, 8);
    baseGeometry.translate(0,0.5,0);
    var baseMesh = new THREE.Mesh(baseGeometry, mat);

    var restaCSG = new CSG();
    for (let i=0; i<restas.length; i++){
      restaCSG.union([restas[i]]);
    }
    var restaTotal = restaCSG.toMesh();

    // Convertir las geometrías en CSG
    var csg = new CSG();
    csg.union([baseMesh]);
    csg.subtract([restaTotal]);
    var coronaMesh = csg.toMesh();
    coronaMesh.scale.set(0.3,0.4,0.3);
    coronaMesh.position.y = 0.9;

    var reinaCSG = new CSG();
    reinaCSG.union([coronaMesh, mosca]);
    var moscaReina = reinaCSG.toMesh();

    moscaReina.position.set(0,1,0);
    // Añadir la corona a este objeto
    this.add(moscaReina);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(moscaReina);

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
    
  }
}

export { MoscaReina };