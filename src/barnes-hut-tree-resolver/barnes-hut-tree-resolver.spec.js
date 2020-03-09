const BarnesHutTreeResolver = require('./barnes-hut-tree-resolver').BarnesHutTreeResolver;

describe('Resolver', () => {
    let resolver;
    beforeEach(() => {
        resolver = new BarnesHutTreeResolver(1);
    });

    it('should exist', () => {
        expect(resolver).toBeTruthy();
    });

    describe("#calculateNewPositions", () => {
        it('should exist', () => {
            expect(resolver.calculateNewPositions).toBeTruthy();
        });
    });
});