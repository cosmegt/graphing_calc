var canvas = document.getElementById('myCanvas'),
    c = canvas.getContext('2d'),
    // n is the number of line segments
    n = 100,
    // define the math "window"
    xMin = -10,
    xMax = 10,
    yMin = -10,
    yMax = 10,
    
    math = mathjs(),
    expr = '',
    scope = {
      x: 3,
      t: 0
    },
    tree,
    time = 0,
    timeIncrement = 0.1;

// these is the main program
initExprFromHash();
drawCurve();
initTextField();
startAnimation();

// update from use of back and forwards buttons
window.addEventListener('hashchange', initExprFromHash);

function setExpr(newExpr){
  expr = newExpr;
  tree = math.parse(expr, scope);
}

function initExprFromHash(){
  var hash = getHashValue();
  if(hash){
    setExpr(hash);
  } else {
    setExpr('sin(x*2 + t*4)/cos(2*x)');
    setHashFromExpr();
  }
  $('#inputField').val(expr);
}

function setHashFromExpr(){
  setHashValue(expr);
}

function drawCurve(){
  // these are used inside the for loop
  var i,
      // these vary between xMin and xMax
      //                and yMin and yMax
      xPixel, yPixel,
      // these vary between 0 and 1
      percentX, percentY,
      // these are in math coordinates
      mathX, mathY;
  // clear canvas
  c.clearRect(0, 0, canvas.width, canvas.height);
  
  c.beginPath();
  for(i = 0; i < n; i++){
    percentX = i / (n - 1);
    mathX = percentX * (xMax - xMin) + xMin;
    mathY = evaluateMathExpr(mathX);
    percentY = (mathY - yMin) / (yMax - yMin);
    // flip to match canvas coordinates
    percentY = 1 - percentY;
    xPixel = percentX * canvas.width;
    yPixel = percentY * canvas.height;
    c.lineTo(xPixel, yPixel);
    // coloring it blue
    c.lineWidth = 10;
    c.strokeStyle = "rgb(100,200,255)";
  }
c.stroke();
}

function evaluateMathExpr(mathX) {
  scope.x = mathX;
  scope.t = time;
  return tree.eval();
}

function initTextField(){
  var input = $('#inputField');
  // Set the initial text value programmatically using jQuery
  input.val(expr);
  // Listen for changes using jQuery
  input.keyup(function (event){
    setExpr(input.val());
    setHashFromExpr();
  });
}

function startAnimation(){
  // setInterval(render, 20);
  // (function animloop(){}());
  (function animloop(){
    requestAnimationFrame(animloop);
    render();
  }());
}

function render(){
  // increment time variable
  time = time + timeIncrement;
  // redraw
  drawCurve();
}

// gets the fragment identifiel value
function getHashValue(){
  return location.hash.substr(1);
}

// sets the fragment identifiel value
function setHashValue(value){
  return location.hash = value;
}