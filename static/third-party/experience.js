
//  JavaScript modules. 
//  As of May 2020, Three is officially moving to modules and deprecating
//  their old non-module format. I think that’s a bummer because now you
//  MUST run a server in order to play with the latest Three code -- even
//  for the simplest examples. Such is progress?
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

import * as THREE from '/third-party/three.module.js';
import Stats from '/third-party/stats.module.js';

//////////////////
//              //
//   Overhead   //
//              //
//////////////////


//  Some bits that we’ll reference across different function scopes,
//  so we’ll define them here in the outermost scope.
//  https://developer.mozilla.org/en-US/docs/Glossary/Scope

let 
camera,
scene,
renderer, 
stats


//  And one more thing; an empty object that we’ll fill with some properties
//  for use with our DAT.GUI module, ie. the live value editor.

const params = {}

let innerWidth = 200
let innerHeight = 200
let pNum = 3
let qNum = 7

// get params from a tag
const experience = document.getElementById("experience-arguments");
if (experience) {
      let t = experience.getAttribute("innerHeight");
      if (t) {
            innerHeight = parseInt(t);
      }

      t = experience.getAttribute("innerWidth");
      if (t) {
            innerWidth = parseInt(t);
      }

      t = experience.getAttribute("pNum");
      if (t) {
            pNum = parseInt(t);
      }

      t = experience.getAttribute("qNum");
      if (t) {
            qNum = parseInt(t);
      }
}




function setupThree(){


      //  DOM container for Three’s CANVAS element.
      //  https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
      //  https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild

      const container = document.createElement( 'div' )
      // document.body.appendChild( container )
      document.getElementById("experience").appendChild(container);


      //  Perspective camera.
      //  https://threejs.org/docs/#api/en/cameras/PerspectiveCamera

      const
      fieldOfView = 75,
      aspectRatio = innerWidth / innerHeight,
      near = 0.1,
      far  = 1000

      camera = new THREE.PerspectiveCamera( 
            fieldOfView, 
            aspectRatio,
            near,
            far 
      )
      camera.position.set( 0, 1, 2 )

      
      //  Scene.
      //  https://threejs.org/docs/#api/en/scenes/Scene

      scene = new THREE.Scene()
      scene.add( camera )


      //  WebGL renderer.
      //  https://threejs.org/docs/#api/en/renderers/WebGLRenderer

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio( window.devicePixelRatio )
      renderer.setSize( innerWidth, innerHeight )
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.physicallyCorrectLights = true
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.outputEncoding = THREE.sRGBEncoding
      container.appendChild( renderer.domElement )

      window.addEventListener( 'resize', function(){
            camera.aspect = innerWidth / innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize( innerWidth, innerHeight )

      }, false )

      stats = new Stats()
}






/////////////////////
//                 //
//   Cornell Box   //
//                 //
/////////////////////

const walls = []
function setupCornellBox(){

      Object.assign( params, {

            wallRoughness: 0,
            wallMetalness: 0.1,
            wallEnvMapIntensity: 0.2
      })

      const 
      cornellBox = new THREE.Object3D(),
      boxSize = 4

      scene.add( cornellBox )

      //  Time for some lights!

      params.lightColor = 0xFFFFFF
      params.lightIntensity = 0.8
      

      //  Spot light.
      //  https://threejs.org/docs/#api/en/lights/SpotLight
      //  https://threejs.org/docs/#api/en/lights/shadows/SpotLightShadow
      
      const spotLight = new THREE.SpotLight( 0xFFFFFF, params.lightIntensity )
      spotLight.position.set( 0, boxSize * 2 - 0.01, 0 )
      spotLight.castShadow = true
      spotLight.decay = 0.8
      spotLight.shadow.mapSize.width  = 1024
      spotLight.shadow.mapSize.height = 1024
      spotLight.shadow.camera.near = boxSize / 2
      spotLight.shadow.camera.far  = boxSize * 2
      spotLight.shadow.camera.fov  = 30
      spotLight.penumbra = 0.5
      cornellBox.add( spotLight )

}


/////////////////
//             //
//   Content   //
//             //
/////////////////


let torus
function setupContent(){

      const geometry = new THREE.TorusKnotGeometry( 0.8, 0.02, 150, 20, pNum, qNum );
      // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      const material = new THREE.MeshStandardMaterial({
                  color: 0xCC9933,
                  roughness: 0,
                  metalness: 0.5,
                  envMapIntensity: 0.5,
            })
      torus = new THREE.Mesh( geometry, material );
      torus.position.set( 0, 1, 0 );
      torus.rotation.x = 75;
      scene.add( torus );
}



//////////////
//          //
//   Loop   //
//          //
//////////////


let timePrevious
function loop( time ){

      const timeDelta = timePrevious ? time - timePrevious : 0
      timePrevious = time

      torus.position.y  = 1.3 + Math.sin( time / 1000 ) / 5
      torus.rotation.z += timeDelta * 0.0005

      renderer.render( scene, camera )
      stats.update()
      
      //  Request Animation Frame.
      //  Aim to re-render and re-paint 60 frames per second.
      //  https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
      
      requestAnimationFrame( loop )
}

//////////////
//          //
//   Boot   //
//          //
//////////////

if (document.getElementById("experience").childElementCount == 0) {
      setupThree()
      setupCornellBox()
      setupContent()
      loop()
} else {
      console.log("Experience already exists")
}

/*
window.addEventListener( 'DOMContentLoaded', function(){
      setupThree()
      setupCornellBox()
      setupContent()
      loop()
})
*/