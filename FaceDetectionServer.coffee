# https://github.com/peterbraden/node-opencv
# TODO: Test, Refactor, Credits, etc.


# TODO: Test after opencv installs
cv = require 'opencv'
borderColor = [0, 255, 0]
borderWidth = 2

faceDecection = (image) ->
    cv.readImage image, (err, im) ->
        if err
            throw err
        if im.width() < 1 or im.height() < 1
            throw new Error 'Image has no size'

        im.detectObject 'haarcascade_frontalface_alt2.xml', {}, (err, faces) ->
            if err
                throw err

            for face in faces
                im.rectangle [face.x, face.y], [face.width, face.height], borderColor, borderWidth

            # TODO: Return this saved image
            im.save('./tmp/face-detected.png');
            return

        return
    return


WebSocketServer = require 'ws'
    .Server

wss = new WebSocketServer { port: 8080 }
    .on 'connection', (ws) ->
        ws.on 'message', (message) ->

            image = faceDetection message

            ws.send image
            return






# cv.readImage("./examples/files/mona.png", function(err, im){
#   im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
#     for (var i=0;i<faces.length; i++){
#       var x = faces[i]
#       im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
#     }
#     im.save('./out.jpg');
#   });
# })