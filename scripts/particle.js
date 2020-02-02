class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height))
    this.vel = createVector(0, 0)
    this.acc = createVector(0, 0)
    this.speedLimit = 10
    this.size = 10
    this.color = [random(255), random(255), random(255)]
  }

  update() {
    this.vel.add(this.acc)
    this.vel.limit(this.speedLimit)
    this.pos.add(this.vel)
    this.acc.mult(0)
  }

  applyForce(force) {
    this.acc.add(force)
  }

  draw() {
    push()
    fill(0)
    stroke(this.color[0], this.color[1], this.color[2])
    strokeWeight(this.size)
    point(this.pos.x, this.pos.y)
    pop()
  }

  follow(flowfield) {
    const gridPos = {
      x: floor((this.pos.x / width) * gridSize),
      y: floor((this.pos.y / height) * gridSize)
    }
    if (gridPos.x === gridSize) gridPos.x -= 1
    if (!flowfield[gridPos.x]) console.log(gridPos, this.pos)
    let force = flowfield[gridPos.x][gridPos.y]
    this.applyForce(force)
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0
    }
    if (this.pos.x < 0) {
      this.pos.x = width
    }
    if (this.pos.y > height) {
      this.pos.y = 0
    }
    if (this.pos.y < 0) {
      this.pos.y = height
    }
  }
}
