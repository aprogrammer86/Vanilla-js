import { printToConsole, getCategories, updateCategories, handleAjaxJson, makeTable, insertToTable, makeButton, removeRow, makeCategory, getCategoriesApi, makeInputText } from '../shared.js';


const addProductApi = 'http://localhost:5028/api/product';
const editProductApi = 'http://localhost:5028/api/product';
const deleteProductApi = 'http://localhost:5028/api/product';
const getProductsApi = 'http://localhost:5028/api/product';
const getProductByIdApi = 'http://localhost:5028/api/product';




const makeProduct = (id, name, description, categories) => {
    return {
        id: id,
        name: name,
        description: description,
        categories: [...categories]
    }
}

const replaceRow = (trEl, trElBack) => {
    printToConsole(`undoRow`);
    trEl.replaceWith(trElBack);

    trElBack.querySelector('button').addEventListener('click', onEditProduct);
}

const productUpdated = (product, trEl) => {
    printToConsole('UPDATED');
    const trElUpdated = makeReadonlyRow(product);
    replaceRow(trEl, trElUpdated);
}

const saveProductEdit = (id, trEl) => {
    printToConsole('saveEdit')
    const cbxList = [];
    const textList = [];
    const inputList = trEl.querySelectorAll('input');

    inputList.forEach(item => item.getAttribute('type') === 'checkbox' ? cbxList.push(item) : textList.push(item));
    const list = getCheckedCheckbox(cbxList);
    const product = makeProduct(id, textList[0].value, textList[1].value, list);
    printToConsole(product)

    handleAjaxJson('PUT', editProductApi, () => productUpdated(product, trEl), product);
}

const deleteProduct = (id, trEl) => {
    printToConsole(`deleteProduct: ${id}`);
    handleAjaxJson('DELETE', deleteProductApi, () => removeRow(trEl), id);
}

const makeEditableRow = (product) => {
    printToConsole('makeEditableRow');
    printToConsole(product);

    const trEl = document.querySelector(`#tr-${product.id}`);

    const trElBack = trEl.cloneNode(true);

    printToConsole(trEl.children)
    const tds = [...trEl.children];

    for (let index = 1; index < tds.length - 1; index++) {
        const item = tds[index];

        const nameAttr = item.getAttribute('name');
        const value = product[nameAttr];

        if (value === undefined) {
            printToConsole(`Value: ${value}`);
            continue;
        }
        else
            printToConsole(`${nameAttr}: ${value}`);

        if (nameAttr !== 'categories') {
            const inputEl = document.createElement('input');
            inputEl.setAttribute('type', 'text');
            inputEl.setAttribute('value', value);
            inputEl.setAttribute('name', nameAttr);
            item.innerHTML = '';
            item.appendChild(inputEl);
        }
        else {
            const list = makeCategoryCheckbox(value);
            item.innerHTML = '';
            list.forEach(cb => item.appendChild(cb));
        }

    }

    const btnSaveEl = makeButton(product['id'], 'Save', 'button', 'click', () => saveProductEdit(product.id, trEl));
    const btnDeleteEl = makeButton(product['id'], 'Delete', 'button', 'click', () => deleteProduct(product.id, trEl));
    const btnCancelEl = makeButton(product['id'], 'Cancel', 'button', 'click', () => replaceRow(trEl, trElBack));

    const tdEdit = tds[tds.length - 1];
    tdEdit.innerHTML = '';
    tdEdit.appendChild(btnSaveEl);
    tdEdit.appendChild(btnDeleteEl);
    tdEdit.appendChild(btnCancelEl);


}

const onEditProduct = (e) => {
    const id = e.target.id;
    printToConsole(`onEditProduct: ${id}`);

    const productUrl = `${getProductByIdApi}/${id}`;
    printToConsole(productUrl);
    handleAjaxJson('GET', productUrl, makeEditableRow, id);

}

const makeReadonlyRow = (product) => {
    // printToConsole(product);

    product['categories'] = product['categories'].map(item => item.title).toString();

    const trEl = document.createElement('tr');
    trEl.setAttribute('id', `tr-${product['id']}`);

    for (const [key, value] of Object.entries(product)) {
        const tdEl = document.createElement('td');
        tdEl.setAttribute('name', key);

        const text = document.createTextNode(value);

        tdEl.appendChild(text);
        trEl.appendChild(tdEl);
    }

    const btnEl = makeButton(product['id'], 'Edit', 'button', 'click', onEditProduct);
    const tdEl = document.createElement('td');
    tdEl.appendChild(btnEl);
    trEl.append(tdEl);

    return trEl;
}

const productAdded = (response) => {
    printToConsole(response);

    const trEl = makeReadonlyRow(makeProduct(response.id, response.name, response.description, response.categories));
    insertToTable(trEl, 'product-table');
}

const getCheckedCheckbox = (cbxList) => {
    const checkedCbx = [];

    cbxList.forEach(item => {
        if (item.checked)
            checkedCbx.push(makeCategory(item.id, item.name));
    });

    return checkedCbx;
}

const makeCategoryCheckbox = (checkedList) => {
    printToConsole('makeCategoryCheckbox');
    const categories = getCategories();

    if (categories === null)
        return;

    let list = [];
    for (let i = 0; i < categories.length; i++) {
        const item = categories[i];

        const inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'checkbox');
        inputEl.setAttribute('name', item.title);
        inputEl.setAttribute('id', item.id);

        if (checkedList !== undefined && checkedList.find(c => c.id === item.id) !== undefined) {
            inputEl.checked = true;
        }

        const labelEl = document.createElement('label');
        const textNode = document.createTextNode(item.title);
        labelEl.appendChild(inputEl);
        labelEl.appendChild(textNode);

        list[i] = labelEl;
    }
    printToConsole(list);

    return list;
}

const onRecieveCategories = (input) => {
    printToConsole("onRecieveCategories");

    updateCategories(input.categories);

    const list = makeCategoryCheckbox();

    const categoriesElement = document.querySelector("#add-product-categories");
    categoriesElement.innerHTML = '';
    list.forEach(el => {
        categoriesElement.appendChild(el);
    });

}

const makeTableRows = (products) => {
    products.forEach(item => {
        const trEl = makeReadonlyRow(item);
        insertToTable(trEl, 'product-table');
    });
}

const makeForm = () => {
    const formEl = document.createElement('form');
    formEl.id = 'product-form';

    const nameInput = makeInputText('name', 'Name');
    const descInput = makeInputText('description', 'Description');

    const catgContainer = document.createElement('span');
    catgContainer.id = 'add-product-categories';

    const submitBtn = makeButton('add-product', 'Add', 'submit');
    const btnContainer = document.createElement('div');
    btnContainer.appendChild(submitBtn);


    formEl.appendChild(nameInput);
    formEl.appendChild(descInput);
    formEl.appendChild(catgContainer);
    formEl.appendChild(btnContainer);

    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        const result = e.target.elements;
        printToConsole(e);

        const list = getCheckedCheckbox(e.target.querySelectorAll('input[type=checkbox]'));

        printToConsole(list);

        const product = makeProduct(0, result.name.value, result.description.value, list);
        printToConsole(product);
        handleAjaxJson('POST', addProductApi, productAdded, product);
    });

    return formEl;
}

const loadProducts = (products) => {
    makeTableRows(products);
    makeForm();
}

export const injectContent = (main) => {
    printToConsole('injectContent');

    const productTable = makeTable(['Id', 'Name', 'Description', 'Categories', 'Edit'], 'product-table');
    const form = makeForm();

    main.appendChild(productTable);
    main.appendChild(form);

    handleAjaxJson('GET', getCategoriesApi, onRecieveCategories);
    handleAjaxJson('GET', getProductsApi, loadProducts);

}