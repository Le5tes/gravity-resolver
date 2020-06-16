const BarnesHutTreeResolver = require('./barnes-hut-tree-resolver').BarnesHutTreeResolver;

describe('Resolver', () => {
    let resolver;
    beforeEach(() => {
        resolver = new BarnesHutTreeResolver(1);
    });

    it('should exist', () => {
        expect(resolver).toBeTruthy();
    });

    describe("#resolveNewPositions", () => {
        it('should exist', () => {
            expect(resolver.resolveNewPositions).toBeTruthy();
        });

        it('should resolve a tree and bodies', () => {
            const bodies = [{
                mass: 100,
                positionX: 515,
                positionY: 300,
                velocityX: 0,
                velocityY: 0
            }, {
                mass: 55,
                positionX: 101, 
                positionY: 23,
                velocityX: 0,
                velocityY: 0
            }, {
                mass: 692,
                positionX: 12, 
                positionY: 992,
                velocityX: 0,
                velocityY: 0
            }, {
                mass: 47,
                positionX: 579, 
                positionY: 453,
                velocityX: 0,
                velocityY: 0
            }, {
                mass: 300,
                positionX: 109, 
                positionY: 645,
                velocityX: 0,
                velocityY: 0
            }];

            const tree = [
                [104.9179229480737, 781.0050251256281, 1194, 1000, 0, 0, -1, -1, 2, 1, 3, -1],
                [535.4625850340136, 348.9183673469388, 147, 500, 500, 0, 0, -1, -1, -1, 4, -1],
                [101, 23, 55, 500, 0, 0, 0, 1, -1, -1, -1, -1],
                [41.33467741935484, 887.0604838709677, 992, 500, 0, 500, 0, -1, 8, -1, 7, -1],
                [535.4625850340136, 348.9183673469388, 147, 250, 500, 250, 1, -1, 5, -1, 6, -1],
                [515, 300, 100, 125, 500, 250, 4, 0, -1, -1, -1, -1],
                [579, 453, 47, 125, 500, 375, 4, 3, -1, -1, -1, -1],
                [12, 992, 692, 250, 0, 750, 3, 2, -1, -1, -1, -1],
                [109, 645, 300, 250, 0, 500, 3, 4, -1, -1, -1, -1],
            ];

            const result = resolver.resolveNewPositions(bodies, tree);

            expect(result).toBeTruthy();
        });

        it('should be able to resolve a larger tree', () => {
            const bodies = require('../test-data/bodies').bodies;
            const tree = require('../test-data/tree').tree;

            const result = resolver.resolveNewPositions(bodies, tree);

            expect(result).toBeTruthy();
        });

        it('should cause stationary bodies to become closer together', () => {
            const bodiesArray = [{
                mass: 100,
                positionX: 100,
                positionY: 100,
                velocityX: 0,
                velocityY: 0
            }, {
                mass: 100,
                positionX: 0,
                positionY: 0,
                velocityX: 0,
                velocityY: 0
            }];

            const tree = [
                [
                  50, 50, 200, 101,  0,
                   0, -1,  -1,   2, -1,
                  -1,  1
                ],
                [
                   100,  100, 100, 50.5,
                  50.5, 50.5,   0,    0,
                    -1,   -1,  -1,   -1
                ],
                [
                   0,  0, 100, 50.5,
                   0,  0,   0,    1,
                  -1, -1,  -1,   -1
                ]
            ]

            const result = resolver.resolveNewPositions(bodiesArray, tree);

            expect(result).toEqual([
                {
                  mass: 100,
                  positionX: 99.99646759033203,
                  positionY: 99.99646759033203,
                  velocityX: -0.0035355337895452976,
                  velocityY: -0.0035355337895452976
                },
                {
                  mass: 100,
                  positionX: 0.0035355337895452976,
                  positionY: 0.0035355337895452976,
                  velocityX: 0.0035355337895452976,
                  velocityY: 0.0035355337895452976
                }
            ]);
        });
    });
});