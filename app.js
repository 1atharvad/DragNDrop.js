var elementList = {};
var images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img1.jpg', 'img2.jpg', 'img3.jpg', 'img1.jpg', 'img2.jpg', 'img3.jpg', 'img1.jpg', 'img2.jpg', 'img3.jpg'];
const grid = {
    1: [25],
    2: [13, 12],
    3: [9, 8, 8],
    4: [7, 7, 6, 5],
    5: [6, 6, 5, 4, 4],
    6: [5, 5, 4, 4, 3, 3],
    7: [5, 5, 4, 4, 3, 3, 2],
    8: [4, 4, 4, 3, 3, 3, 2, 2],
    9: [4, 4, 3, 3, 3, 2, 2, 2, 2],
    10: [4, 3, 3, 3, 2 ,2, 2, 2, 2, 2]
};

function createDropList(total) {
    const dropzone = document.querySelector('.dropzone');
    for (var i=0; i<total; i++) {
        document.querySelector('#dropzone-list').innerHTML += dropzone.outerHTML;
        document.querySelector('#dropzone-list').lastElementChild.removeAttribute('id');
    }
} 

function createDraggableList(images) {
    const dragItems = document.querySelector('#draggable-0');
    for (var i=0; i<images.length; i++) {
        document.querySelector('#draggable-items').innerHTML += dragItems.outerHTML.replace('draggable-0', `draggable-${i+1}`);
        document.querySelector(`#draggable-${i+1} img`).src = `images/${images[i]}`;
    }
} 

function init() {
    var dropables = 10;

    createDropList(dropables);
    createDraggableList(images);
}

function dragNdrop() {
    document.querySelectorAll("#draggable-items > div").forEach(element => {
        element.addEventListener('dragstart', ev => {
            ev.dataTransfer.setData("text/plain", ev.target.id);
        });
    });
    
    document.querySelectorAll("#dropzone-list > div").forEach(element => {
        element.addEventListener('dragover', ev => ev.preventDefault());

        /*element.addEventListener('dragenter', ev => {
            console.log("enter", ev.target, element)
            if (ev.target === element) {
                if (element.querySelector('.empty-zone') !== null) {
                    element.querySelector('.empty-zone').remove();
                }
            }
        });

        element.addEventListener('dragleave', ev => {
            console.log("leave", ev.target)
            if (element.querySelector('.empty-zone') === null) {
                element.innerHTML += document.querySelector('#dropzone-0').innerHTML;
            }
        });*/
    
        element.addEventListener('drop', ev => {
            const data = ev.dataTransfer.getData("text/plain");
    
            ev.preventDefault();
            if (data !== "") {
                console.log(element.querySelector('.item-container'))
                const container = element.querySelector('.item-container')
                if (container !== null) {
                    if (container.id !== data) {
                        const replaceElement = searchById(data);
                        if (replaceElement !== null) {
                            replaceElement.appendChild(container);
                        } else {
                            return;
                        }
                    }
                }
                element.appendChild(getElementFromId(data));
                setTimeout(() => updateQuantity(), 0);
            }
        });
    
        element.addEventListener('dragend', () => {
            element.querySelector('.d-none').className = 'item-container'
            element.querySelector('.d-none').className = 'quantity';
            setTimeout(() => updateQuantity(), 0);
        });
    });
}

function searchById(id) {
    return [...document.querySelectorAll("#dropzone-list > div")].reduce(function(acc, element) {
        if (acc === null) {
            if (element.querySelector(`#${id}`) !== null) {
                return element;
            }
        }
        return acc;
    }, null);
}

function getElementFromId(id) {
    if (elementList[id] === false) {
        return document.getElementById(id);
    }
    // If element already exits in the dropdowns then if tried to copy past from the external div
    // then the element from the dropdown will move i.e. will not be copied from the external div.
    else if (elementList[`n${id}`] === false) {
        return document.getElementById(`n${id}`);
    }
    // If id value has true in the elementList that means no dropdown has that element, that means,
    // that element should be copy pasted rather than drag and drop.
    else {
        return createElementFromId(id);
    }
}

function createElementFromId(id) {
    var element = document.createElement('div');
    var new_id = `n${id}`;

    elementList[new_id] = false;
    element.id = new_id;
    element.setAttribute("draggable", true);
    element.className = "item-container";
    element.innerHTML = document.getElementById(id).innerHTML;
    element.querySelector('.draggable').classList.remove('border-2');
    element.addEventListener('dragstart', function(ev) {
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.parentNode.classList.remove('border-2');
        this.querySelector('.quantity').className = 'd-none';
        this.querySelector('.draggable').classList.add('border-2');
        this.querySelector('.draggable').classList.add('border-gray');
        this.querySelector('.draggable').style.padding = "7px";
        setTimeout(() => {
            this.parentNode.classList.add('border-2');
            element.querySelector('.draggable').classList.remove('border-2');
            this.querySelector('.draggable').style.padding = "";
            this.className = "d-none";
        }, 0);
    });
    return element;
}

function updateQuantity() {
    var index = 0;
    document.querySelectorAll('#dropzone-list > div:not(#dropzone-0)').forEach(element => {
        if (element.querySelector('.quantity') !== null) {
            var quantity = grid[Object.keys(elementList).length][index];
            element.querySelector('.quantity').innerHTML = `x${quantity}`;
            if (element.querySelector('.quantity').classList.length === 2) {
                element.querySelector('.quantity').className = element.querySelector('.quantity').className.replace(
                    (quantity < 10) ? 'd-digit' : 's-digit',
                    (quantity < 10) ? 's-digit' : 'd-digit'
                );
            } else {
                element.querySelector('.quantity').classList.add((quantity < 10) ? 's-digit' : 'd-digit');
            }
            index += 1;
        }
    });
}

function getSelectedList() {
    list = {};
    document.querySelectorAll('#dropzone-list > div').forEach(element => {
        if (element.querySelector('img') !== null) {
            list[images.indexOf(element.querySelector('img').src.split('images/')[1]) + 1] = parseInt(element.querySelector('.quantity').innerHTML.replace('x', ''));
        }
    });
    for (var i in images) {
        if (list[parseInt(i)+1] === undefined) {
            list[parseInt(i)+1] = 0;
        }
    }
    return list;
}

init();
dragNdrop();