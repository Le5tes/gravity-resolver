const Resolver = require('../resolver/resolver').Resolver;
const fs = require('fs');

class BarnesHutTreeResolver extends Resolver {
    constructor(gravityConstant = 1) {
        super(gravityConstant);
    }

    setupGpuFunctions() {
        super.setupGpuFunctions()
        this.gpu.addFunction(notTheSameBody, { argumentTypes: { body1: 'Array(3)', body2: 'Array(3)' } });
        this.gpu.addFunction(isSmallEnoughAngle);

        this.resolvePositionsFromTree = this.gpu.createKernel(JSON.parse(fs.readFileSync('./jsonKernal.json')))
        // this.resolvePositionsFromTree = this.gpu.createKernel(resolve, { dynamicOutput: true, dynamicArguments: true })
        

    }

    resolveNewPositions(bodies, tree) {
        return this.kernalWrapper(bodies, (bodiesArray) => {
            this.resolvePositionsFromTree.setOutput([bodies.length]);
            this.resolvePositionsFromTree.setLoopMaxIterations(tree.length * 5);
            this.resolvePositionsFromTree.setConstants({gravityConstant: this.gravityConstant });
            
            return this.resolvePositionsFromTree(bodiesArray, tree);
        })
    }

    buildToJson() {
        console.log('writing')
        const json = this.resolvePositionsFromTree.toJSON()
        console.log(json)
        fs.writeFileSync('./jsonKernal.json', JSON.stringify(json));
        // fs.writeFileSync('./kernal.js', 'module.exports = ' + this.resolvePositionsFromTree.toString())
        console.log('written')
    }
}


function notTheSameBody(body1, body2) {
    if (!(body1[0] === body2[0] && body1[1] === body2[1])) {
        return 1
    } else {
        return 0
    }
}

function isSmallEnoughAngle(bodyPositionX, bodyPositionY, nodePositionX, nodePositionY, width) {
    if (0.5 > (width / calculateHypoteneuse(bodyPositionX - nodePositionX, bodyPositionY - nodePositionY))) {
        return 1;
    } else {
        return 0;
    }
}

function resolve (bodies, tree) {
    let xVelocity = bodies[this.thread.x][3];
    let yVelocity = bodies[this.thread.x][4];

    let currentAddress = 0;
    let previousAddress = -1;
    let parentAddress = 0;

    while (currentAddress != -1) {
        const mass = tree[currentAddress][2];
        const bodyAddress = tree[currentAddress][7];
        parentAddress = tree[currentAddress][6];

        if (mass === 0) {
            previousAddress = currentAddress
            currentAddress = parentAddress;

        } else if (bodyAddress !== -1) {
            if (notTheSameBody([bodies[bodyAddress][0], bodies[bodyAddress][1], bodies[bodyAddress][2]], [bodies[this.thread.x][0], bodies[this.thread.x][1], bodies[this.thread.x][2]]) == 1) {
                const acceleration = findAccelerationBetweenBodies([bodies[bodyAddress][2], bodies[bodyAddress][0], bodies[bodyAddress][1]], [bodies[this.thread.x][2], bodies[this.thread.x][0], bodies[this.thread.x][1]], 
                    this.constants.gravityConstant)
                xVelocity += acceleration[0]
                yVelocity += acceleration[1]
            }
            previousAddress = currentAddress;
            currentAddress = parentAddress;

        } else if (isSmallEnoughAngle(bodies[this.thread.x][0], bodies[this.thread.x][1], tree[currentAddress][0], tree[currentAddress][1], tree[currentAddress][3]) == 1) {
            const acceleration = findAccelerationBetweenBodies([tree[currentAddress][2], tree[currentAddress][0], tree[currentAddress][1]], [bodies[this.thread.x][2], bodies[this.thread.x][0], bodies[this.thread.x][1]], 
                this.constants.gravityConstant)
            xVelocity += acceleration[0]
            yVelocity += acceleration[1]

            previousAddress = currentAddress;
            currentAddress = parentAddress;

        } else {
            let previousSubnode = -1
            if (previousAddress != -1) {
                for (let i = 0; i < 4; i++) {
                    if (previousAddress == tree[currentAddress][i + 8]) {
                        previousSubnode = i;
                    }
                }
            }

            let nextSubnodeNumber = previousSubnode + 1
            while (nextSubnodeNumber < 4 && tree[currentAddress][nextSubnodeNumber + 8] == -1) {
                nextSubnodeNumber++
            }

            if (nextSubnodeNumber < 4) {
                const nextSubnode = tree[currentAddress][nextSubnodeNumber + 8]
                previousAddress = currentAddress
                currentAddress = nextSubnode
            } else {
                previousAddress = currentAddress
                currentAddress = parentAddress
            }
        }
    }

    return [bodies[this.thread.x][0] + xVelocity, bodies[this.thread.x][1] + yVelocity, xVelocity, yVelocity]
}

module.exports.BarnesHutTreeResolver = BarnesHutTreeResolver;