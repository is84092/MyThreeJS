/*! videojs-vr - v0.1.0 - 2014-04-09
 * Copyright (c) 2014 Sean Lawrence; Licensed  */
/*
 * vr
 * https://github.com/slawrence/videojs-vr
 *
 * Copyright (c) 2014 Sean Lawrence
 * Licensed under the MIT license.
 */
(function (vjs) {

    /**
     * Copies properties from one or more objects onto an original.
     */
    var extend = function (obj /*, arg1, arg2, ... */) {
            var arg, i, k;
            for (i = 1; i < arguments.length; i++) {
                arg = arguments[i];
                for (k in arg) {
                    if (arg.hasOwnProperty(k)) {
                        obj[k] = arg[k];
                    }
                }
            }
            return obj;
        },

        projections = ["Sphere", "Cylinder", "Cube", "Plane"],

        defaults = {
            projection: "Sphere"
        },

        /**
         * Initializes the plugin
         */
        plugin = function (options) {
            //vars global (via closure) to the plugin
            var player = this,
                settings = extend({}, defaults, options || {}),
                videoEl = this.el().getElementsByTagName('video')[0],
                container = this.el(),
                current_proj = settings.projection,
                movieMaterial,
                movieGeometry,
                movieScreen,
                scene,
                controls;

            function changeProjection(projection) {
                var position = {x: 0, y: 0, z: 0};
                if (scene) {
                    scene.remove(movieScreen);
                }
                if (projection === "Sphere") {
                    movieGeometry = new THREE.SphereBufferGeometry(256, 32, 32);
                } else if (projection === "Cylinder") {
                    movieGeometry = new THREE.CylinderGeometry(256, 256, 256, 50, 50, true);
                } else if (projection === "Cube") {
                    movieGeometry = new THREE.CubeGeometry(256, 256, 256);
                } else if (projection === "Plane") {
                    movieGeometry = new THREE.PlaneGeometry(480, 204, 4, 4);
                    position.z = -256;
                }
                movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
                movieScreen.position.set(position.x, position.y, position.z);
                movieScreen.scale.x = -1;
                scene.add(movieScreen);
            }

            function initScene() {
                var time = Date.now(),
                    videoTexture,
                    requestId,
                    renderer,
                    camera,
                    renderedCanvas;

                camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
                scene = new THREE.Scene();

                controls = new THREE.VRControls(camera);

                videoTexture = new THREE.VideoTexture(videoEl);
                videoTexture.generateMipmaps = false;
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBFormat;

                movieMaterial = new THREE.MeshBasicMaterial({
                    map: videoTexture,
                    overdraw: true,
                    side: THREE.DoubleSide
                });
                changeProjection(current_proj);
                camera.position.set(0, 0, 0);

                renderer = new THREE.WebGLRenderer({
                    devicePixelRatio: window.devicePixelRatio,
                    alpha: false,
                    clearColor: 0xffffff,
                });

                renderer.setSize(window.innerWidth, window.innerHeight);


                renderedCanvas = renderer.domElement;
                renderedCanvas.style.width = "inherit";
                renderedCanvas.style.height = "inherit";
                renderedCanvas.addEventListener( 'click', vidplay, false ); 

                container.insertBefore(renderedCanvas, container.firstChild);
                videoEl.style.display = "none";



                // Handle window resizes
                function onWindowResize() {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                }

                window.addEventListener('resize', onWindowResize, false);
                
                function vidplay() {
                     if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                };

                (function animate() {
                    if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA) {
                        if (videoTexture) {
                            videoTexture.needsUpdate = true;
                        }
                    }
                    controls.update();
                    requestId = window.requestAnimationFrame(animate);
                    renderer.render(scene, camera);

                }());


            }

            initScene();


            return {
                changeProjection: changeProjection
            };
        };

    // register the plugin with video.js
    vjs.plugin('vr', plugin);

}(window.videojs));
