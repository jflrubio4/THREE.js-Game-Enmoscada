import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class MoscaLuz extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    //DEFINIMOS LE MATERIAL.
    var materialAlas = new THREE.MeshPhysicalMaterial({
      color: 0xcccccc, // Color gris claro
      roughness: 0.2, // Un poco rugoso para darle un toque natural
      metalness: 0.1, // Un toque de metalicidad para el brillo sutil
      transmission: 0.9, // Alta transmisión para transparencia
      opacity: 0.75, // Transparencia moderada
      transparent: true, // Permitir transparencia
      thickness: 0.01, // Grosor del material muy delgado
      clearcoat: 0.5, // Añadir una capa de recubrimiento transparente
      clearcoatRoughness: 0.1, // Un poco de rugosidad en la capa de recubrimiento
      reflectivity: 0.5, // Reflejos sutiles
      attenuationDistance: 1.0, // Distancia de atenuación de la luz
      attenuationColor: new THREE.Color(0xaaaaaa) // Color de atenuación gris claro
    });

    var mat = new THREE.MeshPhysicalMaterial({
      color: 0x82E4FF,
      roughness: 0.5,
      metalness: 0.2
    });

    var haloMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFEE97, // Color amarillo claro
      emissive: 0xffffe0, // El mismo color para la emisión
      emissiveIntensity: 1, // Alta intensidad de emisión
      opacity: 0.7, // Opacidad parcial para un efecto suave
      roughness: 0.5, // Un poco rugoso para un efecto natural
      metalness: 0.1 // Un toque de metalicidad
    });

    //CUERPO MOSCA
    var cuerpoGeom = new THREE.SphereGeometry(0.65, 32, 32);
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
      steps: 10, 
      curveSegments: 32, 
      bevelSegments: 12,
      bevelThickness: 0.25,
      bevelSize: 0.6
    };

    var alaIGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaIGeometry.scale(0.5,0.5,0.5);
    alaIGeometry.translate(-0.7,0,-0.05);
    this.alaI = new THREE.Mesh(alaIGeometry, materialAlas);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.5,0.5,0.5);
    alaDGeometry.translate(-0.7,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, materialAlas);

    // Crear la geometría del toro (halo)
    var toroGeometry = new THREE.TorusGeometry(0.4, 0.1, 16, 32);
    // Posicionar el toro encima de la esfera de la mosca
    toroGeometry.rotateX(Math.PI/2);
    toroGeometry.translate(0, 0.8, 0);
    // Crear el mesh del toro con el mismo material que la mosca
    var toro = new THREE.Mesh(toroGeometry, haloMaterial);

    var haloLight = new THREE.PointLight(0xffffe0, 4, 100); // Color amarillo claro, intensidad 1, distancia 100
    haloLight.position.set(0, 1.2, 0);
    this.add(haloLight);


    var mosca = new THREE.Group();
    mosca.add(cuerpo);
    mosca.add(this.alaI);
    mosca.add(this.alaD);
    mosca.add(toro);
    mosca.rotateY(-Math.PI/2); 
    this.add(mosca);
    
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
    
  }
}

export { MoscaLuz };