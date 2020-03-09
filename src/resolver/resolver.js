const GPU = require('gpu.js').GPU;

class Resolver {
    constructor(gravityConstant = 1) {
        this.gravityConstant = gravityConstant;
        this.setupGpuFunctions();
    }

    setupGpuFunctions() {
        this.gpu = new GPU();

        this.gpu.addFunction(calcAcceleration, {argumentTypes: {distance: 'Number', mass: 'Number', gravityConstant: 'Number'}})
        this.gpu.addFunction(calculateHypoteneuse)
        this.gpu.addFunction(unconjugate)
        this.gpu.addFunction(findAcceleration, {argumentTypes: {other: 'Array(3)', self: 'Array(3)', gravityConstant: 'Number'}})

        this.calculatePositions = this.gpu.createKernel(resolve, { dynamicOutput: true })
    }

    resolveNewPositions(bodies) {
        this.kernalWrapper(bodies, (bodiesArray) => {
            this.calculatePositions.setOutput([bodies.length]);
            this.calculatePositions.setConstants({ size: bodies.length, gravityConstant: this.gravityConstant });
            return this.calculatePositions(bodiesArray);
        });
    }

    kernalWrapper(bodies, callback) {
        const bodiesArray = bodies.map(body => [body.mass, body.positionX, body.positionY, body.velocityX, body.velocityY])
    
        const bodiesResponse = callback(bodiesArray);

        bodiesResponse.forEach((element, index) => {
            bodies[index].positionX = element[0];
            bodies[index].positionY = element[1];
            bodies[index].velocityX = element[2];
            bodies[index].velocityY = element[3];
        });
    }
}

function calcAcceleration(distance, mass, gravityConstant) { 
    return (gravityConstant * mass) / ((distance) ** 2); 
}

function unconjugate(vectorMagnitude, ratio) { 
    return Math.sqrt((vectorMagnitude ** 2) / ((ratio ** 2) + 1)) 
}

function calculateHypoteneuse(x, y) { 
    return Math.sqrt((x ** 2) + (y ** 2)) 
}

function findAcceleration(other, self, gravityConstant) {
    const distanceX = Math.abs(other[1] - self[1])
    const distanceY = Math.abs(other[2] - self[2])

    const distance = calculateHypoteneuse(other[1] - self[1], other[2] - self[2])

    const acceleration = calcAcceleration(distance, other[0], gravityConstant)
    let x = unconjugate(acceleration, distanceY / distanceX)
    let y = unconjugate(acceleration, distanceX / distanceY)

    if (other[1] < self[1]) { x = -x };
    if (other[2] < self[2]) { y = -y };

    return [x, y]
}

function resolve (bodies) {
    let xPosition = bodies[this.thread.x][1]
    let yPosition = bodies[this.thread.x][2]
    let xVelocity = bodies[this.thread.x][3]
    let yVelocity = bodies[this.thread.x][4]

    for (let i = 0; i < this.constants.size; i++) {
        if (i !== this.thread.x) {
            const acceleration = findAcceleration(
                [bodies[i][0], bodies[i][1], bodies[i][2]], 
                [bodies[this.thread.x][0], xPosition, yPosition], 
                this.constants.gravityConstant
            )
            xVelocity += acceleration[0]
            yVelocity += acceleration[1]
        }
    }

    return [xPosition + xVelocity, yPosition + yVelocity, xVelocity, yVelocity]
}

module.exports.Resolver = Resolver;