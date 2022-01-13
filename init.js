function dijkstraInit() {
  src.d = 0;

  //creating an openSet and initializing all the nodes of the grid
  grid.forEach((row) => {
    row.forEach((node) => {
      openSet.push(node);
    });
  });
}

function initialize() {
  openSet.push(src);
}

function BFS_DFSInit() {
  openSet.push(src);
  closedSet.push(src);
}

function dropdown(event) {
  method = event.target.text;
  let startButton = document.getElementById("startButton");
  startButton.innerHTML = `Start ${method}`;
  let message = document.getElementById("message");
  if (method === "A* Search") {
    message.innerHTML = `Insight: A* Search <span style = "font-weight: bold;">Gurantees</span> Shortest Path`;
  } else if (method === "Dijkstra") {
    message.innerHTML = `Insight: Dijkstra's methodrithm Or A Variant Of It Is Known As UCS <span style = "font-weight: bold;">Gurantees</span> Shortest Path`;
  } else if (method === "Breadth First Search") {
    message.innerHTML = `Insight: Breadth First Search (BFS) <span style = "font-weight: bold;">Gurantees</span> Shortest Path In An <span style = "font-weight: bold;">Unweighted grid</span> And A Feasible Choice <span style = "font-weight: bold;">If The dest Is Closer To The src</span>`;
  } else if (method === "Depth First Search") {
    message.innerHTML = `Insight: Depth First Search (DFS) <span style = "font-weight: bold;">Does Not Gurantee</span> Shortest Path Though Is A Feasible Choice For Memory <span style = "font-weight: bold;">If The dest Is Far Away From The src</span>`;
  } 
  function draw() {
    if (initialised) {
      //algorithm for Dijkstra
      if (method == "Dijkstra") {
        if (openSet.length > 0) {
          current = lowestDVal(); //returns the node with least d value

          //There's no possible path from src to dest with finite distance
          if (current.d === Infinity) {
            console.log("no solution");
            noLoop();
            return;
          }

          if (current === dest) {
            noLoop();
            console.log("We're Done!");
          }

          //removing the "current" vertex from openSet and adding it to closedSet
          var removeIndex = openSet
            .map(function (item) {
              return item;
            })
            .indexOf(current);
          openSet.splice(removeIndex, 1);
          closedSet.push(current);
          for (neighbor of current.neighbors) {
            //checking if the node is valid
            if (!neighbor.obstacle) {
              dScore = current.d + 1;
              if (dScore < neighbor.d) {
                neighbor.d = dScore;
                neighbor.parent = current;
              }
            }
          }
        }
      }

      // algorithm for A* Search
      if (method == "A* Search") {
        if (openSet.length > 0) {
          current = lowestFVal();
          if (current == dest) {
            noLoop();
            console.log("We're Done!");
          }

          //removing the "current" vertex from openSet and adding it to closedSet
          var removeIndex = openSet
            .map(function (item) {
              return item;
            })
            .indexOf(current);
          openSet.splice(removeIndex, 1);
          closedSet.push(current);

          for (neighbor of current.neighbors) {
            //checking to see if the node is valid
            if (!closedSet.includes(neighbor) && !neighbor.obstacle) {
              gScore = current.g + heuristic(neighbor, current);
              let isGbetter = false;
              if (openSet.includes(neighbor)) {
                if (gScore < neighbor.g) {
                  neighbor.g = gScore;
                  isGbetter = true;
                }
              } else {
                neighbor.g = gScore;
                isGbetter = true;
                openSet.push(neighbor);
              }
              if (isGbetter) {
                neighbor.h = heuristic(neighbor, dest);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
              }
            }
          }
        } else {
          console.log("no solution");
          noLoop();
          return;
        }
      }

      //algorithm for Breadth First Search
      if (method == "Breadth First Search") {
        if (openSet.length > 0) {
          current = openSet[0];
          if (current == dest) {
            noLoop();
            console.log("We're Done!");
          }

          //removing the "current" vertex from openSet and adding it to closedSet
          var removeIndex = openSet
            .map(function (item) {
              return item;
            })
            .indexOf(current);
          openSet.splice(removeIndex, 1);
          console.log(openSet);
          for (neighbor of current.neighbors) {
            if (!closedSet.includes(neighbor) && !neighbor.obstacle) {
              openSet.push(neighbor);
              closedSet.push(neighbor);
              neighbor.parent = current;
            }
          }
        } else {
          console.log("no solution");
          noLoop();
          return;
        }
      }

      //algorithm for Depth First Search
      if (method == "Depth First Search") {
        if (openSet.length > 0) {
          console.log(openSet);
          current = openSet[openSet.length - 1];
          if (current == dest) {
            noLoop();
            console.log("We're Done!");
          }

          //removing the "current" vertex from openSet and adding it to closedSet
          var removeIndex = openSet
            .map(function (item) {
              return item;
            })
            .indexOf(current);
          openSet.splice(removeIndex, 1);
          console.log(openSet);
          for (neighbor of current.neighbors) {
            if (!closedSet.includes(neighbor) && !neighbor.obstacle) {
              openSet.push(neighbor);
              closedSet.push(neighbor);
              neighbor.parent = current;
            }
          }
        } else {
          console.log("no solution");
          noLoop();
          return;
        }
      }

      background(255);

      //displaying the grid on monitor
      for (let i = 0; i < col; i++) {
        for (let j = 0; j < row; j++) {
          grid[i][j].show(255);
        }
      }

      //coloring the visited, unvisited nodes and the shortest path
      for (node of openSet) {
        if (method === "Dijkstra") {
          if (node.d != Infinity) {
            node.show(color(45, 196, 129));
          }
        } else {
          node.show(color(45, 196, 129));
        }
      }
      for (node of closedSet) {
        node.show(color(255, 0, 0, 50));
      }
      //initializing shortestPath array
      shortestPath = [];
      let temp = current;
      shortestPath.push(temp);
      while (temp.parent) {
        shortestPath.push(temp.parent);
        temp = temp.parent;
      }
      noFill();
      stroke(255, 0, 200);
      strokeWeight(4);
      beginShape();
      for (path of shortestPath) {
        vertex(path.i * res + res / 2, path.j * res + res / 2);
      }
      endShape();
      src.show(color(87, 50, 168));
      dest.show(color(140, 68, 20));
    }
  }
}

function heuristic(node, goal) {
  //Manhattan distance
  dx = abs(node.x - goal.x);
  dy = abs(node.y - goal.y);
  return 1 * (dx + dy);
}

function lowestFVal() {
  let minNode = openSet[0];
  for (node of openSet) {
    if (node.f < minNode.f) {
      minNode = node;
    }
  }
  return minNode;
}

function lowestDVal() {
  let minNode = openSet[0];
  for (node of openSet) {
    if (node.d < minNode.d) {
      minNode = node;
    }
  }
  return minNode;
}

function lowestHeuristicVal() {
  let minNode = openSet[0];
  for (node of openSet) {
    if (node.h < minNode.h) {
      minNode = node;
    }
  }
  return minNode;
}