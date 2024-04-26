import * as THREE from '../libs/three.module.js'
 
class Rev extends THREE.Object3D {

  static currentSegments; // Variable estática para guardar el número de segmentos actual

  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    this.currentSegments = this.guiControls.segmentos;

    // Crear el perfil del triángulo
    this.points = [];
    this.points.push(new THREE.Vector2(0, 0)); // Punto en el origen
    this.points.push(new THREE.Vector2(this.guiControls.radio, 0)); // Punto en la base
    this.points.push(new THREE.Vector2(this.guiControls.radio/2, 3)); // Punto en el vértice superior
    this.points.push(new THREE.Vector2(0, 0)); // Volver al origen para cerrar el triángulo
    
    // Un Mesh se compone de geometría y material
    var geom = new THREE.LatheGeometry (this.points, this.guiControls.segmentos, 0, 2*Math.PI);
    // Como material se crea uno a partir de un color
    var mat = new THREE.MeshNormalMaterial({color: 0x44556f});

    // Crear una semiesfera
    const semiSphereGeom = new THREE.SphereGeometry(1, this.guiControls.segmentos, this.guiControls.segmentos, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);    const semiSphereMat = new THREE.MeshNormalMaterial({color: 0x44556f});
    const semiSphere = new THREE.Mesh(semiSphereGeom, semiSphereMat);
    
    // Ya podemos construir el Mesh
    this.revol = new THREE.Mesh (geom, mat);
    // Y añadirlo como hijo del Object3D (el this)
    this.add (this.revol);

    // Añadir la semiesfera al objeto 3D
    this.add(semiSphere);
  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      sizeX : 1.0,
      sizeY : 1.0,
      sizeZ : 1.0,
      
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.0,
      
      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,

      segmentos: 20,
      radio: 1.0,
      
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

        this.guiControls.segmentos = 20;
        this.guiControls.radio = 1.0;
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

    folder.add (this.guiControls, 'segmentos', 3, 30, 1).name ('Segmentos : ').listen();
    folder.add (this.guiControls, 'radio', 0.1, 50.0, 0.1).name ('Radio : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.revol.geometry.dispose();
    this.revol.geometry = new THREE.LatheGeometry(this.points, this.guiControls.segmentos, this.guiControls.radio);
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}

export { Rev };
