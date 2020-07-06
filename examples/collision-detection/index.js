var width = 960,
    height = 540

var nodes = d3.range(2000).map(function(d, i) {
        return { r: Math.random() * 6 + 2, id: i.toString() }
    }),
    root = nodes[0],
    color = d3.scale.category10()

root.r = 0
root.fixed = true

var force = d3.layout
    .force()
    .gravity(0.05)
    .charge(function(d, i) {
        return i ? 0 : -2000
    })
    .nodes(nodes)
    .size([width, height])

force.start()

var div = d3.select('#main')
var netV = new NetV({
    container: div.node(),
    width,
    height,
    nodeLimit: 10000
})

netV.data({
    nodes: nodes.slice(1),
    links: []
})

// var svg = d3
//     .select('body')
//     .append('svg')
//     .attr('width', width)
//     .attr('height', height)
// svg.selectAll('circle')
//     .data(nodes.slice(1))
//     .enter()
//     .append('circle')
//     .attr('r', function(d) {
//         return d.r
//     })
//     .style('fill', function(d, i) {
//         return color(i % 3)
//     })

force.on('tick', function(e) {
    var q = d3.geom.quadtree(nodes),
        i = 0,
        n = nodes.length

    while (++i < n) q.visit(collide(nodes[i]))

    // svg.selectAll('circle')
    //     .attr('cx', function(d) {
    //         return d.x
    //     })
    //     .attr('cy', function(d) {
    //         return d.y
    //     })
    nodes.slice(1).forEach((d) => {
        var node = netV.getNodeById(d.id)
        node.x(d.x)
        node.y(d.y)
    })
    netV.draw()
})

// svg.on('mousemove', function() {
div.on('mousemove', function() {
    var p1 = d3.mouse(this)
    root.px = p1[0]
    root.py = p1[1]
    force.resume()
})

function collide(node) {
    var r = node.r + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && quad.point !== node) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.r + quad.point.r
            if (l < r) {
                l = ((l - r) / l) * 0.5
                node.x -= x *= l
                node.y -= y *= l
                quad.point.x += x
                quad.point.y += y
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
    }
}
