let canvas = document.getElementById('graph');
let ctx = canvas.getContext('2d');

let graph = new Network();

function generateGraph() {
    for (let i = 0; i < 300; i++) {
        graph.add_node(undefined, undefined, i);
    }
    
    arrange();
    update();
}