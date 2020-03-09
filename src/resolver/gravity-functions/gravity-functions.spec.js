const calculateHypoteneuse = require('./gravity-functions').calculateHypoteneuse;
const unconjugate = require('./gravity-functions').unconjugate
const calculateAcceleration = require('./gravity-functions').calculateAcceleration;
const findAccelerationBetweenBodies = require('./gravity-functions').findAccelerationBetweenBodies;

describe('#calculateHypoteneuse', () => {
    it('should calculate the magnitude of a vector given its x and y components', () => {
        expect(calculateHypoteneuse(3,4)).toEqual(5);
        expect(calculateHypoteneuse(5,12)).toEqual(13);
        expect(calculateHypoteneuse(8,15)).toEqual(17);
        expect(calculateHypoteneuse(9,40)).toEqual(41);
    });
});

describe('#unconjugate', () => {
    it('should calculate the x or y component of a vector given its magnitude and the ratio of x to y', () => {
        expect(unconjugate(5, 4/3)).toEqual(3);
        expect(unconjugate(5, 3/4)).toEqual(4);
        expect(unconjugate(34, 1.875)).toEqual(16);
    });
});

describe('#calculateAcceleration', () => {
    it('should calculate the acceleration due to gravity from a body given the mass of the body, distance from it and the gravitation constant', () => {
        expect(calculateAcceleration(100,50,10)).toEqual(0.05);
    });
});

describe('#findAccelerationBetweenBodies', () => {
    it('should calculate the acceleration on one body from another', () => {
        const self = [100, 0, 0];
        const other = [500, 60, 80];

        expect(findAccelerationBetweenBodies(other, self, 10)).toEqual([0.3, 0.4]);
    });

    it('should maintain whether the acceleration is negative', () => {
        const self = [100, 0, 0];
        const other = [500, 60, -80];

        expect(findAccelerationBetweenBodies(other, self, 10)).toEqual([0.3, -0.4]);
    });
});
