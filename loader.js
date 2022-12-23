"use strict";
//info at the bottom
class ClipPathVideo {
    constructor(pathElement, partsAmount, frameTiming) {
        this.loadingPart = 1;
        this.framesArray = [];
        this.status = "stop";
        this.idFrameTimer = null;
        this.idUpdateRateTimer = null;
        this.updateFramBuffer();



        this.pathElement = pathElement;
        this.partsAmount = partsAmount;
        this.millisFrames = frameTiming;


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






//Clip Path player
//usage:
// create obj with new command:  let badApple = new ClipPathVideo (pathElement, partsAmount, frameTiming)
//"path element" - element with path property inside
//"partsAmount" - path lines are divided into several files so browser won't load a 65Mb text file. This is how many of this files there are.
//"frameTiming " - milliseconds for the next frame to appear

//methods
// .play() .pause() .stop()



let badApple = new ClipPathVideo(document.querySelector("#my-clip-path").querySelector("path"), 65, 65);
badApple.play();







