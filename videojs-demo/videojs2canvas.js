/**
 * Created by Jacker on 2016/4/25.
 */
(function () {
    var plugin;

    // create a really simple plugin
    plugin = function (options) {
        var player = this,
            videoEl = this.el().getElementsByTagName('video')[0],
            container = this.el(),
            movieMaterial,
            movieGeometry,
            movieScreen,
            scene,
            controls;

        console.log(container);
        console.log(videoEl);

        var renderedCanvas = document.createElement("canvas");
        renderedCanvas.style.width = "inherit";
        renderedCanvas.style.height = "inherit";

        videoEl.parentElement.insertBefore(renderedCanvas, videoEl.parentElement.firstChild);
        videoEl.style.display = "none";
        renderedCanvas.style.display = "none";
        
    };

    // register the plugin
    videojs.plugin('vr', plugin);

})();
