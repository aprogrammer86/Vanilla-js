import { printToConsole, getCategories, updateCategories, handleAjaxJson, makeTable, getCategoriesApi, insertToTable, makeButton, makeCategory, makeInputText, addCategory } from "../shared.js";

const editCategoryApi = 'http://localhost:5028/api/category';
const addCategoryApi = 'http://localhost:5028/api/category';
const deleteCategoryApi = 'http://localhost:5028/api/category';


export const injectContent3 = (main) => {
    const divEl = document.createElement('div');
    const text = document.createTextNode('Category Page');
    divEl.appendChild(text);

    const categoryTable = makeTable(['Id', 'Title', 'Edit'], 'category-table');
    const categoryForm = makeForm();

    main.appendChild(divEl);
    main.appendChild(categoryTable);
    main.appendChild(categoryForm);

    handleAjaxJson('GET', getCategoriesApi, onCategories);
}

const makeCategoryRow = (category) => {
    const trEl = document.createElement('tr');
    trEl.id = `category-tr-${category.id}`;

    for (const [key, value] of Object.entries(category)) {
        const tdEl = document.createElement('td');
        tdEl.setAttribute('name', key);

        const text = document.createTextNode(value);
        tdEl.appendChild(text);

        trEl.appendChild(tdEl);
    }

    const editBtn = makeButton(category['id'], 'Edit', 'button', 'click', onEditCategory);
    const tdEl = document.createElement('td');
    tdEl.setAttribute('name', 'edit');
    tdEl.appendChild(editBtn);

    trEl.appendChild(tdEl);

    return trEl;
}

const createCategoryTable = (categories) => {
    const tbody = document.querySelector(`#category-table`);
    tbody.innerHTML = '';

    categories.forEach(item => {
        const trEl = makeCategoryRow(item);
        insertToTable(trEl, 'category-table');
    });
}

const onCategories = (input) => {
    updateCategories(input.categories);

    const ctgs = getCategories();
    printToConsole('onCategories');
    printToConsole(ctgs);

    createCategoryTable(ctgs);
}

const onEditCategory = (e) => {
    const id = e.target.id;
    printToConsole(id);

    const url = `${getCategoriesApi}/${id}`;
    handleAjaxJson('GET', url, makeEditableCategory, id);
}

const makeEditableCategory = (category) => {
    printToConsole(category);

    const trEl = document.querySelector(`#category-tr-${category.id}`);
    const trElBack = trEl.cloneNode(true);

    const tdTitle = trEl.querySelector('[name=title]');

    // printToConsole(tdTitle);
    // printToConsole(tdEdit);

    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'text');
    inputEl.setAttribute('value', tdTitle.textContent);
    inputEl.setAttribute('name', 'title');

    tdTitle.innerHTML = '';
    tdTitle.appendChild(inputEl);

    const btnSaveEl = makeButton(category['id'], 'Save', 'button', 'click', () => saveCategoryEdit(category.id, trEl));
    const btnDeleteEl = makeButton(category['id'], 'Delete', 'button', 'click', () => deleteCategory(category.id, trEl));
    const btnCancelEl = makeButton(category['id'], 'Cancel', 'button', 'click', () => replaceRow(trEl, trElBack));

    const tdEdit = trEl.querySelector('[name=edit]');
    tdEdit.innerHTML = '';
    tdEdit.appendChild(btnSaveEl);
    tdEdit.appendChild(btnDeleteEl);
    tdEdit.appendChild(btnCancelEl);

}

const replaceRow = (trEl, trElBack) => {
    trEl.replaceWith(trElBack);
    trElBack.querySelector('button').addEventListener('click', onEditCategory);
}

const saveCategoryEdit = (id, trEl) => {
    const title = trEl.querySelector('input[name=title]').value;
    const category = makeCategory(id, title);


    handleAjaxJson('PUT', editCategoryApi, () => onCategoryUpdated(category, trEl), category);
}


const onCategoryUpdated = (category, trEl) => {
    printToConsole('onCategoryUpdated');

    const trElUpdated = makeCategoryRow(category);
    trEl.replaceWith(trElUpdated);
}

const makeForm = () => {
    const formEL = document.createElement('form');
    formEL.id = 'category-form';

    const inputTitle = makeInputText('title', 'Title');

    const submitBtn = makeButton('add-category', 'Add', 'submit');
    const btnContainer = document.createElement('div');
    btnContainer.appendChild(submitBtn);

    formEL.appendChild(inputTitle);
    formEL.appendChild(btnContainer);

    formEL.addEventListener('submit', (e) => {
        e.preventDefault();

        printToConsole('category-form-submit');
        const result = e.target.elements;

        const title = e.target.elements.title.value;

        printToConsole(title);

        const category = makeCategory(0, title);
        handleAjaxJson('POST', addCategoryApi, onCategoryAdded, category);
    })

    return formEL;
}

const onCategoryAdded = (added) => {
    printToConsole(added)
    addCategory(added);


    createCategoryTable(getCategories());
    // const trEl = makeCategoryRow(addedCategory);
    // insertToTable(trEl, 'category-table');
}

const deleteCategory = (id, trEl) => {
    handleAjaxJson('DELETE', deleteCategoryApi, () => { trEl.parentElement.removeChild(trEl) }, id);
}