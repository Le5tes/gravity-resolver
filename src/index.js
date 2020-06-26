const resolver = require('./resolver/resolver').Resolver
const barnesHutTreeResolver = require('./barnes-hut-tree-resolver/barnes-hut-tree-resolver').BarnesHutTreeResolver
const gravityFunctions = require('./resolver/gravity-functions/gravity-functions')

module.exports = { 
    GravityResolver: resolver, 
    BarnesHutTreeResolver: barnesHutTreeResolver,
    GravityFunctions: gravityFunctions
}
