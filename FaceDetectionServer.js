var WebSocketServer, borderColor, borderWidth, cv, faceDecection, wss;

cv = require('opencv');

borderColor = [0, 255, 0];

borderWidth = 2;

faceDecection = function(image) {
  cv.readImage(image, function(err, im) {
    if (err) {
      throw err;
    }
    if (im.width() < 1 || im.height() < 1) {
      throw new Error('Image has no size');
    }
    im.detectObject('haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
      var face, i, len;
      if (err) {
        throw err;
      }
      for (i = 0, len = faces.length; i < len; i++) {
        face = faces[i];
        im.rectangle([face.x, face.y], [face.width, face.height], borderColor, borderWidth);
      }
      im.save('./tmp/face-detected.png');
    });
  });
};

WebSocketServer = require('ws').Server;

wss = new WebSocketServer({
  port: 8080
}).on('connection', function(ws) {
  return ws.on('message', function(message) {
    var image;
    image = faceDetection(message);
    ws.send(image);
  });
});
