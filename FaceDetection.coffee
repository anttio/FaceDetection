class FaceDetection


    constructor: (@video, @canvas, @output, faceDetection) ->
        navigator.getUserMedia = @hasGetUserMedia()

        @output = document.getElementById @output
        console.log @output

        # If face detection true then open WebSocket connection
        # TODO: Refactor
        if faceDetection
            self = @
            @ws = new WebSocket 'ws://127.0.0.1:8080'

            # Open the WebSocket connection
            @ws.onopen = ->
                console.log 'Openened connection to WebSocket server.'

            # Receive data from server
            @ws.onmessage = (message) ->
                url = window.URL.createObjectURL message.data

                self.output.onload = ->
                    window.URL.revokeObjectURL url
                    return

                self.output.src = url
                return


        # Video
        if navigator.getUserMedia
            @video = document.getElementById @video
            navigator.getUserMedia { video: true }, @onGetUserMediaSuccess, @onGetUserMediaError
        else
            console.log '’getUserMedia’ is not supported.'

        # Canvas
        if @canvas
            @canvas = document.getElementById @canvas
            @drawCanvasImage faceDetection


    hasGetUserMedia: ->
        return navigator.getUserMedia or
               navigator.webkitGetUserMedia or
               navigator.mozGetUserMedia or
               navigator.msGetUserMedia


    onGetUserMediaSuccess: (stream) ->
        @video.src = URL.createObjectURL stream
        return


    onGetUserMediaError: ->
        'Unable to connect to the video stream.'


    dataURItoBlob: (dataURI) ->
        byteString =

        if dataURI.split ','[0].indexOf 'base64' >= 0
            byteString = atob(dataURI.split(',')[1])
        else
            byteString = unescape(dataURI.split(',')[1])

        mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        ia = new Uint8Array byteString.length
        ia[i] = byteString.charCodeAt i for i in [0..byteString.length] by 1

        return new Blob [ia], { type: mimeString }


    sendDataToServer: (data) ->
        blob = @dataURItoBlob data
        @ws.send blob
        return


    drawCanvasImage: (faceDetection) ->
        self = @
        ctx = self.canvas.getContext '2d'

        timerId = setInterval ->
            ctx.drawImage self.video, 0, 0, 320, 240
            data = self.canvas.toDataURL 'image/jpeg', 1.0
            if faceDetection
                self.sendDataToServer data
            return
        , 1000

        return


# Create FaceDetection instance
demo = new FaceDetection('video', 'canvas', 'output', true)
