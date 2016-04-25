
/**
 * Created by Jacker on 2016/4/25.
 */
(function () {
    var plugin;

    // create a really simple plugin
    plugin = function (options) {
        var togglePlay;
        var btn = document.getElementById("play-btn");
        btn.disabled = true;
        var player = this,
            videoEl = this.el().getElementsByTagName('video')[0];
        var camera, scene, renderer, geometry, texture, mesh;
        var width = window.innerWidth, height = window.innerHeight;

        var renderedCanvas = document.createElement("canvas");
        renderedCanvas.style.width = "inherit";
        renderedCanvas.style.height = "inherit";

        videoEl.parentElement.insertBefore(renderedCanvas, videoEl.parentElement.firstChild);
        videoEl.style.display = "none";

        var prms1 = new Promise(function (resolve, reject) {
            videoEl.addEventListener('canplay', function () {
                resolve();
            });
            videoEl.addEventListener('error', function () {
                reject();
                alert('failed loading video');
            });
        });


        Promise.all([prms1]).then(function () {
            btn.disabled = false;
        });
        videoEl.load();
        renderer = new THREE.WebGLRenderer({ canvas: renderedCanvas } );
        renderer.setPixelRatio( window.devicePixelRatio );
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, width / height, 1, 1100 );
        camera.target = new THREE.Vector3( 0, 0, 0 );
        scene.add(camera);
        texture = new THREE.VideoTexture( videoEl );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        var material = new THREE.MeshBasicMaterial({ map: texture });
        geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
        geometry.scale(-1, 1, 1);
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
        (function animate() {
            if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA) {
                texture.needsUpdate = true;
            }
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }());
        togglePlay = function () {
            console.log("test");
            if (videoEl.paused) {
                videoEl.play();
                (function loop() {
                    if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA) {
                        texture.needsUpdate = true;
                    }
                    requestAnimationFrame(loop);
                    renderer.render(scene, camera);
                }());
            } else {
                videoEl.pause();
            }
        };
        btn.addEventListener('click', togglePlay);

    };

    // register the plugin
    videojs.plugin('vr', plugin);


})();
