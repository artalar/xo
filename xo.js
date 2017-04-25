//v 3.0 with AI

"use strict";
var LogOn = true;
var player = "X";
var fieldSize = Math.ceil(Math.min(innerHeight, innerWidth ) * 0.8)
var gameField = document.getElementById("gameField");
gameField.style.width = fieldSize + "px";
gameField.style.height = fieldSize + "px";
gameField.style.fontSize = fieldSize/4 + "px"
var headerField = document.getElementById("gameTypeChooseField");
headerField.style.width = fieldSize + "px";
headerField.style.height = fieldSize/6 + "px";
headerField.style.fontSize = fieldSize/25 + "px"
var ceils = CreCeilsArr(document.getElementById("table"));
function lo9(str, handler){
    if	(!LogOn) return;
    if	(handler) handler(str);
    else console.log(str);
}
function RandInt(min, max){
    return Math.floor(min + Math.random() * (max - min + 1));
}
function ChangePlayer(player) {
    switch (player) {
        case "X":
            return "O";
        case "O":
            return "X";
    }
}
function CreCeilsArr(table) {
    var result = [];
    var index = 0;
    for (var i = 0; i < 9; i++) {
        result.push(GetCeil(i))
    }
    function GetCeil(num){
        var ceil = document.getElementById("ceil" + num);
        ceil.innerText = " ";
        return {
            "ceil": ceil,
            "GetVal": function(){
                return this.ceil.innerText || " ";
            },
            "SetVal": function(val){
                this.ceil.innerText = val;
            }
        }
    }
    return result;
}
function FindFillLine(){
    var ways = GetSortWays();
    var mask = player + player + player;
    return ways.some(function(way) {
        var str = way[0].GetVal() + way[1].GetVal() + way[2].GetVal();
        return !!~str.indexOf(mask);
    })
}
function ChekFieldFill(){
    var ways = GetSortWays();
    return ways.every(function(way) {
        var str = way[0].GetVal() + way[1].GetVal() + way[2].GetVal();
        return !~str.indexOf(" ");
    })
}
function GetSortWays() {
    var ways = [];
    ways.push([ceils[0], ceils[1], ceils[2]]);
    ways.push([ceils[3], ceils[4], ceils[5]]);
    ways.push([ceils[6], ceils[7], ceils[8]]);
    ways.push([ceils[0], ceils[3], ceils[6]]);
    ways.push([ceils[1], ceils[4], ceils[7]]);
    ways.push([ceils[2], ceils[5], ceils[8]]);
    ways.push([ceils[0], ceils[4], ceils[8]]);
    ways.push([ceils[6], ceils[4], ceils[2]]);
    return ways;
}
function AI() {
    var ways = GetSortWays();
    var priorityWays = [];
    var interimWays;
    var oponent = ChangePlayer(player);
    var mask;
    //
    mask = player + player + " ";
    SearchPriorityWays();
    mask = player + " " + player;
    SearchPriorityWays();
    mask = " " + player + player;
    SearchPriorityWays();
    if(priorityWays.length) {
        DoMove(priorityWays, player);
        return;
    }
    //
    mask = oponent + oponent + " ";
    SearchPriorityWays();
    mask = oponent + " " + oponent;
    SearchPriorityWays();
    mask = " " + oponent + oponent;
    SearchPriorityWays();
    if(priorityWays.length) {
        DoMove(priorityWays, player);
        return;
    }
    //
    mask = player + " " + " ";
    SearchPriorityWays();
    mask = " " + " " + player;
    SearchPriorityWays();
    mask = " " + player + " ";
    SearchPriorityWays();
    if(priorityWays.length) {
        DoMove(priorityWays, player);
        return;
    }
    //
    mask = oponent + " " + " ";
    SearchPriorityWays();
    mask = " " + " " + oponent;
    SearchPriorityWays();
    mask = " " + oponent + " ";
    SearchPriorityWays();
    if(priorityWays.length) {
        DoMove(priorityWays, player);
        return;
    }
    
    function SearchMask(arr){
        var str = arr[0].GetVal() + arr[1].GetVal() + arr[2].GetVal();
        return !!~str.indexOf(mask);
    }
    function SearchPriorityWays() {
        if(interimWays = ways.filter(SearchMask)){
            for (var index = 0; index < interimWays.length; index++) {
                priorityWays.push(interimWays[index]);
            }
        }
    }
    function DoMove(priorityWays, player) {
        var randomWayIndex = RandInt(0,priorityWays.length-1);
        var winningWay = priorityWays[randomWayIndex];
        var winningMoves = winningWay.filter(function(item) {return ~item.GetVal().indexOf(" ")});
        var winningMoveIndex = RandInt(0,winningMoves.length-1);
        var winningMove = winningMoves[winningMoveIndex];
        winningMove.SetVal(player);
    }
}
function MouseDown() {}
function AIGame(element) {
    if(element.srcElement.innerText){
        //animation
        return;
    }
    event.srcElement.innerText = player;
    if (ChekEnd()) return;
    player = ChangePlayer(player);
    AI();
    if (ChekEnd()) return;
    player = ChangePlayer(player);
    
    function ChekEnd(){
        if(FindFillLine()){
            if(player == "X") alert("You win!");
            if(player == "O") alert("Computer win!");
            location.reload();
            return true;
        }
        if(ChekFieldFill()){
            alert("Game over. Drow!");
            location.reload();
            return true;
        }
    }
}
function HumansGame(element){
    if(element.srcElement.innerText){
        //animation
        return;
    }
    event.srcElement.innerText = player;
    if (ChekEnd()) return;
    player = ChangePlayer(player);
    
    function ChekEnd(){
        if(FindFillLine()){
            alert("Game over.\n\nPlayer " + player + " win!");
            location.reload();
            return true;
        }
        if(ChekFieldFill()){
            alert("Game over. Drow!");
            location.reload();
            return true;
        }
    }
}
function choice(elem){
    elem.style.background =  "#D19969";
    if(elem.id == 'set2Players') MouseDown = HumansGame;
    if(elem.id == 'setAIPlayer') MouseDown = AIGame;
    (document.getElementById("choiceRow")).onmousedown = "";
}