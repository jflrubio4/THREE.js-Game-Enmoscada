import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
 
class Mosca extends THREE.Object3D {
  constructor() {
    super();

    this.nombre = 'Mosca corriente';

    //var materialAlas = new THREE.MeshStandardMaterial({map: textureAlas});
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
      color: 0x222222,
      roughness: 0.5,
      metalness: 0.1
    })

    //VALORES PARA LAS ROTACIONES.
    this.topeAlaI = false;
    this.topeAlaD = false;
    this.rotar = true;

    //CUERPO MOSCA
    var cuerpoGeom = new THREE.SphereGeometry(0.3, 8, 8);
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
    alaIGeometry.translate(-0.1,0,-0.05);
    this.alaI = new THREE.Mesh(alaIGeometry, materialAlas);

    var alaDGeometry = new THREE.ExtrudeGeometry(shape, options);
    alaDGeometry.scale(0.5,0.5,0.5);
    alaDGeometry.translate(-0.1,0,-0.05);
    alaDGeometry.rotateY(Math.PI);
    this.alaD = new THREE.Mesh(alaDGeometry, materialAlas);

    this.mosca = new THREE.Group();

    this.mosca.add(cuerpo);
    this.mosca.add(this.alaI);
    this.mosca.add(this.alaD);

    this.mosca.position.set(0,0.3,0);
    this.add(this.mosca);

    //PATRA LAS COLISIONES.
    this.cajaEnvolvente = new THREE.Box3();
    this.cajaEnvolvente.setFromObject(this.mosca);

    /* //PARA VISUALIZAR LA CAJA ENVOLVENTE.
    var cajaEnvolventeVsible = new THREE.Box3Helper(this.cajaEnvolvente, 0x00ff00);
    this.add(cajaEnvolventeVsible); */

    this.mosca.userData.name = 'mosca';
    
  }

  setRotacion(value){
    if (value){
        this.rotar = true;
    }
    else{
        this.rotar = false;
    }
  }

  funcionAnimar(){
    if(this.alaI.rotation.y < 0.2 && !this.topeAlaI){
      this.alaI.rotation.y += 0.015;
      if(this.alaI.rotation.y >= 0.2){
        this.topeAlaI = true;
      }
    }
    else{
      this.alaI.rotation.y -= 0.015;
      if(this.alaI.rotation.y <= -0.2){
        this.topeAlaI = false;
      }
    }

    if(this.alaD.rotation.y > -0.2 && !this.topeAlaD){
      this.alaD.rotation.y -= 0.015;
      if(this.alaD.rotation.y <= -0.2){
        this.topeAlaD = true;
      }
    }
    else{
      this.alaD.rotation.y += 0.015;
      if(this.alaD.rotation.y >= 0.2){
        this.topeAlaD = false;
      }
    }
  }
  
  update () {
    this.funcionAnimar();
    
  }
}

export { Mosca };