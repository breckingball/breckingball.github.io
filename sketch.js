let red_fill = [200, 100, 100],
  green_fill = [150, 200, 150];
let red_border = [100, 0, 0],
  green_border = [50, 100, 50];
let next_prod = 1;
let products = [];
let active_part;
let fac_img;
let parts = [];
let MMM = "AM";
let current_hour, current_minute;
let elapsed_frames = 0;
let conveyer_belt;
let score = 0;
let game_state = 0; // 0: menu, 1: playing, 2: game over
function setup() {
  createCanvas(1000, 800);
  fac_img = loadImage("https://png.pngtree.com/background/20230613/original/pngtree-an-old-factory-picture-image_3385983.jpg");
  active_part = new Part();
  conveyer_belt = new ConveyerBelt();
}

function draw() {
  background(220);
  switch (game_state) {
    case 0:
      drawMenu();
      break;
    case 1:
      drawGame();
      break;
    case 2:
      drawOver();
      break;
  }
}
function mousePressed() {}
function mouseReleased() {}
function mouseClicked() {
  if (
    game_state == 0 &&
    mouseX > 300 &&
    mouseX < 700 &&
    mouseY > 600 &&
    mouseY < 700
  ) {
    initGame();
  }
  if (game_state == 2) {
    if (mouseX > 125 && mouseX < 425 && mouseY > 535 && mouseY < 635)
      game_state = 0;
    if (mouseX > 575 && mouseX < 875 && mouseY > 535 && mouseY < 635)
      initGame();
  }
}
function initGame() {
  score = 0;
  MMM = "AM"
  elapsed_frames = 0;
  current_hour = 9;
  current_minute = 0;
  products[(next_prod + 1) % 2] = new Product(0, conveyer_belt.belt_level - 200, 250, 200);
  game_state = 1;
}
function drawMenu() {
  textSize(60);
  fill(0);
  stroke(100);
  strokeWeight(3);
  text("Assembly Line Worker Game", 120, 150);
  textSize(30);
  strokeWeight(1);
  text(
    "Click and Drag parts from the shelf in the upper right of the screen\ninto the red boxes on the product and release to assemble it...\n\nThe more products you assemble, the more you will get paid!!\n\n         Low Tier Employee Pay (<= 15 products): $2.50 / day\n         High Tier Employee Pay (> 15 products): $6.25 / day",
    80,
    250
  );
  rect(300, 600, 400, 100);
  textSize(25);
  fill(200);
  stroke(100);
  text("Click Here To Play", 400, 655);
}
function newProduct() {
  products[next_prod] = new Product(
    0,
    conveyer_belt.belt_level - 200,
    250,
    200
  );
  next_prod = (next_prod + 1) % 2;
}
function drawGame() {
  image(fac_img, 0, 0, 1000, 800);
  for (let i = 0; i < products.length; i++) products[i].render();
  conveyer_belt.render();
  active_part.render();
  if (++elapsed_frames == 15) {
    elapsed_frames = 1;
    if (++current_minute == 60) {
      current_minute = 0;
      let testert = ++current_hour;
      if (testert == 12) MMM = "PM";
      if (testert == 13) current_hour = 1;
    }
  }
  noStroke();
  rect(750, 185, 130, 25);
  fill(170);
  rect(30, 20, 630, 80);
  fill(0);
  textSize(18);
  text("PARTS", 785, 202);
  textSize(50);

  text(
    nf(current_hour, 2, 0) + ":" + nf(current_minute, 2, 0) + " " + MMM,
    50,
    75
  );
  text("Products: " + score, 370, 75);
  if (current_hour == 5) game_state = 2;
}
function drawOver() {
  fill(0);
  stroke(100);
  strokeWeight(5);
  textSize(60);
  if (score <= 15) text("You made $2.50 today", 210, 250);
  else text("You made $6.25 today", 210, 250);
  fill(170);
  stroke(50);
  rect(125, 535, 300, 100);
  rect(575, 535, 300, 100);
  noStroke();
  textSize(50);
  fill(0);
  text("Menu", 210, 600);
  text("Play Again", 605, 600);
}

class Target {
  constructor(_x, _y, _size) {
    this.x = _x;
    this.y = _y;
    this.size = _size;
    this.current_color_fill = red_fill;
    this.current_color_border = red_border;
    this.complete = false;
  }
  render() {
    if (this.m_inside() || this.complete) {
      this.complete = true;
      fill(green_fill);
      stroke(green_border);
    } else {
      fill(this.current_color_fill);
      stroke(this.current_color_border);
    }
    rect(this.x, this.y, this.size);
  }
  move(_speed) {
    this.x += _speed;
  }
  m_inside() {
    return (
      active_part.x > this.x &&
      active_part.x + active_part.size < this.x + this.size &&
      active_part.y > this.y &&
      active_part.y + active_part.size < this.y + this.size &&
      !mouseIsPressed
    );
  }
}
class Product {
  constructor(_x, _y, _width, _height) {
    this.x = -_width;
    this.y = _y;
    this.p_width = _width;
    this.p_height = _height;
    this.scored = false;
    this.targets = [
      new Target(this.x + 20, this.y + 20, 50),
      new Target(this.x + 180, this.y + 20, 50),
      new Target(this.x + 20, this.y + 120, 50),
      new Target(this.x + 180, this.y + 120, 50),
    ];
  }
  render() {
    fill(120);
    stroke(80);
    if (this.isAssembled() || this.x < width / 2 - this.p_width / 2) {
      this.move(8);
    }
    rect(this.x, this.y - 3, this.p_width, this.p_height);
    for (let i = 0; i < this.targets.length; i++) {
      this.targets[i].render();
    }
  }
  move(_speed) {
    for (let i = 0; i < this.targets.length; i++) {
      this.targets[i].move(_speed);
    }
    this.x += _speed;
  }
  isAssembled() {
    for (let i = 0; i < this.targets.length; i++) {
      if (!this.targets[i].complete) return false;
    }
    if (!this.scored) {
      score++;
      newProduct();
      this.scored = true;
    }
    return true;
  }
}
class ConveyerBelt {
  constructor() {
    this.belt_level = height - height / 4;
    this.belt_height = 50;
    this.leg_level = this.belt_level + this.belt_height;
    this.leg_width = 20;
    this.leg_height = height - this.leg_level;
  }
  render() {
    fill(0);
    stroke(100);
    strokeWeight(3);
    rect(
      width / 4 - this.leg_width / 2,
      this.leg_level,
      this.leg_width,
      this.leg_height
    );
    rect(
      width - width / 4 - this.leg_width / 2,
      this.leg_level,
      this.leg_width,
      this.leg_height
    );
    strokeWeight(4);
    rect(
      this.belt_height / 2,
      this.belt_level,
      width - this.belt_height,
      this.belt_height
    );
    arc(
      this.belt_height / 2,
      this.belt_level + this.belt_height / 2,
      this.belt_height,
      this.belt_height,
      PI / 2,
      1.5 * PI
    );
    arc(
      width - this.belt_height / 2,
      this.belt_level + this.belt_height / 2,
      this.belt_height,
      this.belt_height,
      1.5 * PI,
      PI / 2
    );
  }
}
class Part {
  constructor() {
    this.x = 800;
    this.y = 150;
    this.size = 30;
    this.connected = false;
  }
  render() {
    if (this.connected || (mouseIsPressed && this.m_inside())) {
      this.connected = true;
      this.x += mouseX - pmouseX;
      this.y += mouseY - pmouseY;
    }
    if (!mouseIsPressed) {
      this.connected = false;
      this.x = 800;
      this.y = 150;
    }
    fill(170);
    rect(this.x, this.y, this.size);
  }
  move(_speed) {
    this.x += _speed;
  }
  m_inside() {
    return (
      mouseX < this.x + this.size &&
      mouseX > this.x &&
      mouseY > this.y &&
      mouseY < this.y + this.size
    );
  }
}
