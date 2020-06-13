const GPU = require('gpu.js').GPU;
const calculateHypoteneuse = require('./gravity-functions/gravity-functions').calculateHypoteneuse;
const unconjugate = require('./gravity-functions/gravity-functions').unconjugate;
const calculateAcceleration = require('./gravity-functions/gravity-functions').calculateAcceleration;
const findAccelerationBetweenBodies = require('./gravity-functions/gravity-functions').findAccelerationBetweenBodies;

class Resolver {
    constructor(gravityConstant = 1) {
        this.gravityConstant = gravityConstant;
        this.setupGpuFunctions();
    }

    setupGpuFunctions() {
        this.gpu = new GPU();

        this.gpu.addFunction(calculateAcceleration, {argumentTypes: {distance: 'Number', mass: 'Number', gravityConstant: 'Number'}})
        this.gpu.addFunction(calculateHypoteneuse)
        this.gpu.addFunction(unconjugate)
        this.gpu.addFunction(findAccelerationBetweenBodies, {argumentTypes: {other: 'Array(3)', self: 'Array(3)', gravityConstant: 'Number'}})

        this.calculatePositions = this.gpu.createKernel(resolve, { dynamicOutput: true })
    }

    resolveNewPositions(bodies) {
        return this.kernalWrapper(bodies, (bodiesArray) => {
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

        return bodies;
    }
}

function resolve (bodies) {
    let xPosition = bodies[this.thread.x][1]
    let yPosition = bodies[this.thread.x][2]
    let xVelocity = bodies[this.thread.x][3]
    let yVelocity = bodies[this.thread.x][4]

    for (let i = 0; i < this.constants.size; i++) {
        if (i !== this.thread.x) {
            const acceleration = findAccelerationBetweenBodies(
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