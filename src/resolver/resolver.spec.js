const Resolver = require('./resolver').Resolver;

describe('Resolver', () => {
    let resolver;
    beforeEach(() => {
        resolver = new Resolver(1);
    });

    it('should exist', () => {
        expect(resolver).toBeTruthy();
    });

    describe("#resolveNewPositions", () => {
        let bodiesArray

        beforeEach(() => {
            bodiesArray = [{
                mass: 100,
                positionX: 40,
                positionY: 120,
                velocityX: 0,
                velocityY: 0
            }, {
                mass: 200,
                positionX: 80,
                positionY: 120,
                velocityX: 0,
                velocityY: 0
            }, {
                mass: 50,
                positionX: 160,
                positionY: 40,
                velocityX: 0,
                velocityY: 0
            }, {
                mass: 100,
                positionX: 160,
                positionY: 160,
                velocityX: 0,
                velocityY: 0
            }]
            
        })

        it('should exist', () => {
            expect(resolver.resolveNewPositions).toBeTruthy();
        });

        it('should update the passed in array of bodies with their new positions and velocities', () => {
            resolver.resolveNewPositions(bodiesArray);
            
            expect(bodiesArray).toEqual([
                {
                  mass: 100,
                  positionX: 40.132930755615234,
                  positionY: 120.00064086914062,
                  velocityX: 0.13292938470840454,
                  velocityY: 0.00064300955273211
                },
                {
                  mass: 200,
                  positionX: 79.9514389038086,
                  positionY: 120.0028305053711,
                  velocityX: -0.048557523638010025,
                  velocityY: 0.0028280343394726515
                },
                {
                  mass: 50,
                  positionX: 159.98495483398438,
                  positionY: 40.020660400390625,
                  velocityX: -0.015048785135149956,
                  velocityY: 0.02065981552004814
                },
                {
                  mass: 100,
                  positionX: 159.97171020507812,
                  positionY: 159.98336791992188,
                  velocityX: -0.028289951384067535,
                  velocityY: -0.016628986224532127
                }
              ]);
        });
    });
});
