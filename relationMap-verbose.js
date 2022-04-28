'use strict';



const COLORS = {
    "likes": "#c849d1",
    "friends": '#5bd149',
    "enemies": '#ff3030',
    "acquaintances": '#00b7ff'

} // Edge colors, change these as you wish, but modify other settings accordingly (i.e. colors on key)


let canvas = document.getElementById('graph');
let ctx = canvas.getContext('2d');
canvas.width = 9000; // Control the size of the canvas on-screen
canvas.height = 9000;
ctx.scale(3, 3) // Set scale to (canvas.width / canvas.style.width, canvas.hiehgt / canvas.style.height). Used for sharpening
ctx.font = '10px Roboto Mono'

let graph = new Network();
let updateAll = true; // Should we update all the nodes / edges?
let nodesToUpdate = {} // Add nodes or edges in these objects to only update (and draw) selected parts)
let edgesToUpdate = []
let drawText = false; // Don't draw labels by default to improve performance
let physics = false;

function update() {
    clearCanvas()

    if (updateAll) {
        graph.show();
    }
    else {
        graph.show(nodesToUpdate, edgesToUpdate)
    }
}

console.log('init done')
console.log('data fed successfully')
window.onload = update
console.log('draw done')
async function getF() {
    $.ajax({
        url: 'relationships.jsonc',
        success: function (data) {
            console.log('Data:', data)
            let connections = JSON.parse(data);
            graph.createFromJSON(connections)
            arrange()
            update()

        }
    });
}
// Comment for local tests (file access violates CORS policy)
getF();

// Uncomment for local tests
// let connections = {"Shannon Zhou": {"friends": ["Sebastian Tsai", "Branden Wang", "Cindy Lu", "Kaitlyn Tran", "Thomas Ton", "Anh Nguyen"],       
// graph.createFromJSON(connections)
// arrange()
// update()
