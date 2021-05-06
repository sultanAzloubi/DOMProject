let canvas = document.querySelector(".canvas");
let context = canvas.getContext("2d");
let bodyElements = document.body;
let rootX = canvas.width/2, rootY = 50;
bodyElements.x = rootX,
bodyElements.y = rootY,
bodyElements.isCollapsed = false;

const collapseButtonPath = new Path2D()
let shapeType;

drawingRoot();

function drawingRoot(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Drawing the root node.
    context.beginPath();
    context.arc(rootX, rootY, 20, 0, Math.PI * 2, false);
    context.font = "12px sans-serif";
    context.fillText(document.body.tagName, rootX-17, rootY+5);
    context.stroke();
}

drawDom(rootX, rootY, bodyElements);
collapse(rootX, rootY);

function drawDom(newX, newY, bodyElements) {
    let axisY = newY + 100;
    let axisX = newX - (50 * bodyElements.childElementCount / 2);

    //if(bodyElements.isCollapsed === true) return;

    bodyElements = bodyElements.childNodes;

    for(let i = 0; i < bodyElements.length; i++) {
        //bodyElements[i].isCollapsed = false;
        if(bodyElements[i].nodeType === 1) {
            if(bodyElements[i].tagName === "CANVAS") continue;
            if(bodyElements[i].tagName === "SCRIPT") continue;

            // Assigning x and y to each node and pushing the nodes to an array.
            bodyElements[i].x = axisX;
            bodyElements[i].y = axisY;

            // Calling the drawing function based on the shape type, Circle for nodes.
            shapeType = "parentingElement";
            drawShape(axisX, axisY, newX, newY, bodyElements[i], shapeType);

            // Drawing the collapse shape.
            collapse(axisX, axisY);

            // if(bodyElements[i].isCollapsed){
            //     continue;
            // }

            // Recursive call to traverse the node children.
            if(bodyElements[i].childElementCount > 0) {
                drawDom(axisX, axisY, bodyElements[i]);
            }

            if(bodyElements[i].childElementCount < 1 && bodyElements[i].textContent.trim() !== "") {
                // Calling the drawing function based on the shape type, Square for texts.
                shapeType = "textualElement";
                drawShape(axisX, axisY, newX, newY, bodyElements[i], shapeType);
            }

            axisX += 125;
        }        
    }
}

function drawShape(childX, childY, parentX = 0, parentY = 0, DOMNode = null, shapeType) {
    if(shapeType === "parentingElement") {
        
        // Drawing the circle for the node.
        context.beginPath();
        context.arc(childX, childY, 20, 0, Math.PI * 2);
        if(DOMNode.tagName.length <= 3) context.fillText(DOMNode.tagName, childX-8, childY+5);
        else context.fillText(DOMNode.tagName, childX-17, childY+5);
        context.moveTo(parentX, parentY+20); // parent
        context.lineTo(childX, childY-20); // children
        context.stroke();        
    }
    
    if(shapeType === "textualElement") {
        let tempText = DOMNode.textContent.trim();

        context.beginPath();
        context.rect(childX-23, childY+45, 48, 25);
        context.moveTo(childX, childY+20); // parent
        context.lineTo(childX, childY+45); // children

        if(tempText.length <= 8) context.fillText(tempText, childX-16, childY+62);
        else context.fillText(tempText.substring(0, 4)+",,,", childX-16, childY+62);
    }
        
    context.stroke();
}

function collapse(x, y) {
    let collX = x -28, 
        collY = y - 15;
    collapseButtonPath.rect(collX, collY, 12, 5);
    context.fillStyle = 'red';
    context.fill(collapseButtonPath);
    context.stroke(collapseButtonPath);

    // Resetting the color of the drawing.
    context.fillStyle = 'black';    
}

function getXY(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const y = event.clientY - rect.top ;
    const x = event.clientX - rect.left ;
    return {x:x, y:y}
}

document.addEventListener("click", function (e) {
    const XY = getXY(canvas, e);
    let x = XY.x;
    let y = XY.y;

    if(context.isPointInPath(collapseButtonPath, x, y)) {
        let items = document.getElementsByTagName("*");
        for (var i = 0; i < items.length; i++) {
                if(items[i].x - 28 <= x && x <= items[i].x-28 + 12 && items[i].y - 15 <= y && y <= items[i].y - 15 + 5) {
                    console.log(items[i])

                    if(items[i].tagName === "BODY" && bodyElements.isCollapsed === false){
                        bodyElements.isCollapsed = true;
                        drawingRoot();
                        // collapse(x, y)
                    } else if(items[i].tagName === "BODY" && bodyElements.isCollapsed === true){
                        bodyElements.isCollapsed = false;   
                        drawingRoot();
                        drawDom(rootX, rootY, bodyElements);
                    }
                }
        }
    }
});