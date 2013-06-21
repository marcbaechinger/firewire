'use strict';

function GameController($scope, backend, uuid, gamestepper) {
	var that = this,
		videoScaleFactor = 1,
		video = document.querySelector("#video"),
		audioCamera = document.querySelector("#audioCamera"),
		audioStart = document.querySelector("#audioStart"),
		audioSuccess = document.querySelector("#audioSuccess"),
		audioFailed = document.querySelector("#audioFailed"),
		audioMilestone1 = document.querySelector("#audioMilestone1"),
		audioMilestone2 = document.querySelector("#audioMilestone2"),
		audioMilestone3 = document.querySelector("#audioMilestone3"),
		lightBox = angular.element(document.querySelector(".pictures")),
		milestonePanel = angular.element(document.querySelector("#panel-right")),
		resultPanel = angular.element(document.getElementById("result-panel")),
		frameGrabber,
		bannerGradient,
		clockInterval,
		logo = new Image(),
		clearClockInterval = function () {
			if (clockInterval) {
				clearInterval(clockInterval);
				clockInterval = undefined;
			}
		}, 
		frameListener = function (frame) {
			$scope.$apply(function () {
				frameGrabber.stopCapturing();
				console.log("unshift frame into pic array");
				$scope.model.pictures.unshift(frame);
				backend.sendStepEvent({
					id: $scope.model.gameId,
					player: $scope.model.player,
					image: frame.base64,
					timestamp: new Date(),
					duration: $scope.model.time,
					type: $scope.model.lastStep
				});
			});
		},
		milestone = function (num) {
			if ($scope.model.milestone === num - 1) {
				// passes milestone corrctly
				$scope.model.milestone = num;
				$scope.takePicture("Milestone " + num + " completed!", "darkgreen");
				milestonePanel.addClass("m" + num);
				$scope.model.milestones.push({
					num: num,
					time: $scope.model.time,
					errorCount: $scope.model.errors.length
				});
			} else if ($scope.model.milestone !== num) {
				// uncorrect milestone passed
				addError($scope, "Wrong milestone!");
			}
		},
		formatTime = function (seconds) {
			var min = Math.floor(seconds/60),
				sec = seconds % 60;
			return min + ":" + (sec > 9 ? sec + "" : "0" + sec + "");
		}, 
		addError = function ($scope, msg) {
			$scope.model.errors.push({
				time: $scope.model.time,
				msg: msg
			});
			$scope.takePicture(msg, "rgba(200, 0, 0, 1)");
		},
		qrCodeGenerator,
		createQrCode = function () {
			if (!qrCodeGenerator) {
				qrCodeGenerator = new QRCode("qrcode", {
				    width: 256,
				    height: 256,
				    colorDark : "#000000",
				    colorLight : "#ffffff",
				    correctLevel : QRCode.CorrectLevel.H
				});
			}
			qrCodeGenerator.clear();
			qrCodeGenerator.makeCode(document.location.host + "/resultapp/index.html#/results/" + $scope.model.gameId); 
		};
		
	logo.src = '/gameapp/img/logo.png';
	
	$scope.model = {
		pictures: [],
		player: "Charles Aznavour",
		lastStep: undefined,
		gameId: undefined,
		errors: [],
		milestones: [],
		gameStarted: false,
		challengeStarted: false,
		challengeCompleted: false,
		failed: false,
		milestone: 0,
		time: 0
	};
	
	$scope.resetChallenge = function () {
		clearClockInterval();
		frameGrabber.stopCapturing();
		lightBox.removeClass("finished");
		milestonePanel
			.removeClass("completed")
			.removeClass("started")	
			.removeClass("m1")
			.removeClass("m2")
			.removeClass("m3");
			
		$scope.model.pictures = [];
		$scope.model.errors = [];
		$scope.model.milestones = [];
		$scope.model.challengeStarted = false;
		$scope.model.challengeCompleted = false;
		$scope.model.failed = false;
		$scope.model.milestone = 0;
		$scope.model.time = 0;
	};
	
	$scope.stopGame = function() {
		console.log("GameController.stopGame():");
		if (video.mozSrcObject) {
			console.log("stop capture for moz");
			// FIXME implement closing webcam for ff
			video.mozSrcObject = null;
			delete video.src;
		} else {
			console.log("stop capture for chrome");
			// FIXME implement closing webcam for chrome
			//webkitURL.revokeObjectURL(video.src);
			video.src = "";
		}
		$scope.model.gameStarted = false;
		video.pause();
	};
	$scope.startGame = function() {
		that.getUserMedia(
			{video: true, audio: false}, 
			function (stream) {
				if (navigator.mozGetUserMedia) {
					video.mozSrcObject = stream;
				} else {
					video.src = (window.webkitURL || window.URL).createObjectURL(stream);
				}
				video.play();
				frameGrabber = new firewire.VideoStreamGrabber({
					videoSelector: "#video",
					frameListener: frameListener,
					scale: videoScaleFactor
				});
				$scope.$apply(function () {
					$scope.model.gameStarted = true;
					console.log("video stream opened");	
				});
			}, 
			function () { 
				console.log("failed", arguments); 
			}
		);	
	};
	$scope.takePicture = function (text, fillStyle, font) {
		console.log("take picture");
		frameGrabber.startCapturing(function (context, width, height) {
			if (text) {
		
				if (!bannerGradient) {
					bannerGradient = context.createLinearGradient(0,0,width,height);
					bannerGradient.addColorStop(0, "rgba(255,255,255,0.8)");
					bannerGradient.addColorStop(0.8, "rgba(255,255,255,0)");
				}
								
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				
				// banner at bottom
				context.fillStyle = bannerGradient;
				context.fillRect(0, height - 56, width, 56);
				
				// main text in banner
				context.fillStyle = fillStyle || "rgba(0,0,0,1)";
				context.font = font || "24px Tahoma";
				context.fillText(text, 24, height - 18);
				
				// 
				context.fillStyle = "rgba(0,0,0, 0.6)";
				context.fillRect(12, 12, 48, 24);
				context.fillRect(width - 64, 12, 24, 24);
				context.fillRect(width - 32, 12, 24, 24);
								
				context.fillStyle = "rgba(255,255,255,1)";
				context.font = "16px Tahoma";
				context.fillText(formatTime($scope.model.time), 20, 30);
								
				context.fillStyle = "rgba(255,0,0,1)";
				context.fillText($scope.model.errors.length, width - 64 + 8, 30);
				context.fillStyle = "green";
				context.fillText($scope.model.milestone, width - 32 + 6, 30);
				
				context.shadowOffsetX = 2;
				context.shadowOffsetY = 2;
				context.shadowBlur = 8;
				context.shadowColor = "rgba(0, 0, 0, 0.6)";
				
				context.drawImage(logo, width - 70, height - 66, 60, 59);
				audioCamera.play();
			}
		});
	};
	$scope.challengeStart = function () {
		console.log("challengeStart()");
		if (!$scope.model.challengeStarted) {
			resultPanel.removeClass("show");
			$scope.model.challengeStarted = true;
			$scope.model.lastStep = "game-start";
			$scope.takePicture("Challenge started!", "orange");
			milestonePanel.addClass("started");
			if (!clockInterval) {
				clockInterval = setInterval(function () {
					$scope.$apply(function () {
						$scope.model.time++;
					});
				}, 1000); 
			}
			$scope.model.gameId = uuid();
			setTimeout(function() {
				audioStart.play();
			}, 1000);
		}
	};
	$scope.challengeEnd = function () {
		$scope.model.challengeCompleted = true;
		$scope.model.lastStep = "game-complete";
		$scope.takePicture("Challenge finished!", "orange");
		resultPanel.addClass("show");
		milestonePanel.addClass("completed");
		clearClockInterval();
		createQrCode();
		lightBox.addClass("finished");
		setTimeout(function() {
			audioSuccess.play();
		}, 1000);
		
	};
	$scope.wireContact = function () {
		$scope.model.challengeCompleted = true;
		$scope.model.failed = true;
		$scope.model.lastStep = "failure";
		addError($scope, "Outsch... failure!");
		
		milestonePanel.addClass("completed");
		clearClockInterval();
		createQrCode();
		resultPanel.addClass("show");
		lightBox.addClass("finished");
		setTimeout(function() {
			audioFailed.play();
		}, 1000);
	};
	$scope.milestone1 = function () {
		$scope.model.lastStep = "milestone-1";
		milestone(1);
		setTimeout(function() {
			audioMilestone1.play();
		}, 1000);
	};
	$scope.milestone2 = function () {
		$scope.model.lastStep = "milestone-2";
		milestone(2);
		setTimeout(function() {
			audioMilestone2.play();
		}, 1000);
	};
	$scope.milestone3 = function () {
		$scope.model.lastStep = "milestone-3";
		milestone(3);
		setTimeout(function() {
			audioMilestone3.play();
		}, 1000);
	};
	
	gamestepper.registerForCommand($scope, function(data) {
		if (data.type === "start") {
			$scope.model.player = data.name;
			$scope.resetChallenge();
			$scope.challengeStart();
		}
	});
	
	$scope.startGame();
};

GameController.prototype.getUserMedia = function () {
	(navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia).apply(navigator, arguments);
};
GameController.$inject = ["$scope", "backend", "uuid", "gamestepper"];
