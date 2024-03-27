import {Dict} from "./constants";

export class DragNDrop {
  draggableItemWrappers: HTMLElement[];
  dropZones: HTMLElement[];
  elementList: Dict;

  constructor() {
    this.draggableItemWrappers = Array.from(
        document.querySelectorAll<HTMLElement>(
            `.${'draggable-item-wrapper'}`));
    this.dropZones = Array.from(document.querySelectorAll<HTMLElement>(
        `.${'dropzone'}`));
    this.elementList = {};
    this.eventsOnDrag()
  }

  searchById(id: string) {
    return this.dropZones.reduce((acc, element) => {
      return (acc === null && element.querySelector(`#${id}`) !== null)
          ? element
          : acc;
    }, null);
  }

  getElementFromId(id: string) {
    if (this.elementList[id] === false) {
        return document.getElementById(id);
    }
    // If element already exits in the dropdowns then if tried to copy past from the external div
    // then the element from the dropdown will move i.e. will not be copied from the external div.
    else if (this.elementList[`n${id}`] === false) {
        return document.getElementById(`n${id}`);
    }
    // If id value has true in the elementList that means no dropdown has that element, that means,
    // that element should be copy pasted rather than drag and drop.
    else {
      return this.createElementFromId(id);
    }
  }

  createElementFromId(id: string) {
    const element = document.createElement('div');
    const parentEl = element.parentNode as HTMLElement;
    const new_id = `n${id}`;

    this.elementList[new_id] = false;
    element.id = new_id;
    element.setAttribute('draggable', 'true');
    element.className = 'item-container';
    element.innerHTML = document.getElementById(id).innerHTML;

    const draggableEl = element.querySelector<HTMLElement>('.draggable');
    draggableEl.classList.remove('border-2');

    element.addEventListener('dragstart', event => {
      event.dataTransfer.setData("text/plain", element.id);
      parentEl.classList.remove('border-2');
      draggableEl.classList.add('border-2', 'border-gray');
      draggableEl.style.padding = "7px";

      setTimeout(() => {
        parentEl.classList.add('border-2');
        draggableEl.classList.remove('border-2');
        draggableEl.style.padding = '';
        element.className = 'd-none';
      }, 0);
    });

    return element;
  }

  eventsOnDrag() {
    this.draggableItemWrappers.map(draggableEl => {
      draggableEl.addEventListener('dragstart', event => {
        event.dataTransfer.setData("text/plain", (event.target as HTMLElement).id);
      });
    });
      
    this.dropZones.map(dropZoneEl => {
      dropZoneEl.addEventListener('dragover', event => event.preventDefault());
    
      dropZoneEl.addEventListener('drop', event => {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");

        if (data !== "") {
          const container = dropZoneEl.querySelector('.item-container')
          
          if (container !== null) {
            if (container.id !== data) {
              const replaceElement = this.searchById(data);

              if (replaceElement !== null) {
                replaceElement.appendChild(container);
              } else return;
            }
          }
          dropZoneEl.appendChild(this.getElementFromId(data));
        }
      });
    
      dropZoneEl.addEventListener('dragend', () => {
        dropZoneEl.querySelector('.d-none').className = 'item-container'
      });
    });
  }
}