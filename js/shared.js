export const getCategoriesApi = 'http://localhost:5028/api/category';

let loadedCategories = [];

export const getCategories = () => [...loadedCategories];
export const updateCategories = (input) => loadedCategories = [...input];
export const addCategory = (input) => {
    if (!existCategory(input)) {
        loadedCategories.push(input);
    }
}

export const existCategory = (input) => loadedCategories.find(item => item.title.toLowerCase() === input.title.toLowerCase());

export const handleAjaxJson = (method, url, callback, data) => {
    printToConsole("handleAjaxJson");
    let xHttp = new XMLHttpRequest();

    xHttp.onreadystatechange = function () {
        printToConsole(this);
        if (this.status === 200 && this.readyState === 4) {
            callback(JSON.parse(this.responseText));
        }

        else if (this.status === 201 && this.readyState === 4) {
            callback(JSON.parse(this.responseText));
        }

        else if (this.status === 204 && this.readyState === 4) {
            callback();
        }
    }

    xHttp.open(method, url, true);
    xHttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xHttp.send(JSON.stringify(data));
}


export const makeTable = (headerTitlesArray, id) => {
    const tblContainer = document.createElement('div');
    tblContainer.classList.add('table-container');

    const productTable = document.createElement('table');
    productTable.classList.add('table');

    const productTableHead = document.createElement('thead');

    const productTableBody = document.createElement('tbody');
    productTableBody.id = id;

    const productTableHeadRow = document.createElement('tr');

    productTableHead.appendChild(productTableHeadRow);
    productTable.appendChild(productTableHead);
    productTable.appendChild(productTableBody);
    tblContainer.appendChild(productTable);

    headerTitlesArray.forEach(item => {
        const thEl = document.createElement('th');
        const text = document.createTextNode(item);
        thEl.appendChild(text);
        productTableHeadRow.appendChild(thEl);
    })

    return tblContainer;

}


export const insertToTable = (row, tableId) => {
    const tbody = document.querySelector(`#${tableId}`);
    tbody.appendChild(row);
}



export const makeButton = (id, name, btnType, eventType, callback) => {
    // printToConsole(`makeButton`);
    const button = document.createElement('button');

    button.type = btnType;
    button.id = id;
    button.classList.add('btn');

    const buttonText = document.createTextNode(name);
    button.appendChild(buttonText);

    if (eventType === undefined)
        eventType = 'click';

    if (callback !== undefined)
        button.addEventListener(eventType, callback);

    return button;
}

export const removeRow = (trEl) => {
    trEl.parentElement.removeChild(trEl);
}


export const makeCategory = (id, title) => {
    return { id: id, title: title }
}

export const makeInputText = (name, placeholer) => {
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.name = name;
    inputEl.placeholder = placeholer;

    return inputEl;
}

export const printToConsole = (input) => {
    console.log(input);
}