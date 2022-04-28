canvas.onclick = function (e) {
    let clickedNode = graph.mouseNode(e);
    let [mx, my] = getMousePos(e)
    mx = Math.round(mx)
    my = Math.round(my)
    if (clickedNode === null) { // We didn't click a node
        let clickedEdge = graph.mouseEdge(e);
        // noinspection JSUnusedLocalSymbols
        if (clickedEdge === null) { // and we also didn't click an edge
            // Create a new node with the specified name.
            nameModal.style.display = 'block';
            done.onclick = function () {
                nameModal.style.display = "none";
                nodeName = nameIn.value;
                graph.add_node(mx, my, nodeName);
                update()
            }
        } else { // but we clicked an edge
            // Show the dialog for modifying an edge
            edgeModal.style.display = 'block';
            document.getElementById('ei').innerHTML = clickedEdge;
            deleteB.onclick = function () {
                edgeModal.style.display = 'none'
                graph.edges = remove(graph.edges, clickedEdge)
                graph.prune();

            }
            update()

            edone.onclick = function () {
                let selectedType;

                switch (edgeTypeIn.options[edgeTypeIn.selectedIndex].value) {
                    case "Friend":
                        selectedType = "friends";
                        break;

                    case "Enemy":
                        selectedType = 'enemies';
                        break;

                    case "Likes":
                        selectedType = 'likes'
                        break;

                    case "Acquaintance":
                        selectedType = 'acquaintances'
                        break;
                }
                graph.edges = remove(graph.edges, clickedEdge)
                clickedEdge[2] = COLORS[selectedType];
                graph.edges.push(clickedEdge)
                edgeModal.style.display = 'none';
                graph.prune()
                update()
            }
        }
    } else { // We clicked a node

        nodeColorPicker.value = graph.nodes[clickedNode].bcolor;

        connectNode.innerHTML = '';
        let names = remove(Object.keys(graph.nodes), clickedNode)
        for (let edge of graph.edges) {
            if (edge[0] === clickedNode) {
                names = remove(names, edge[1]) // Don't let users add connections that already exist
            }
        }
        for (let name of names) {
            let opt = document.createElement('option');
            opt.text = name;
            opt.value = name;
            connectNode.appendChild(opt);
        }
        nodeModal.style.display = 'block';
        document.getElementById('nn').innerHTML = clickedNode
        // document.getElementById('oc').innerHTML = graph.edges.filter(x => x[0] === clickedNode)
        // document.getElementById('ic').innerHTML = graph.edges.filter(x => x[1] === clickedNode)
        deleteNode.onclick = function () {
            graph.delete_node(clickedNode)
            console.log(clickedNode)
            nodeModal.style.display = 'none'
            update()

        }
        ndone.onclick = function () {
            graph.nodes[clickedNode].bcolor = nodeColorPicker.value
            let nodeToConnect = connectNode.options[connectNode.selectedIndex].value
            let selectedType;
            switch (conTypeSelect.options[conTypeSelect.selectedIndex].value) {
                case "Friend":
                    selectedType = "friends";
                    break;

                case "Enemy":
                    selectedType = 'enemies';
                    break;

                case "Likes":
                    selectedType = 'likes'
                    break;

                case "Acquaintance":
                    selectedType = 'acquaintances'
                    break;
            }

            graph.add_edge(clickedNode, nodeToConnect, COLORS[selectedType])
            nodeModal.style.display = 'none'
            update()

        }
        cdone.onclick = function () {
            graph.nodes[clickedNode].bcolor = nodeColorPicker.value;
            nodeModal.style.display = 'none'
            update()
        }
    }

}

let mouseDown;
let lastX, lastY;
let clickedNode;
canvas.onmousedown = function (e) {
    clickedNode = graph.mouseNode(e)
    if (e.button === 2 && clickedNode !== null) {
        mouseDown = true;

    } else {
    }
    let mx, my;
    [mx, my] = getMousePos(e);
    [lastX, lastY] = [mx, my];
}

canvas.onmouseup = function (e) {
    if (e.button === 2) {
        mouseDown = false;
        updateAll = true;
        update()
    }
}

canvas.onmousemove = function (e) {
    let hoveredNode = graph.mouseNode(e);
    if (hoveredNode && ! drawText) { // Don't show tooltips if we're already drawing the names
        ctx.fillStyle = '#ffffff'
        ctx.fillText(hoveredNode, graph.nodes[hoveredNode].x, graph.nodes[hoveredNode].y)
    }
    else {
        update();
        return;
    }


    if (mouseDown) {
        console.log('down')
        let [moveX, moveY] = getMousePos(e)
        graph.nodes[clickedNode].x += moveX - lastX;
        graph.nodes[clickedNode].y += moveY - lastY;
        if (physics) {
            let connectedNodes = graph.getConnectedNodes(clickedNode);
            for (let ccnode of connectedNodes) {
                let node = graph.nodes[ccnode]
                node.x += moveX - lastX;
                node.y += moveY - lastY;
                nodesToUpdate[ccnode] = graph.nodes[ccnode]

            }
        }
        lastX = moveX;
        lastY = moveY;
        nodesToUpdate = {clickedNode: graph.nodes[clickedNode]}

        edgesToUpdate = graph.edges.filter(x => x.includes(clickedNode))
        updateAll = false;
        console.log(nodesToUpdate, edgesToUpdate)
        update()
    }

}



window.addEventListener("contextmenu", e => e.preventDefault());
