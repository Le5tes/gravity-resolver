const resolver = require('./resolver/resolver').Resolver
const barnesHutTreeResolver = require('./barnes-hut-tree-resolver/barnes-hut-tree-resolver').BarnesHutTreeResolver

module.exports = { 
    GravityResolver: resolver, 
    BarnesHutTreeResolver: barnesHutTreeResolver
}
