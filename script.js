let draggedObject = null;
let isHoldingAlt = false;

let lastX = 0;
let lastY = 0;

let lastNode = null;

let panContext = panzoom(document.getElementById("viewport"), {
    zoomDoubleClickSpeed: 1, // disables double click zoom
    beforeMouseDown: (_event) => {
        return !isHoldingAlt;
    }
});

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

function getNumber(node, attributeName) {
    return Number(node.getAttribute(attributeName));
}

class Link {
    constructor(firstNode, secondNode, connectedSvg) {
        this.firstNode = firstNode;
        this.secondNode = secondNode;
        this.connectedSvg = connectedSvg;
    }

    recalculate() {
        let first = new Rect(
            getNumber(this.firstNode, "x"),
            getNumber(this.firstNode, "y"),
            getNumber(this.firstNode, "width"),
            getNumber(this.firstNode, "height"),
        );

        let second = new Rect(
            getNumber(this.secondNode, "x"),
            getNumber(this.secondNode, "y"),
            getNumber(this.secondNode, "width"),
            getNumber(this.secondNode, "height"),
        );

        let c1p1 = new Point(first.x + first.width, first.y); // curve 1, point 1
        let c1p4 = new Point(second.x, second.y); // curve 1, point 4
        let c1p2 = new Point((c1p1.x + c1p4.x) / 2, first.y); // curve 1, point 2
        let c1p3 = new Point((c1p1.x + c1p4.x) / 2, second.y); // curve 1, point 3

        let curve1 = `M ${c1p1.x} ${c1p1.y} C ${c1p2.x} ${c1p2.y} ${c1p3.x} ${c1p3.y} ${c1p4.x} ${c1p4.y}`;

        let c2p1 = new Point(c1p4.x, second.y); // curve 2, point 1
        let c2p4 = new Point(first.x + first.width, first.y + first.height); // curve 2, point 4
        let c2p2 = new Point((c2p1.x + c2p4.x) / 2, second.y + second.height); // curve 2, point 2
        let c2p3 = new Point((c2p1.x + c2p4.x) / 2, first.y + first.height); // curve 2, point 3

        let curve2 = `C ${c2p2.x} ${c2p2.y} ${c2p3.x} ${c2p3.y} ${c2p4.x} ${c2p4.y}`;

        this.connectedSvg.setAttribute("d", `${curve1} V ${second.y + second.height} ${curve2} V ${first.y}`);
    }
}

window.addEventListener("keydown", (event) => {
    if (event.repeat) { return }

    if (event.key == "Alt") {
        isHoldingAlt = true;
        document.getElementById("container").classList.add("move");
    }
});

window.addEventListener("keyup", (event) => {
    if (event.repeat) { return }

    if (event.key == "Alt") {
        isHoldingAlt = false;
        document.getElementById("container").classList.remove("move");
    }
});

window.addEventListener("keypress", (event) => {
    if (event.code === "KeyN") {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        rect.setAttribute("class", "machine");

        rect.setAttribute("width", "50");
        rect.setAttribute("height", "200");
        rect.setAttribute("x", "50");
        rect.setAttribute("y", "50");

        rect.onmousedown = (event) => {
            if (!isHoldingAlt && event.buttons === 1) {
                draggedObject = rect;

                lastX = event.screenX;
                lastY = event.screenY;
            }
        }

        rect.leftLink = null;
        rect.rightLink = null;

        if (lastNode !== null) {
            let linkSvg = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            linkSvg.setAttribute("class", "link");

            let link = new Link(lastNode, rect, linkSvg);

            lastNode.rightLink = link;
            rect.leftLink = link;

            link.recalculate();

            document.getElementById("viewport").appendChild(linkSvg);
        }

        lastNode = rect;

        document.getElementById("viewport").appendChild(rect);
    }
});

window.onmouseup = (event) => {
    draggedObject = null;

    lastX = 0;
    lastY = 0;
}

window.onmousemove = (event) => {
    if (draggedObject != null) {
        let oldX = Number(draggedObject.getAttribute("x"));
        let oldY = Number(draggedObject.getAttribute("y"));

        let zoomScale = panContext.getTransform().scale;

        draggedObject.setAttribute('x', oldX + (event.screenX - lastX) / zoomScale);
        draggedObject.setAttribute('y', oldY + (event.screenY - lastY) / zoomScale);

        if (draggedObject.leftLink !== null) {
            draggedObject.leftLink.recalculate();
        }
        if (draggedObject.rightLink !== null) {
            draggedObject.rightLink.recalculate();
        }

        lastX = event.screenX;
        lastY = event.screenY;
    }
}
