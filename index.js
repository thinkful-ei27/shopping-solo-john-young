'use strict';

/* global $ */

const STATE = {
  STORE: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  checkedItems: 'all',
  filteredTerm: '',
  filtered: function() {
    return Object.values(STATE.STORE)
      .filter(values => values.name === this.filteredTerm)
      .reduce((obj, values) => {
        let arr = [];
        obj = values;
        arr.push(obj);
        return arr;
      }, []);
  }
};

const {STORE} = STATE;
let {checkedItems} = STATE;

function handleCheckedBoxTicked() {
  $('#checkbox').on('click', function(e) {
    let checkboxState = $(e.target).prop('checked');
    if (checkboxState) {
      checkedItems = 'remaining';
    } else {
      checkedItems = 'all';
    }
    renderShoppingList();
  });
}

function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}" contenteditable="true">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  let remaining = shoppingList.filter(item => item.checked === false);
  let answer = [];

  if (checkedItems === 'remaining') {
    answer = remaining;
  } else {
    answer = shoppingList;
  }

  const items = answer.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteClickedItem(itemIndex) {
  console.log('Deleting item at index ' + itemIndex);
  delete STORE[itemIndex];
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteClickedItem(itemIndex);
    renderShoppingList();
  });
}

function handleSearchBoxEntry() {
  $('.js-shopping-list-entry').on('input', function(e) {
    let enteredValue = $(e.target).val().toLowerCase();
    STATE.filteredTerm = enteredValue;
    console.log(STATE.filteredTerm);
    // return enteredValue;
    return searchFilter();
  });
}

function searchFilter(searchTerm) {
  $('.js-search-button').on('click', function(e) {
    e.preventDefault();
    renderSearchList();
  })

}

function renderSearchList() {
  // render the shopping list in the DOM on search
  console.log('`renderSearchList` ran');
  const searchedList = STATE.filtered();
  const shoppingListItemsString = generateShoppingItemsString(searchedList);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function modifyItemName(priorName, newName) {
  return STORE[priorName].name = newName;
}

function bindEditableSpan() {
  $('span').bind('dblclick', function() {
    $(this).attr('contentEditable', true);
  }).blur(function() {
    $(this).attr('contentEditable', false);
  });
}

function clickToChangeName() {
  $('.js-shopping-item').on('blur', function(e) {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    let changedText = $(e.target).text();
    console.log('click to change is working', changedText, itemIndex);
    modifyItemName(itemIndex, changedText);
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleCheckedBoxTicked();
  handleSearchBoxEntry();
  searchFilter();
  clickToChangeName();
  bindEditableSpan();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);