var FaceDetection, demo;

FaceDetection = (function() {
  function FaceDetection(video, canvas, output, faceDetection) {
    var self;
    this.video = video;
    this.canvas = canvas;
    this.output = output;
    navigator.getUserMedia = this.hasGetUserMedia();
    this.output = document.getElementById(this.output);
    console.log(this.output);
    if (faceDetection) {
      self = this;
      this.ws = new WebSocket('ws://127.0.0.1:8080');
      this.ws.onopen = function() {
        return console.log('Openened connection to WebSocket server.');
      };
      this.ws.onmessage = function(message) {
        var url;
        url = window.URL.createObjectURL(message.data);
        self.output.onload = function() {
          window.URL.revokeObjectURL(url);
        };
        self.output.src = url;
      };
    }
    if (navigator.getUserMedia) {
      this.video = document.getElementById(this.video);
      navigator.getUserMedia({
        video: true
      }, this.onGetUserMediaSuccess, this.onGetUserMediaError);
    } else {
      console.log('’getUserMedia’ is not supported.');
    }
    if (this.canvas) {
      this.canvas = document.getElementById(this.canvas);
      this.drawCanvasImage(faceDetection);
    }
  }

  FaceDetection.prototype.hasGetUserMedia = function() {
    return navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  };

  FaceDetection.prototype.onGetUserMediaSuccess = function(stream) {
    this.video.src = URL.createObjectURL(stream);
  };

  FaceDetection.prototype.onGetUserMediaError = function() {
    return 'Unable to connect to the video stream.';
  };

  FaceDetection.prototype.dataURItoBlob = function(dataURI) {
    var byteString, i, ia, j, mimeString, ref;
    byteString = dataURI.split(','[0].indexOf('base64' >= 0)) ? byteString = atob(dataURI.split(',')[1]) : byteString = unescape(dataURI.split(',')[1]);
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    ia = new Uint8Array(byteString.length);
    for (i = j = 0, ref = byteString.length; j <= ref; i = j += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
      type: mimeString
    });
  };

  FaceDetection.prototype.sendDataToServer = function(data) {
    var blob;
    blob = this.dataURItoBlob(data);
    this.ws.send(blob);
  };

  FaceDetection.prototype.drawCanvasImage = function(faceDetection) {
    var ctx, self, timerId;
    self = this;
    ctx = self.canvas.getContext('2d');
    timerId = setInterval(function() {
      var data;
      ctx.drawImage(self.video, 0, 0, 320, 240);
      data = self.canvas.toDataURL('image/jpeg', 1.0);
      if (faceDetection) {
        self.sendDataToServer(data);
      }
    }, 1000);
  };

  return FaceDetection;

})();

demo = new FaceDetection('video', 'canvas', 'output', true);
