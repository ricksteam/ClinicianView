    
    var moment = require("moment");
    var child = require("child_process").spawn;
    var path = require("path");
    var fs = require("fs");
    var net = require("net");
    var express = require('express');
    var app = express();
    var http = require("http").Server(app);
    var io = require('socket.io')(http);
    var client = new net.Socket();

    var container = document.getElementById('container');

      var app = new Vue({
        el: '#app',
        data: {
          socket: {},
          game: null,
          currentView: "login",
          currentGame: "BoxAndBlocks",
          reply: "",
          rows: [],
          patient_id: "",
          session_start: null,
          leftSensitivity: 5,
          rightSensitivity: 5,
          now: moment(),
          kinectDataRight: [],
          kinectDataLeft: [],
          maxIdLength: 25
        },
        mounted() {
          this.fakeMounted();

        


      },
      methods: {
        fakeMounted(){
          //console.log("mounted");
          var self = this; 
          io.on('connection', function(socket){
            self.socket=socket;
            socket.on("USER_CONNECTED", function (msg) {
              app.reply = msg;
              console.log("Client Connected " + msg.name);
    
            });
            socket.on("forClinician", function (data) {
              console.log(data.data);
              var hoop = document.getElementById("hoop");
              var diff = document.getElementById("difficulty");
              var shift = document.getElementById("shift");
              if (data.type == "toggleHoop") {
                hoop.checked = (data.data == "True") ? true : false;
                //app.planeGameSettings.oscillation = data.data;
              }
              else if(data.type == "difficulty")
              {
                console.log("diff RETURN");
                diff.value = parseFloat(data.data);
                
              }
              else if(data.type == "shift")
              {
                shift.value = parseFloat(data.data);
              }
              else if(data.type == "kinectDataRight")
              {
                
                app.kinectDataRight = data.data;
              }
              else if(data.type == "kinectDataLeft")
              {
                app.kinectDataLeft = data.data;
              }
            });
          });
        },
        setPath() {
          var f = document.getElementById("file");
          f.click();

        },
        changePath() {
          var f = document.getElementById("file");
          var pth = f.files[0].path.replace("\\", "\\\\")
          this.setText(pth);
          switch (this.currentGame) {
            case "BoxAndBlocks":

              localStorage.setItem("BoxAndBlocks", pth);
              break;
            case "PlaneGame":
              localStorage.setItem("PlaneGame", pth);
              break;
            case "BalloonGame":
              localStorage.setItem("BalloonGame", pth);
              break;
            case "CarGame":
              localStorage.setItem("CarGame", pth);
              break;
          }
        },

        launchBoxAndBlocks() {
          this.currentGame = "BoxAndBlocks";
          this.currentView = "clinician";


          var pth = localStorage.getItem("BoxAndBlocks");
          console.log(pth);
          //var pathToBinary = path.join(); 
          this.setText(pth);
          if (fs.existsSync(pth)) {
            this.game = child(pth);
            this.socket.emit("forUnity", { data: "blocks and blocks" });//blocks and blocks?
          }
          else {
            console.error("Game location invalid");
            this.setText("Please set valid game location...");
          }

        },

        launchPlaneGame() {
          this.currentGame = "PlaneGame";
          this.currentView = "clinician";


          var pth = localStorage.getItem("PlaneGame");
          console.log(pth);
          //var pathToBinary = path.join(); 
          this.setText(pth);
          if (fs.existsSync(pth)) {
            this.game = child(pth);
            this.socket.emit("forUnity", { data: "plane game" });
          }
          else {
            console.error("Game location invalid");
            this.setText("Please set valid game location...");
          }

        },
        launchBalloonGame() {
          this.currentGame = "BalloonGame";
          this.currentView = "clinician";


          var pth = localStorage.getItem("BalloonGame");
          console.log(pth);
          //alert("C:\Users\brian\Desktop\GamesFolderTest\BalloonGame.unity");
          //var pathToBinary = path.join(); 
          this.setText(pth);
          if (fs.existsSync(pth)) {
            this.game = child(pth);
            this.socket.emit("forUnity", { data: "balloon game" });
          }
          else {
            console.error("Game location invalid");
            this.setText("Please set valid game location...");
          }

        },
        launchCarGame() {
          this.currentGame = "CarGame";
          this.currentView = "clinician";


          var pth = localStorage.getItem("CarGame");
          console.log(pth);
          //var pathToBinary = path.join(); 
          this.setText(pth);
          if (fs.existsSync(pth)) {
            this.game = child(pth);
            this.socket.emit("forUnity", { data: "car game" });
          }
          else {
            console.error("Game location invalid");
            this.setText("Please set valid game location...");
          }

        },
        
        planeAction(action) {
          var hoop = document.getElementById("hoop");
          var diff = document.getElementById("difficulty");
          switch (action) {
            case "startGame":
              this.socket.emit("forUnity", { "type": "startGame", "data": "" });

              break;
            case "restartGame":
              this.socket.emit("forUnity", { "type": "restartGame", "data": "" });
              break;
            case "toggleHoop":
              this.socket.emit("forUnity", { "type": "toggleHoop", "data": "" + hoop.checked });
              break;
            case "difficulty":
            document.getElementById("diffLabel").innerHTML = "Difficulty: " + diff.value;
            this.socket.emit("forUnity", { "type": "difficulty", "data": "" + diff.value });
             
              break;
          }

        },
        balloonAction(action)
        {
          var shift = document.getElementById("shift");
          switch (action) {
            case "startGame":
              this.socket.emit("forUnity", { "type": "startGame", "data": "" });

              break;
            case "restartGame":
              this.socket.emit("forUnity", { "type": "restartGame", "data": "" });
              break;
            case "shift":
            document.getElementById("shiftLabel").innerHTML = "Balloon Shift: " + shift.value;
              this.socket.emit("forUnity", { "type": "shift", "data": "" + shift.value });
              break;
          
          }
          
        },
        boxAction(action)
        {
            switch (action)
            {
              case "leftHand":
                this.socket.emit("forUnity", {type: "leftHand", "data": ""});
              break;
              case "rightHand":
                this.socket.emit("forUnity", {type: "rightHand", "data": ""});
              break;
              case "restartGame":
                this.socket.emit("forUnity", {type: "restartGame", "data": ""});
              break;
            }
        },
        carAction(action)
        {

        },
        beginSession() {

          var pId = document.getElementById("patient_id").value;
          if (pId == "" || pId.length > app.maxIdLength) {
            document.getElementById("patient_id").placeholder = "Enter a valid patient id!";
            document.getElementById("patient_id").value = "";
            return;
          }

          this.currentView = "start";
          this.patient_id = pId;
          var type = "Clinician";
          var name = "Clinician" + pId;

          this.socket.emit("GETDATA", { type: type, name: name });
          this.session_start = moment();

          firebase.database().ref("sesssions").push(
            {
              event: "StartSession",
              timeStamp: "" + moment(),
              patientId: pId,
              userId: firebase.auth().currentUser.email
            }
          );

          /*client.connect(1234, "127.0.0.1", function (err) {
            console.log("Get kinect Data: " + err);

          });
          client.on("data", function (data) {
            //console.log(data);
            var str = new TextDecoder("utf-8").decode(data);
            
            //console.log(arr);
            app.kinectData = str;
          });
          client.on("close", function () {
            console.log("connection closed");
          });*/
        },

        backToStart() {
          if (this.game != null) {
            this.game.kill();
          }

          this.currentView = "start"
        },
        endSession() {
          console.log("disconnect");

          //this.$socket.emit("removeClient", { name: "Clinician" + this.patient_id, type: "Clinician" });
          //this.socket.emit("disconnect");
          this.patient_id = "";
          this.session_start = null;
          this.currentView = "login";
        },
        duration() {
          let n = this.now;
          let s = this.session_start;
          let d = moment.duration(n.diff(s));
          let r = d.humanize();
          return r;
        },
        logout() {
          this.endSession();
          this.socket.disconnect();
          window.location = "../index.html";
        },
        user() {
          if (firebase.auth().currentUser)
            return firebase.auth().currentUser.email;
          else
            return "Waiting for credentials to arrive.";
        },
        setText(txt) {
          setTimeout(function () {
            var ct = document.getElementById("ttt");

            console.log(ct == null);
            ct.innerHTML = txt;
          }, 200);

        }
      }

    });
    http.listen(3000,function(){
      console.log("listening on 3000");
    })

    //setInterval(() => app.now = moment(), 1000);