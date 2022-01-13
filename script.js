let initialised;
let method;
let startButton;
let monitor;
let grid;
let row;
let col;
let res;
let openSet;
let closedSet;
let src;
let dest;
let shortestPath;
let w;
let h;
let srcSelected;
let destSelected;

function resetScreen() {
  console.log(new Node(0, 0));
  //Initialzing variables
  initialised = false;
  method = null;
  res = 30;
  openSet = [];
  closedSet = [];
  shortestPath = [];
  srcSelected = false;
  destSelected = false;

  row = floor(height / res);
  col = floor(width / res);
  w = width / col;
  h = height / row;
  grid = matrix(row, col);
  startButton = document.getElementById("startButton");
  startButton.disabled = false;
  startButton.innerHTML = "Visualize";
  startButton.onclick = start;
  let message = document.getElementById("message");
  message.innerHTML = "";

  //constructing the grid
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      grid[i][j] = new Node(i, j);
    }
  }
  //Declaring the neighbors of each vertex in grid
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      grid[i][j].addNeighbor();
    }
  }
  //Setting up a random source and destination node if not chosen
  if (src === undefined || dest === undefined) {
    x = Math.floor((Math.random() * col) / 2);
    y = Math.floor(Math.random() * row);

    src = grid[x][y];

    x =
      Math.floor(Math.random() * (col - Math.floor(col / 2 + 1))) +
      Math.floor(col / 2 + 1);
    y = Math.floor(Math.random() * row);

    dest = grid[x][y];
  }
  //otherwise altering old source & destination nodes from the grid
  else {
    grid.forEach((row) => {
      row.forEach((node) => {
        if (node.i === src.i && node.j === src.j) {
          src = node;
        }
        if (node.i === dest.i && node.j === dest.j) {
          dest = node;
        }
      });
    });
  }
  //confirming source and destination aren't obstacles
  src.obstacle = false;
  dest.obstacle = false;

  background(255);
  //showing the grid on the monitor
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      grid[i][j].show(255);
    }
  }
  src.show(color(87, 50, 168));
  dest.show(color(140, 68, 20));
  noLoop();
  console.log(openSet);
}

function Node(i, j) {
  this.i = i;
  this.j = j;
  this.x = this.i * res;
  this.y = this.j * res;
  this.r = res - 1;

  //For A* algo
  this.f = 0;
  this.g = 0;
  this.h = 0;

  //For Dijkstra algo
  this.d = Infinity;

  this.obstacle = false;
  this.parent = undefined;
  this.neighbors = [];
  this.dragging = false;

  this.show = (color) => {
    console.log(color);
    let x = this.x;
    let y = this.y;
    let r = this.r;
    if (this.obstacle) {
      fill(128, 128, 128);
    } else {
      fill(color);
    }
    stroke(66, 148, 255, 90);
    strokeWeight(1);
    rect(x, y, r, r);
  };
  this.addNeighbor = () => {
    let i = this.i;
    let j = this.j;
    //Adding Orthogonal neighbors
    if (i > 0) this.neighbors.push(grid[i - 1][j]);
    if (i < col - 1) this.neighbors.push(grid[i + 1][j]);
    if (j > 0) this.neighbors.push(grid[i][j - 1]);
    if (j < row - 1) this.neighbors.push(grid[i][j + 1]);
  };

  this.clicked = () => {
    if (srcSelected) {
      this.show(color(87, 50, 168));
    } else if (destSelected) {
      this.show(color(140, 68, 20));
    } else if (!this.obstacle) {
      this.obstacle = true;
      this.show(color(128, 128, 128));
    }
  };
}

function matrix(row, col) {
  let arrays = new Array(col);
  for (let i = 0; i < arrays.length; i++) {
    arrays[i] = new Array(row);
  }
  return arrays;
}

function windowResized() {
  centreScreen();
}

function centreScreen() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - windowHeight * 0.2 - height) / 2;
  monitor.position(x, y);
}

function setup() {
  //creating the grid on monitor
  monitor = createCanvas(
    windowWidth - windowHeight * 0.05,
    windowHeight - windowHeight * 0.2
  );
  monitor.parent("sketch01");
  centreScreen();
  resetScreen();
}

function start() {
  if (method === null) {
    let startButton = document.getElementById("startButton");
    startButton.innerHTML = `Pick An methodrithm!`;
    return;
  } else if (method === "Dijkstra") {
    dijkstraInit();
  } else if (
    method != "Breadth First Search" &&
    method != "Depth First Search"
  ) {
    initialize();
  } else {
    BFS_DFSInit();
  }

  initialised = true;
  startButton.disabled = true;
  loop();
}

function throwObstacles() {
  //Maintains obstacle's distribution in the grid
  let weights = [
    ["Obstacle", 30],
    ["Non Obstacle", 70],
  ];
  console.log(weights[1][1]);
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      if (grid[i][j] != src && grid[i][j] != dest) {
        //making the decision of making this node an obstacle
        let decision = randomWeights(weights);
        if (decision === "Obstacle") {
          grid[i][j].obstacle = true;
          grid[i][j].show();
        }
      }
    }
  }
}

function mousePressed() {
  if (initialised) {
    return;
  }
  console.log("clicked2");
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      //let d = dist(mouseX, mouseY, grid[i][j].x, grid[i][j].y);
      if (
        mouseX >= grid[i][j].x &&
        mouseX <= grid[i][j].x + grid[i][j].r &&
        mouseY >= grid[i][j].y &&
        mouseY <= grid[i][j].y + grid[i][j].r
      ) {
        if (grid[i][j] != src && grid[i][j] != dest) {
          console.log("in IF");
          console.log(grid[i][j]);
          console.log(src);
          console.log(grid[i][j] === src);
          grid[i][j].clicked();
        } else {
          if (src === grid[i][j]) {
            srcSelected = true;
          }
          if (dest === grid[i][j]) {
            destSelected = true;
          }
        }
      }
    }
  }
}

function mouseReleased() {
  if (srcSelected || destSelected) {
    for (let i = 0; i < col; i++) {
      for (let j = 0; j < row; j++) {
        //let d = dist(mouseX, mouseY, grid[i][j].x, grid[i][j].y);
        if (
          mouseX >= grid[i][j].x &&
          mouseX <= grid[i][j].x + grid[i][j].r &&
          mouseY >= grid[i][j].y &&
          mouseY <= grid[i][j].y + grid[i][j].r
        ) {
          if (srcSelected) {
            if (grid[i][j] === dest) {
              src = grid[i - 1][j];
              src.obstacle = false;
              grid[i][j].show(color(140, 68, 20));
              src.show(color(87, 50, 168));
              srcSelected = false;
            } else {
              src = grid[i][j];
              src.obstacle = false;
              src.show(color(87, 50, 168));
              srcSelected = false;
            }
          } else {
            if (grid[i][j] === src) {
              dest = grid[i - 1][j];
              dest.obstacle = false;
              src.show(color(87, 50, 168));
              dest.show(color(140, 68, 20));
              destSelected = false;
            } else {
              dest = grid[i][j];
              dest.obstacle = false;
              dest.show(color(140, 68, 20));
              destSelected = false;
            }
          }
        }
      }
    }
  }
}

function randomWeights(data) {
  //Loop the main dataset to count the total weight
  //Start at '1' because the upper boundary of Math.random() is exclusive
  let total = 1;
  for (let i = 0; i < data.length; ++i) {
    total += data[i][1];
  }

  //Pick a random value similar to our random index before
  const threshold = Math.floor(Math.random() * total);

  // Loop through the main data one more time until we discover which value would live with
  // particular threshold. Keep a running count of weights as we go.
  total = 0;
  for (let i = 0; i < data.length; ++i) {
    total += data[i][1];
    if (total >= threshold) {
      return data[i][0];
    }
  }
}