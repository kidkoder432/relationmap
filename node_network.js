'use strict';


class Node {
    constructor(x = 0, y = 0, label = '1', color) {

        this.x = x ? x : randint(1, 45, 66);
        this.y = y ? y : randint(1, 45, 66);
        this.bcolor = color ? color : getColor()

        this.label = label;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.bcolor;
        ctx.arc(this.x, this.y, 25, 0, 2 * Math.PI);
        ctx.fill()
        console.log('circle done')
        ctx.fillStyle = '#ffffff';// textThreshold(this.bcolor)
        ctx.textAlign = 'center';
        if (drawText) {
            fitTextOnCanvas(this.label, 'Roboto Mono', this.x, this.y + 5);
        }
        console.log('text done')

    }

    mouseOn(mx, my) {

        let inX = ((this.x - 25) <= mx) && (mx <= (this.x + 25));
        let inY = ((this.y - 25) <= my) && (my <= (this.y + 25));
        return inX && inY
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }


}


class Network {
    constructor() {
        this.nodes = {};
        this.edges = [];

    }

    add_node(x = 0, y = 0, label = '', color) {
        let newColor = color ? color : getColor();

        this.nodes[label] = new Node(x, y, label, newColor);

    }

    add_edge(fromNode, toNode, color) {

        this.edges.push([fromNode, toNode, color ? color : getColor()]);
    }

    prune(nodeLabel = 33333) {

        for (let edge of this.edges.slice()) {
            if (edge.includes(nodeLabel)) {
                this.edges = remove(this.edges, edge);
            }

            for (let node of Object.keys(this.nodes).slice()) {
                if (!this.edges.flat().includes(node)) {
                    delete this.nodes[node];
                }

            }
        }
    }

    delete_node(nodeLabel) {
        delete this.nodes[nodeLabel];
        this.prune(nodeLabel)


    }

    show(nodes = this.nodes, edges = this.edges) {
        for (let edge of edges) {
            let fromX = this.nodes[edge[0]].x;
            let fromY = this.nodes[edge[0]].y + 10;
            let toX = this.nodes[edge[1]].x;
            let toY = this.nodes[edge[1]].y - 10;
            // console.log(edge, fromX, fromY, toX, toY)
            ctx.beginPath()
            ctx.strokeStyle = edge[2];


            ctx.moveTo(fromX, fromY)
            ctx.lineTo(toX, toY)
            ctx.stroke()
            ctx.fillStyle = '#dddddd'

            let d = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
            let d2 = d - 50;

            let ratio = d2 / d;

            let dx = (toX - fromX) * ratio;
            let dy = (toY - fromY) * ratio;

            toX = fromX + dx;
            toY = fromY + dy;

            drawArrowhead(fromX, fromY, toX, toY)
            ctx.fill();


        }

        for (let node of Object.values(nodes)) {
            node.draw();

        }

    }

    async save(fileName) {
        let connections = {};
        for (let edge of this.edges) {
            connections[edge[0]] = { 'friends': [], 'likes': [], 'enemies': [] }
        }

        for (let edge of this.edges) {
            if (edge[2] === COLORS['likes']) {
                connections[edge[0]]['likes'].push(edge[1])
            } else if (edge[2] === COLORS['friends']) {
                connections[edge[0]]['friends'].push(edge[1])
            } else if (edge[2] === COLORS['enemies']) {
                connections[edge[0]]['enemies'].push(edge[1])
            }
        }
        let stateFile = new FormData()
        stateFile.append('data', JSON.stringify(this.nodes))
        await fetch('/upload.php', {
            method: 'POST'
        })

    }

    mouseNode(e, x = 0, y = 0) {
        if (e) {
            [x, y] = getMousePos(e)
        }
        for (let node of Object.values(this.nodes)) {
            let nodelabel;
            if (node.mouseOn(x, y) === true) {
                nodelabel = node.label;
                return nodelabel;

            }
        }
        return null;

    }

    mouseEdge(e) {
        let closestDistance = Infinity;
        let closestEdge;
        let [mx, my] = getMousePos(e);
        for (let edge of this.edges) {
            let [x1, y1] = [this.nodes[edge[0]].x, this.nodes[edge[0]].y + 10]
            let [x2, y2] = [this.nodes[edge[1]].x, this.nodes[edge[1]].y - 10]
            let slope = (y2 - y1) / (x2 - x1)
            let yi = y1 - (slope * x1)
            let closestDistanceToCurLine = (Math.abs((slope * mx) - my + yi) / Math.sqrt(slope ** 2 + 1));
            // console.log(slope, edge, x1, y1, x2, y2, yi, mx, my, a, b, c, closestDistance)
            // if (Math.abs(closestDistanceToCurLine) <= 10) {
            //     return edge; // Return the closest edge if it is less that 10 px away from the mouse
            // }

            if (Math.abs(closestDistanceToCurLine) <= closestDistance) {
                closestDistance = Math.abs(closestDistanceToCurLine);
                closestEdge = edge;
            }
        }

        if (Math.abs(closestDistance) <= 10) {
            return closestEdge;
        }

        return null; // All edges are too far away

    }


    set_edges(edges) {
        this.edges = edges;
    }

    set_nodes(nodes) {
        this.nodes = nodes;
    }

    createFromJSON(jsonData) {
        for (let person of Object.keys(jsonData)) {
            this.add_node(undefined, undefined, person)
            for (let conType of Object.keys(jsonData[person])) {
                let con = jsonData[person][conType];
                for (let newPerson of con) {
                    if ((newPerson in Object.keys(this.nodes))) {
                    } else {
                        this.add_node(undefined, undefined, newPerson)
                    }
                    this.add_edge(person, newPerson, COLORS[conType])
                }
            }
        }

    }

    getConnectedNodes(selected) {
        let relevantEdges = this.edges.filter(x => x.includes(selected))
        let connectedNodes = []
        for (let x of relevantEdges) {
            connectedNodes.push(x.slice(0, 2).filter(f => f !== selectd))
        }
        return connectedNodes;

    }

}

function drawCircle() {
    let [mx, my] = getMousePos(e)
}
