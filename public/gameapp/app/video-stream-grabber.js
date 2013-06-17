(function(exports) {
	var VideoStreamGrabber = function (spec) {
		var that = this;
		
		Observable.call(this);
		
		if (spec.frameListener) {
			this.bind("frame", spec.frameListener);
		}
		
		this.scale = spec.scale || 1;
		this.frameRate = spec.frameRate || 10;
		this.video = document.querySelector(spec.videoSelector);
		this.frameWidth = this.video.getAttribute("width");
		this.frameHeight = this.video.getAttribute("height");
		
		this.setupCanvas();
	};
	VideoStreamGrabber.prototype = new Observable();
	
	VideoStreamGrabber.prototype.setupCanvas = function () {
		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("width", this.video.getAttribute("width") * this.scale);
		this.canvas.setAttribute("height", this.video.getAttribute("height") * this.scale);
		this.canvas.setAttribute("style", "display: none;");
		document.body.appendChild(this.canvas);
		this.context = this.canvas.getContext("2d");
	};
	VideoStreamGrabber.prototype.startCapturing = function (postProcessor) {
		var that = this;
		
		this.interval = window.setInterval(function () {
			that.context.drawImage(that.video, 0, 0, that.frameWidth * that.scale, that.frameHeight * that.scale);
			if (postProcessor) {
				postProcessor(that.context, that.frameWidth * that.scale, that.frameHeight * that.scale);
			}
			that.emit("frame", {
				width: that.frameWidth * that.scale,
				height: that.frameHeight * that.scale,
				/*data: that.context.getImageData(0, 0, that.frameWidth * that.scale, that.frameHeight * that.scale),*/
				base64: that.canvas.toDataURL()
			});
		}, 1000 / that.frameRate);
	};
	
	VideoStreamGrabber.prototype.stopCapturing = function () {
		window.clearInterval(this.interval);
	};
	VideoStreamGrabber.prototype.convertClampedToArray = function (uInt8ClampedArray) {
		var arr = [];
		Array.prototype.forEach.call(uInt8ClampedArray, function(val, idx) {
			arr[idx] = val;
		});
		return arr;
	};
	namespace("firewire", {
		VideoStreamGrabber: VideoStreamGrabber
	});
	
}(this));
