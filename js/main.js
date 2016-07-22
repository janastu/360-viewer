                                                                                                       
//              ,--,                                    ,----,     ,----..        ,---,                    
//            ,--.'|     ,--,     ,---,               .'   .' \   /   /   \    ,`--.' |    ,---.           
//            |  | :   ,--.'|   ,---.'|             ,----,'    | /   .     :  /    /  :   /     \          
//       .---.:  : '   |  |,    |   | :             |    :  .  ;.   /   ;.  \:    |.' '  /    / '          
//     /.  ./||  ' |   `--'_    :   : :             ;    |.'  /.   ;   /  ` ;`----':  | .    ' /           
//   .-' . ' |'  | |   ,' ,'|   :     |,-.          `----'/  ; ;   |  ; \ ; |   '   ' ;'    / ;            
//  /___/ \: ||  | :   '  | |   |   : '  |            /  ;  /  |   :  | ; | '   |   | ||   :  \            
//  .   \  ' .'  : |__ |  | :   |   |  / :           ;  /  /-, .   |  ' ' ' :   '   : ;;   |   ``.         
//   \   \   '|  | '.'|'  : |__ '   : |: |          /  /  /.`| '   ;  \; /  |   |   | ''   ;      \        
//    \   \   ;  :    ;|  | '.'||   | '/ :        ./__;      :  \   \  ',  /    '   : |'   |  .\  |        
//     \   \ ||  ,   / ;  :    ;|   :    |        |   :    .'    ;   :    /     ;   |.'|   :  ';  :        
//      '---"  ---`-'  |  ,   / /    \  /         ;   | .'        \   \ .'      '---'   \   \    /         
//                      ---`-'  `-'----'          `---'            `---`                 `---`--`          



/*Simple panorama viewer.
 *
 *Three.js-r77
 *
 */
//todo: make cross-origin images available to load.

//clean up code
//test
//support  for cubic images


(function (world) {
  "use strict";
     
var domEvents;
  var sceneNo, defaultData, sceneNum = 0, trans_obj, mouse = new THREE.Vector2(), rotSpeed = 0.1, s1,s2,s3,s4, philly, philly_object, esg_library, esg_map;
 
  var Eskybox, EskyboxFlag = 0;
//gui = new dat.GUI();
  world.scene = {};
  // list of panoramas available in the world
 
  
  function bind(scope, func) {
    return function bound() {
      func.apply(scope, arguments);
    };
  }
  
//  ########     ###    ########    ###    
//  ##     ##   ## ##      ##      ## ##   
//  ##     ##  ##   ##     ##     ##   ##  
//  ##     ## ##     ##    ##    ##     ## 
//  ##     ## #########    ##    ######### 
//  ##     ## ##     ##    ##    ##     ## 
//  ########  ##     ##    ##    ##     ##
//Loading Default Position values for objects
var camPos  = [
    new THREE.Vector3(0,0,0)
    //new THREE.Vector3(),
  ],
  
  SpanoOffset = [
     new THREE.Vector3(-3.1515,5.569,-0.00999999999999999)
  ];
  
  
   
    
    
   
  
  
//  #### ##    ## #### ######## 
//   ##  ###   ##  ##     ##    
//   ##  ####  ##  ##     ##    
//   ##  ## ## ##  ##     ##    
//   ##  ##  ####  ##     ##    
//   ##  ##   ###  ##     ##    
//  #### ##    ## ####    ##  
  /*
   * init the scene, setup the camera, draw 3D objects and start the game loop
   */
  world.init = function () {


  // default pano is the first one
  sceneNo = 0;
  //Camera Properties Initialization
  var fov = 40, aspect_ratio = window.innerWidth / window.innerHeight,
  near = 0.1, far = 50000;
  this.cam = new THREE.PerspectiveCamera(fov, aspect_ratio, near, far);
  // Renderer Initialization
  if (Detector.webgl) {
    this.renderer = new THREE.WebGLRenderer({antialias: true});
  }
  else {
    document.getElementById('container').innerHTML = '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><h1>You need a WebGL enabled browser to proceed.</h1>';
   
  }
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(this.renderer.domElement);
 
   domEvents   = new THREEx.DomEvents(this.cam, this.renderer.domElement);
  // Camera Controls initialization
  this.controls = new THREE.OrbitControls(this.cam, this.renderer.domElement);
  //this.controls.enabled = false;
  this.controls.autoRotateSpeed = 0.3;
  this.controls.addEventListener('change', bind(this, this.render));
  
  this.scene = new THREE.Scene();
  
  this.updateScene();
 
  
  
  };
  
//  ##     ## ########  ########     ###    ######## ######## 
//  ##     ## ##     ## ##     ##   ## ##      ##    ##       
//  ##     ## ##     ## ##     ##  ##   ##     ##    ##       
//  ##     ## ########  ##     ## ##     ##    ##    ######   
//  ##     ## ##        ##     ## #########    ##    ##       
//  ##     ## ##        ##     ## ##     ##    ##    ##       
//   #######  ##        ########  ##     ##    ##    ########

// This is run everytime the scene has to change.
  world.updateScene = function () {
    if (EskyboxFlag == 0) {
    Eskybox = 'panoramas/default.jpg';  
    }
    else {}
    
  // Eskybox = 'http://pantoto.net/panoramas/raw/esgshoot8-6-16/16gb%20sdcard/1/1_a.jpg';
     this.makeSphericalPano();
     
    
    this.cam.position.set(camPos[sceneNo].x,
                          camPos[sceneNo].y,
                          camPos[sceneNo].z);
    this.cam.updateProjectionMatrix;
    this.scene.add(this.cam);
    this.controls.target.set(camPos[sceneNo].x - 0.1,
                             camPos[sceneNo].y,
                             camPos[sceneNo].z);
    
    // attach event handlers
   
    this.renderer.domElement.addEventListener('mousewheel',bind(this, this.eventHandlers.onDocumentMouseWheel), false);
    //this.renderer.domElement.addEventListener('mousedown',bind(this,this.eventHandlers.onClick),false);
  // this.renderer.domElement.addEventListener('mousemove',bind(this,this.eventHandlers.onMouseMove),false);
    window.addEventListener('keydown',bind(this, this.eventHandlers.onKeydown), false);
    window.addEventListener('resize',bind(this, this.eventHandlers.onWindowResize),false);
    document.addEventListener( 'dragover',bind(this, this.eventHandlers.onDragOver),false);
    document.addEventListener( 'dragleave',bind(this, this.eventHandlers.onDragLeave),false);
    document.addEventListener( 'drop',bind(this, this.eventHandlers.onDrop),false);		      
		
    // action!
    this.animate.apply(this, arguments);
    
   
    
  };
  
//     ###    ##    ## #### ##     ##    ###    ######## ########       ###    ##    ## ########     ########  ######## ##    ## ########  ######## ########  
//    ## ##   ###   ##  ##  ###   ###   ## ##      ##    ##            ## ##   ###   ## ##     ##    ##     ## ##       ###   ## ##     ## ##       ##     ## 
//   ##   ##  ####  ##  ##  #### ####  ##   ##     ##    ##           ##   ##  ####  ## ##     ##    ##     ## ##       ####  ## ##     ## ##       ##     ## 
//  ##     ## ## ## ##  ##  ## ### ## ##     ##    ##    ######      ##     ## ## ## ## ##     ##    ########  ######   ## ## ## ##     ## ######   ########  
//  ######### ##  ####  ##  ##     ## #########    ##    ##          ######### ##  #### ##     ##    ##   ##   ##       ##  #### ##     ## ##       ##   ##   
//  ##     ## ##   ###  ##  ##     ## ##     ##    ##    ##          ##     ## ##   ### ##     ##    ##    ##  ##       ##   ### ##     ## ##       ##    ##  
//  ##     ## ##    ## #### ##     ## ##     ##    ##    ########    ##     ## ##    ## ########     ##     ## ######## ##    ## ########  ######## ##     ## 
  world.animate = function () {
      
      
    requestAnimationFrame(world.animate);
    world.controls.update();
    world.render.apply(world, arguments);
  };

  world.render = function () {
    if (sceneNum !== sceneNo) {
      sceneNo = sceneNum;
      
      this.updateScene();
    }
    
  this.cam.rotation.x+=0.001;
    this.renderer.render(this.scene, this.cam);
    
  
  };
  
//   #######  ########      #######  ########        ## ########  ######  ########  ######  
//  ##     ## ##     ##    ##     ## ##     ##       ## ##       ##    ##    ##    ##    ## 
//         ## ##     ##    ##     ## ##     ##       ## ##       ##          ##    ##       
//   #######  ##     ##    ##     ## ########        ## ######   ##          ##     ######  
//         ## ##     ##    ##     ## ##     ## ##    ## ##       ##          ##          ## 
//  ##     ## ##     ##    ##     ## ##     ## ##    ## ##       ##    ##    ##    ##    ## 
//   #######  ########      #######  ########   ######  ########  ######     ##     ######  
  /* Functions to draw different kinds of objects/system in the scene */
  
  
  world.changePano = function () {
    var preString = "../../"
    var temp = document.getElementById('panourl').value;
    var res = preString.concat(temp);
    
    EskyboxFlag = 1;
    Eskybox = res;
    world.updateScene();
   /* var xhttp = new XMLHttpRequest();
    
	xhttp.addEventListener("load", onLoad);
	xhttp.open("GET", "https://assets.rocketstock.com/uploads/ready-2-equi-1024x598.png", true);
	xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
	xhttp.send();
	
	function onLoad(){
		console.log('done');
	}*/
 };
 
  world.zoom = function (x) {
    if (this.cam.fov >=20 && this.cam.fov <=85 ) {
    if (x == 0) {
      this.cam.fov-=5;
    }
    else {
      this.cam.fov+=5;
    }
    }
    else if(this.cam.fov < 20 ){
	this.cam.fov = 20;
      }
      else if(this.cam.fov > 85 ){
	this.cam.fov = 85;
      }
    
    this.cam.updateProjectionMatrix();
    
 };
 
 world.fullScreen = function (x) {
  
    if (x == 0) {
      document.getElementById('resizef').style.visibility = 'hidden';
      document.getElementById('resizes').style.visibility = 'visible';
      	 var element = document.getElementById('container');
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
console.log(requestMethod);
    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
    }
    else if (x == 1) {
      document.getElementById('resizef').style.visibility = 'visible';
      document.getElementById('resizes').style.visibility = 'hidden';
      var element = document;
      var requestMethod = element.cancelFullScreen||element.webkitCancelFullScreen||element.mozCancelFullScreen||element.exitFullscreen;
      console.log(requestMethod);
       if (requestMethod) { 
	// Native full screen.
        requestMethod.call(element);
       }
       else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
      
      //document.webkitCancelFullScreen();
    }
    }
 };
 
  world.autoRotate = function (x) {
    if (x == 0) {
      console.log('s');
      document.getElementById('autorotateplay').style.visibility = 'hidden';
      document.getElementById('autorotatepause').style.visibility = 'visible';
      this.controls.autoRotate = true;
    }
    else if (x == 1) {
      document.getElementById('autorotateplay').style.visibility = 'visible';
      document.getElementById('autorotatepause').style.visibility = 'hidden';
      this.controls.autoRotate = false;
    }
  };
  
  
    
    
    

 

  
//   ######  ##    ## ##    ## ########   #######  ##     ## 
//  ##    ## ##   ##   ##  ##  ##     ## ##     ##  ##   ##  
//  ##       ##  ##     ####   ##     ## ##     ##   ## ##   
//   ######  #####       ##    ########  ##     ##    ###    
//        ## ##  ##      ##    ##     ## ##     ##   ## ##   
//  ##    ## ##   ##     ##    ##     ## ##     ##  ##   ##  
//   ######  ##    ##    ##    ########   #######  ##     ##
// Cubic Panorama function
  world.makeSkyBox = function () {
    var url=['panoramas/' + this.currentSkybox + '/posx.jpg',
	    'panoramas/' + this.currentSkybox + '/negx.jpg',
	    'panoramas/' + this.currentSkybox + '/posy.jpg',
	    'panoramas/' + this.currentSkybox + '/negy.jpg',
	    'panoramas/' + this.currentSkybox + '/posz.jpg',
	    'panoramas/' + this.currentSkybox + '/negz.jpg'],
    textureCube = THREE.CubeTextureLoader(url),
    material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube }),
    panoMeshGeo = new THREE.BoxGeometry(-50000, -50000, -50000),
    materialArray = [],
    panoMeshMat,
    i,
    cubeTex;
    for (i = 0; i < 6; i++) {
      var cubeMapTexture = new THREE.TextureLoader().load( url[i])
      materialArray.push(new THREE.MeshBasicMaterial({
			 map: cubeMapTexture,
			 side: THREE.FrontSide
			 }));
    }
    panoMeshMat = new THREE.MeshFaceMaterial(materialArray);
    this.panoMesh = new THREE.Mesh(panoMeshGeo, panoMeshMat);
    this.panoMesh.rotation.set(panoOffset[sceneNo].x,
                               panoOffset[sceneNo].y,
                               panoOffset[sceneNo].z);
    this.panoMesh.position.set(camPos[sceneNo].x,
                               camPos[sceneNo].y,
                               camPos[sceneNo].z);
    this.panoMesh.name = 'Pano Cube';
    var panos = this.scene.children.filter(function(item) {
      return item.name == 'Pano Cube';
    });
    if(panos.length == 0) {
      this.scene.add(this.panoMesh);
    }
    else {
      this.scene.remove(panos[0]);
      this.scene.add(this.panoMesh);
    }
  };
  
  world.makeSphericalPano = function () {
    
    var spheretexture = new THREE.TextureLoader().load(Eskybox);
    var geometry3 = new THREE.SphereGeometry(20000,50,50)
    geometry3.applyMatrix( new THREE.Matrix4().makeScale( 1, -1, 1 ) );
    this.sphere1 = new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial({map:spheretexture, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 140}));
    this.sphere1.position.set(camPos[sceneNo].x, camPos[sceneNo].y, camPos[sceneNo].z);
    this.scene.add(this.sphere1);
    this.sphere1.name = 'sphere1';
    this.sphere1.rotation.set(SpanoOffset[sceneNo].x, SpanoOffset[sceneNo].y, SpanoOffset[sceneNo].z);
      var Spanos = this.scene.children.filter(function(item) {
          return item.name == 'sphere1';
    });
    if(Spanos.length == 0) {
      this.scene.add(this.sphere1);
    }
    else {
      this.scene.remove(Spanos[0]);
      this.scene.add(this.sphere1);
    }
	    
	    };

  trans_obj = ['foobar', 'a farewell to arms', 'bag', 'book3'];
  
//  ######## ##     ## ######## ##    ## ########  ######  
//  ##       ##     ## ##       ###   ##    ##    ##    ## 
//  ##       ##     ## ##       ####  ##    ##    ##       
//  ######   ##     ## ######   ## ## ##    ##     ######  
//  ##        ##   ##  ##       ##  ####    ##          ## 
//  ##         ## ##   ##       ##   ###    ##    ##    ## 
//  ########    ###    ######## ##    ##    ##     ######  
// all event handlers of the 3D world
  world.eventHandlers = {
    onDocumentMouseWheel: function (event) {
      
      // WebKit
      //fov limits = 20 and 85
      if (this.cam.fov >=20 && this.cam.fov <=85 ) {
	
      
      if ( event.wheelDeltaY ) {
	this.cam.fov -= event.wheelDeltaY * 0.005;
      }
      // Opera / Explorer 9
      else if ( event.wheelDelta ) {
	this.cam.fov -= event.wheelDelta * 0.005;
      }
      // Firefox
      else if ( event.detail ) {
	this.cam.fov -= event.detail * 0.05;
      }	
      
      }
      else if(this.cam.fov < 20 ){
	this.cam.fov = 20;
      }
      else if(this.cam.fov > 85 ){
	this.cam.fov = 85;
      }
      this.cam.updateProjectionMatrix();
      console.log(this.cam.fov);
    },
			
    onClick: function (event) {
      event.preventDefault();
      var info;
      
      mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
      var raycaster = new THREE.Raycaster();
      raycaster.setFromCamera( mouse, this.cam );
      var intersects = raycaster.intersectObjects( this.scene.children );
      if ( intersects.length > 0 ) {
	for (var i = 0; i < intersects.length; i++) {
	  //for (var j = 0; j < trans_obj.length; j++) {
	    if (intersects[i].object.name === 'philly_object') {
	      console.log(intersects[i].object.name);
	      this.controls.enabled = false;
	      this.trans_control.attach(intersects[i].object);
	      this.trans_control.enabled = true;
	      //display some help info
	      info = '<small>Keys | t : translate | y : scale |' +
	      ' r : rotate | u : quit </small>';
	      document.getElementById('info').innerHTML = info;
	      
	    //}
	    }
	    for(var k=0; k< world.hotspots.length; k++)
	    { var name = 'hs'+k;
		if (intersects[i].object.name == name){
		  
		sceneNum = k;
		info = 'This is '+ k + ' Pano';
		
		document.getElementById('info').innerHTML = info;
	      }
	    }
	 
	} 
      }
    },
    
    
    onKeydown: function (event) {
      
      var variable = this.sphere1.rotation;
      switch (event.keyCode) {
	
	case 85: // U
	  this.trans_control.enabled = false;
	  this.controls.enabled = true;
	  // is there something to detach this object? confirm it
	  this.trans_control.detach(this.trans_control.object);
	  document.getElementById('info').innerHTML = '';
	  break;
	case 82: // R
	  this.trans_control.setMode("rotate");
	  break;
	case 89: // Y
	  this.trans_control.setMode("scale");
	  break;
	case 84: // T
	  this.trans_control.setMode("translate");
	  break;
	//for rotation of panorama sphere
	case 65: // A
	  variable.x-=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
        case 68: //D
	  variable.x+=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
	case 87: //W
	  variable.y+=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
	case 83: //S
	  variable.y-=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
	case 81: //Q
	  variable.z+=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
	case 69: //E
	  
	  variable.z-=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;

//document.webkitExitFullscreen()
//document.webkitCancelFullScreen();
//document.mozCancelFullScreen();
//console.log('s');
         
        

	  break;
	case 90: //Z
	 // rotSpeed = 0.1;
	 //
	/* var element = document.getElementById('container');
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
console.log(requestMethod);
    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }

	 var el = document;
            var requestMethod = el.cancelFullScreen||el.webkitExitFullScreen||el.mozCancelFullScreen||el.exitFullscreen;
            
               if (requestMethod) { // cancel full screen.
		
                requestMethod.call(el);
		console.log(requestMethod);
		
            } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
       
	document.mozCancelFullScreen();
	console.log('s');

 */
	//document.getElementById('container').webkitRequestFullScreen();
	this.controls.enabled = false;
	      this.trans_control.attach(this.philly_selector);
	      this.trans_control.enabled = true;
	      //display some help info
	     /* info = '<small>Keys | t : translate | y : scale |' +
	      ' r : rotate | u : quit </small>';
	      document.getElementById('info').innerHTML = info;*/
	      


	
  

	  break;
	case 88: //X
	  rotSpeed = 0.01;
	  break;
	  
	    
	
      }
    },
    
    onWindowResize: function (event) {
      this.aspect_ratio = window.innerWidth / window.innerHeight;
      this.cam.aspect = this.aspect_ratio;
      this.cam.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    },
        onDragOver: function (event){
	  event.preventDefault();
	  event.dataTransfer.dropEffect = 'copy';

	  },
   onDragLeave: function (event) {
    event.preventDefault();
   },
    onDrop: function (event) {
      event.preventDefault();
      var file = event.dataTransfer.files[ 0 ];
      var filename = file.name;
      var extension = filename.split( '.' ).pop().toLowerCase();
      var reader = new FileReader();
      reader.onload = function ( event ) {
      var x = event.target.result;
       world.sphere1.material.map = new THREE.TextureLoader().load(x);
					}
      reader.readAsDataURL(file);
				
      
    }
  };
})(world);
