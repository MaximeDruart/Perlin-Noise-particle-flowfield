// Project inspired by the coding train on youtube
// Check out his series of videos on perlin noise

const getGrid = (width, height, elementToFillWith = 0) => {
  let grid = []
  for (let i = 0; i < height; i++) {
    let row = []
    for (let j = 0; j < width; j++) row.push(elementToFillWith)
    grid.push(row)
  }
  return grid
}

let grid
let gridSize = 40
let step
let flowfield
let showFlowfield = false
let particles = []

function setup() {
  createCanvas(900, 900)
  step = width / gridSize
  angleMode(DEGREES)
  flowfield = getFlowfield(gridSize, gridSize)
  for (let i = 0; i < 500; i++) {
    particles.push(new Particle())
  }

  let flowfieldButton = createButton("show flowfield")
  flowfieldButton.position(0, 0)
  flowfieldButton.mousePressed(() => (showFlowfield = !showFlowfield))
}

let inc = 0.1
let startxoff = 0,
  startyoff = 0

const getFlowfield = (height = gridSize, width = gridSize) => {
  let grid = getGrid(height, width)
  let yoff = startyoff
  for (let i = 0; i < grid.length; i++) {
    let xoff = startxoff
    for (let j = 0; j < grid[i].length; j++) {
      let noiseVal = noise(xoff, yoff, zoff)
      let noiseAngleDeg = map(noiseVal, 0, 1, -360, 360)
      grid[i][j] = p5.Vector.fromAngle(radians(noiseAngleDeg)).setMag(0.8)
      xoff += inc
    }
    yoff += inc
  }
  return grid
}

const drawNoiseMap = () => {
  let grid = getGrid(gridSize, gridSize)
  noStroke()
  clear()
  let yoff = startyoff
  for (let i = 0; i < grid.length; i++) {
    let xoff = startxoff
    for (let j = 0; j < grid[i].length; j++) {
      let noiseVal = noise(xoff, yoff, zoff)
      fill(noiseVal * 255)
      rect(j * step, i * step, step, step)
      stroke(0)
      xoff += inc
    }
    yoff += inc
  }
}

const drawFlowfield = flowfield => {
  flowfield.forEach((row, rowIndex) => {
    row.forEach((vector, vectorIndex) => {
      push()
      translate(vectorIndex * step, rowIndex * step)
      stroke(0)
      rotate(degrees(vector.heading().toFixed(2)))
      line(0, 0, step, 0)
      pop()
    })
  })
}

let zoff = 0
function draw() {
  noStroke()
  clear()
  // background(255, 255, 255, 20)
  // drawNoiseMap()
  flowfield = getFlowfield()
  mouseIsPressed && vectorAttraction()
  showFlowfield && drawFlowfield(flowfield)

  particles.forEach(particle => {
    particle.edges()
    particle.follow(flowfield)
    particle.update()
    particle.draw()
  })
  zoff += 0.01
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight)
// }

const getGridCoordForPos = (x, y) => ({
  x: Math.floor((x / width) * gridSize),
  y: Math.floor((y / height) * gridSize)
})

const vectorAttraction = (strength = 0.65) => {
  // this version works but the flowfield is visually incorrect and i cant figure out why
  let radius = Math.floor(gridSize / 3)
  let mpos = getGridCoordForPos(mouseX, mouseY)
  for (let i = mpos.y - radius; i < mpos.y + radius; i++) {
    for (let j = mpos.x - radius; j < mpos.x + radius; j++) {
      if (flowfield[i]) {
        if (flowfield[i][j]) {
          let newVec2 = p5.Vector.sub(
            new p5.Vector(mouseX, mouseY),
            new p5.Vector(i * step, j * step)
          ).setMag(strength)
          flowfield[i][j] = newVec2
        }
      }
    }
  }
}

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      flowfield = getFlowfield(gridSize, gridSize)
      startxoff -= 0.1
      break
    case RIGHT_ARROW:
      flowfield = getFlowfield(gridSize, gridSize)
      startxoff += 0.1
      break
    case DOWN_ARROW:
      flowfield = getFlowfield(gridSize, gridSize)
      startyoff += 0.1
      break
    case UP_ARROW:
      flowfield = getFlowfield(gridSize, gridSize)
      startyoff -= 0.1
      break
    default:
      break
  }
}
