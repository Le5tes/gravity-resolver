# Gravity Resolver
Provides two classes for performing gravity calculations in 2D.

### Gravity Resolver
Given an array of bodies, parallelly performs gravity calculations between all bodies on GPU, and returns the array of bodies with updated position and velocity vectors

### Barnes Hut Tree Resolver
Given an array of bodies and a quadtree of nodes with references to the bodies, parallelly performs gravity calculation approximation via the barnes hut algorithm, and returns the array of bodies with updated position and velocity vectors

## Installation
npm install @gravity-simulator/gravity-resolver   

## Usage
Bodies should provide the following properties:
  - mass: number
  - positionX: number
  - positionY: number
  - velocityX: number
  - velocityY: number 

## Example usage - Gravity Resolver
```
const GravityResolver = require('@gravity-simulator/gravity-resolver').GravityResolver;

const resolver = new GravityResolver();

const bodies = [{mass: 100, positionX: 40, positionY: 120, velocityX: 0, velocityY: 0},
                {mass: 200, positionX: 80, positionY: 120, velocityX: 0, velocityY: 0},
                {mass: 50, positionX: 160, positionY: 40, velocityX: 0, velocityY: 0},
                {mass: 100, positionX: 160, positionY: 160, velocityX: 0, velocityY: 0}];

resolver.resolveNewPositions(bodies);

console.log(bodies) 
==> [
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
    ]
```

### Considerations
Gravity Resolver is suitable for smaller numbers of bodies. For larger numbers of bodies, Barnes Hut Tree resolver should offer greater performance. 
To build the quadtree, use barnes-hut-tree-builder module https://www.npmjs.com/package/barnes-hut-tree-builder, using the buildToArray method. 

This project is still in early development and further features for ease of use, as well as more extensive documentation will be coming in later versions.
