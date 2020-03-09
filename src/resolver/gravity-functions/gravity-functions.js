function calculateHypoteneuse(x, y) { 
    return Math.sqrt((x ** 2) + (y ** 2)) 
}

function unconjugate(vectorMagnitude, ratio) { 
    return Math.sqrt((vectorMagnitude ** 2) / ((ratio ** 2) + 1)) 
}

function calculateAcceleration(distance, mass, gravityConstant) { 
    return (gravityConstant * mass) / ((distance) ** 2); 
}

function findAccelerationBetweenBodies(other, self, gravityConstant) {
    const distanceX = Math.abs(other[1] - self[1]);
    const distanceY = Math.abs(other[2] - self[2]);

    const distance = calculateHypoteneuse(distanceX, distanceY);

    const acceleration = calculateAcceleration(distance, other[0], gravityConstant);
    let x = unconjugate(acceleration, distanceY / distanceX);
    let y = unconjugate(acceleration, distanceX / distanceY);

    if (other[1] < self[1]) { x = -x };
    if (other[2] < self[2]) { y = -y };

    return [x, y];
}

module.exports.calculateHypoteneuse = calculateHypoteneuse;
module.exports.unconjugate = unconjugate;
module.exports.calculateAcceleration = calculateAcceleration;
module.exports.findAccelerationBetweenBodies = findAccelerationBetweenBodies;