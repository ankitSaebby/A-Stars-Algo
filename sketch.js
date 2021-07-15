
function removefromArray(arr, ele) {
  for(var i=arr.length-1; i >= 0; i--){
    if(arr[i] == ele){
      arr.splice(i, 1);
    }
  }
}


function heuristics(n, end){
  //caluculating the hypotanus using pythagores theoreem underestimation
  var d = dist(n.i, n.j, end.i, end.j);

  //var d= abs(n.i - end.i) + abs(n.j - end.j);
  return d;
}
//-------------------------------------------------------

var cols= 50;
var rows= 50;
var grid= new Array(cols);

var openSet =[];
var closeSet =[];
var start;
var end;
var w, h;
var path = [];
//var noSolution = false;

function Spot(i,j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbours = [];
  this.previous = undefined;
  this.wall = false;


  //making 10% wall
  if(random(1) < 0.3){
    this.wall =true;
  }


  this.show = function (col) {
    fill(col);

    if(this.wall){
      fill(0);
    }

    noStroke(0);
    rect(this.i*w, this.j*h, w-1, h-1);
  }

  this.addNeighbours = function (){
    // var i = this.i;
    // var j = this.j;
    if(i < cols-1){
      this.neighbours.push(grid[i+1][j]);
    }
    if(i > 0){
      this.neighbours.push(grid[i-1][j]);
    }
    if(j < rows-1){
      this.neighbours.push(grid[i][j+1]);
    }
    if(j > 0){
      this.neighbours.push(grid[i][j-1]);
    }

    // Diagonal path 

    if(i > 0 && j > 0){
      this.neighbours.push(grid[i-1][j-1]);
    }
    if(i < cols-1 && j > 0){
      this.neighbours.push(grid[i+1][j-1]);
    }
    if(i > 0 && j < rows - 1){
      this.neighbours.push(grid[i-1][j+1]);
    }
    if(i < cols -1 && j < rows -1){
      this.neighbours.push(grid[i+1][j+1]);
    }
  }

}


function setup() {
  createCanvas(400, 400);
  console.log("A*");


  w = width / cols;
  h = height / rows;


  //making an 2d array
  for(var i = 0;i < cols; i++){
    grid[i] = new Array(rows);
  }

  for(var i = 0;i < cols; i++){
    for(var j=0; j< rows; j++){
      grid[i][j] = new Spot(i,j);
    }
  }

  for(var i = 0;i < cols; i++){
    for(var j=0; j< rows; j++){
      grid[i][j].addNeighbours();
    }
  }


  start= grid[0][0];
  end = grid[cols-1][rows-1];
  start.wall = false;
  end.wall = false;



  openSet.push(start);

  //console.log(grid);

}

function draw() {
  background(0);
  if(openSet.length >0){
    //go on
    var lowestIndex=0;
    for(var i = 0; i<openSet.length; i++){
      if(openSet[i].f < openSet[lowestIndex].f){
        lowestIndex = i;
      }
    }

    var current = openSet[lowestIndex];

    if(current === end){

      //find path together with algo proceeds
     
      noLoop();
      console.log("done");
    }

    removefromArray(openSet, current);
    //openSet.remove(current);  --->we dont have this function inn  js so we need to create ther function
    closeSet.push(current);


    var neighboursNow = current.neighbours;
    for(var i = 0; i< neighboursNow.length; i++){
      var neighbour = neighboursNow[i];


      if(!closeSet.includes(neighbour) && !neighbour.wall){
        var tempG = current.g +1;

        var newPath = false;
        if(openSet.includes(neighbour)){
          if(tempG < neighbour.g){
            neighbour.g = tempG;
            newPath = true;
          }
        }else{
          neighbour.g =tempG;
          newPath = true;
          openSet.push(neighbour);
        }

        if(newPath){
          neighbour.h = heuristics(neighbour,end);
          //f(n) = g(n) + h(n)
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.previous = current;
        }
        

      }
      
    }

  }
  else{
    //no possiable solution
    console.log("No Solution Possiable !!!");
    noLoop();
    return;
  }

  for(var i = 0;i < cols; i++){
    for(var j=0; j< rows; j++){
      grid[i][j].show(color(255));
    }
  }

  for(var i =0; i<closeSet.length; i++){
    closeSet[i].show(color(255,0,0));
  }
  for(var i =0; i<openSet.length; i++){
    openSet[i].show(color(0,255,0));
  }


  //trace current path
  path = [];
  var temp = current;
  path.push(temp);
  while(temp.previous){
    path.push(temp.previous);
    temp = temp.previous;
  }
  for(var i = 0; i<path.length;i++){
    path[i].show(color(0,0,255));
  }
}
