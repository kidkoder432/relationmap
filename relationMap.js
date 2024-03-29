"use strict";
const COLORS = {likes: "#c849d1", friends: "#5bd149", enemies: "#ff3030", acquaintances: "#00b7ff"};
let canvas = document.getElementById("graph"), ctx = canvas.getContext("2d");
canvas.width = 9e3, canvas.height = 9e3, ctx.scale(3, 3);
let mouseDown, lastX, lastY, graph = new Network, updateAll = !0, doClear = !0, nodesToUpdate = {}, edgesToUpdate = [];

function update() {
    doClear && clearCanvas(), updateAll ? graph.show() : graph.show(nodesToUpdate, edgesToUpdate)
}

async function getF() {
    $.ajax({
        url: "relationships.jsonc", success: function (e) {
            let n = JSON.parse(e);
            graph.createFromJSON(n), update()
        }
    })
}

window.onload = update, getF(), canvas.onclick = function (e) {
    let n = graph.mouseNode(e), [o, a] = getMousePos(e);
    if (o = Math.round(o), a = Math.round(a), null === n) {
        let n = graph.mouseEdge(e);
        null === n ? (nameModal.style.display = "block", done.onclick = function () {
            nameModal.style.display = "none", nodeName = nameIn.value, graph.add_node(o, a, nodeName), update()
        }) : (edgeModal.style.display = "block", document.getElementById("ei").innerHTML = n, deleteB.onclick = function () {
            edgeModal.style.display = "none", graph.edges = remove(graph.edges, n), graph.prune()
        }, update(), edone.onclick = function () {
            let e;
            switch (edgeTypeIn.options[edgeTypeIn.selectedIndex].value) {
                case"Friend":
                    e = "friends";
                    break;
                case"Enemy":
                    e = "enemies";
                    break;
                case"Likes":
                    e = "likes";
                    break;
                case"Acquaintance":
                    e = "acquaintances"
            }
            graph.edges = remove(graph.edges, n), n[2] = COLORS[e], graph.edges.push(n), edgeModal.style.display = "none", graph.prune(), update()
        })
    } else {
        nodeColorPicker.value = graph.nodes[n].bcolor, connectNode.innerHTML = "";
        let e = remove(Object.keys(graph.nodes), n);
        for (let o of graph.edges) o[0] === n && (e = remove(e, o[1]));
        for (let n of e) {
            let e = document.createElement("option");
            e.text = n, e.value = n, connectNode.appendChild(e)
        }
        nodeModal.style.display = "block", document.getElementById("nn").innerHTML = n, deleteNode.onclick = function () {
            graph.delete_node(n), nodeModal.style.display = "none", update()
        }, ndone.onclick = function () {
            graph.nodes[n].bcolor = nodeColorPicker.value;
            let e, o = connectNode.options[connectNode.selectedIndex].value;
            switch (conTypeSelect.options[conTypeSelect.selectedIndex].value) {
                case"Friend":
                    e = "friends";
                    break;
                case"Enemy":
                    e = "enemies";
                    break;
                case"Likes":
                    e = "likes";
                    break;
                case"Acquaintance":
                    e = "acquaintances"
            }
            graph.add_edge(n, o, COLORS[e]), nodeModal.style.display = "none", update()
        }, cdone.onclick = function () {
            graph.nodes[n].bcolor = nodeColorPicker.value, nodeModal.style.display = "none", update()
        }
    }
}, canvas.onmousedown = function (e) {
    if (2 === e.button) {
        let n, o;
        mouseDown = !0, [n, o] = getMousePos(e), [lastX, lastY] = [n, o]
    }
}, canvas.onmouseup = function (e) {
    2 === e.button && (mouseDown = !1, updateAll = !0, update())
}, canvas.onmousemove = function (e) {
    let n = graph.mouseNode(e);
    if (n ? (ctx.fillStyle = "#ffffff", ctx.fillText(n, graph.nodes[n].x, graph.nodes[n].y)) : update(), mouseDown) {
        let [n, o] = getMousePos(e), a = graph.mouseNode(void 0, lastX, lastY);
        null === a || (graph.nodes[a].x += n - lastX, graph.nodes[a].y += o - lastY), lastX = n, lastY = o, nodesToUpdate = {clickedNode: graph.nodes[a]}, edgesToUpdate = graph.edges.filter(e => e.includes(a)), updateAll = !1, update()
    }
}, window.addEventListener("contextmenu", e => e.preventDefault());