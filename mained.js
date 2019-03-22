var Vue = require("vue");
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