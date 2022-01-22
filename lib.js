'use strict';

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    return [evt.clientX - rect.left, evt.clientY - rect.top];
}

let remove = function (arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

/**
 * @param numOfSteps: Total number steps to get color, means total colors
 */

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {String}           The RGB representation
 */
function hslToRgb(h, s, l){
    let r, g, b;

    if(s === 0){
        r = g = b = l; // achromatic
    }else{
        let hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
}

function getColor(numOfSteps = 100) {
    let h = randint(0, numOfSteps) / 100
    let s = 0.6
    let l = 0.5
    return hslToRgb(h, s, l);
}

function textThreshold(bg) {
    let intColor = parseInt(bg.slice(1))
    let outColor;
    if (intColor < 0x3f3f3f) {
        outColor = 0x000000
    } else if (intColor < 0x7f7f7f && intColor > 0x3f3f3f) {
        outColor = 0xaaaaaa
    } else if (intColor > 0x7f7f7f && intColor < 0xafafaf) {
        outColor = 0x333333
    } else {
        outColor = 0x000000
    }
    return '#' + outColor.toString(16).padStart(6, '0');
}

function drawArrowhead(fromX, fromY, toX, toY) {
    let radius = 5;
    let x_center = toX;
    let y_center = toY;
    let angle;
    let x;
    let y;

    ctx.beginPath();

    angle = Math.atan2(toY - fromY, toX - fromX)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    ctx.moveTo(x, y);

    angle += (1.0 / 3.0) * (2 * Math.PI)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    ctx.lineTo(x, y);

    angle += (1.0 / 3.0) * (2 * Math.PI)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    ctx.lineTo(x, y);
    ctx.closePath()


}


function randint(min, max, step = 1) {
    return (Math.floor(Math.random() * (max - min)) + min) * step;
}

function fitTextOnCanvas(text, fontface, x, y) {

    // start with a large font size
    let fontsize = 300;

    // lower the font size until the text fits the canvas
    do {
        fontsize--;
        ctx.font = fontsize + "px " + fontface;
    } while (ctx.measureText(text).width > 45)

    // draw the text
    ctx.fillText(text, x, y);
}
