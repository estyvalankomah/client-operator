export var processor = {
    
    timerCallback: function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      var self = this;
      setTimeout(function () {
        self.timerCallback();
      }, 16);
    },
  
    doLoad: function() {
      this.video = document.querySelector("video");
      this.c1 = document.querySelector("canvas");
      this.ctx1 = this.c1.getContext("2d");
      var self = this;
  
      this.video.addEventListener("play", function() {
        self.width = self.video.width;
        self.height = self.video.height;
        self.timerCallback();
      }, false);
    },
  
    computeFrame: function() {
      this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
  
      return;
    }
};

// export function getFrame(){
//   let canvas = document.querySelector("canvas");
//   let ctx = canvas.getContext("2d");
//   let frame = ctx.getImageData(0,0,500,450)

//   return frame
// }