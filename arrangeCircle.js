function ptc(d, t) {
    return [Math.cos(t) * d, Math.sin(t) * d]
}

function ctp(x, y) {
    return [Math.sqrt(x ^ 2, y ^ 2), Math.atan2(y, x)]
}

function arrange() {
    
    let minLength = 120;
    let numNodes = Object.keys(graph.nodes).length;
    let step = 2 * Math.PI / numNodes;

    let d = 1400;  // minLength / step;

    let angle = 0;
    for (let n of Object.values(graph.nodes)) {
        let [nx, ny] = ptc(d, angle);
        nx += d + 60;
        ny += d + 60;
        n.setPosition(nx, ny);
        angle += step;
    }
    update()
}

