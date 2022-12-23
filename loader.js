"use strict";

class ClipPathVideo {
    constructor(pathElement, partsAmount, frameRate) {
        this.loadingPart = 1;
        this.framesArray = [];
        this.status = "stop";
        this.idFrameTimer = null;
        this.idUpdateRateTimer = null;
        this.updateFramBuffer();



        this.pathElement = pathElement;
        this.partsAmount = partsAmount;
        this.millisFrames = frameRate;


    }

    play() {
        if (this.status === "stop") {
            this.idUpdateRateTimer = setInterval(this.updateFramBuffer.bind(this), this.millisFrames * 30);
            this.idFrameTimer = setInterval(this.frame.bind(this), this.millisFrames);
            this.status = "play";
        }
        if (this.status === "pause") {
            this.status = "play";
        }

    }

    pause() {
        this.status = "pause";
    }

    stop() {
        this.status = "stop";
        clearInterval(this.idFrameTimer);
        clearInterval(this.idUpdateRateTimer);
    }

    updateFramBuffer() {
        if (this.status === "pause") {
            return;
        }

        if (this.partsAmount === this.loadingPart) {
            clearInterval(this.idUpdateRateTimer);
            return;
        }
        fetch(`./frames/render-${this.loadingPart}00`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }).then(response => response.text())
            .then((text) => {
                this.framesArray = this.framesArray.concat(text.split("\n"));
                //console.log("Loading Part N " + this.loadingPart);
                this.loadingPart++;
            }
            );
    }

    frame() {
        if (this.status === "pause") {
            return;
        }
        this.pathElement.setAttribute("d", this.framesArray.shift());
        //console.log(this.framesArray.length);
        if (this.framesArray.length === 0 && this.loadingPart !== 1) {
            this.stop();
        }
    }
}


let badApple = new ClipPathVideo(document.querySelector("#my-clip-path").querySelector("path"), 65, 65);
//let audio = new Audio('./audio/music.mp3');
//document.body.addEventListener('click', startPlay, true); 

badApple.play();


// function startPlay() {
//     badApple.play();
//     document.querySelector("#playbutton").classList.add('hide');
//     document.querySelector("#playbutton").classList.remove('show');
//     audio.play();
// }






