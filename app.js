// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const grocery = document.getElementById('grocery')
const form = document.querySelector('.grocery-form')
const submitBtn = document.querySelector('.submit-btn')
const groceryContainer = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editFlag = false
let editId = ''
let editElement;
// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem)
clearBtn.addEventListener('click', clearItems)
// ****** FUNCTIONS **********
function addItem(e)
{
  e.preventDefault()

  const id = new Date().getTime()
  const value = grocery.value

  if(value && !editFlag)
  {
    const element = document.createElement('article')
    element.classList.add('grocery-item')
    const attr = document.createAttribute('data-id')
    attr.value = id
    element.setAttributeNode(attr)

    
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
    <button class="edit-btn" type="button">
    <i class="fas fa-edit"></i>
    </button>
    <button class="delete-btn" type="button">
    <i class="fas fa-trash"></i>
    </button>
    </div>`
            const deleteBtn = element.querySelector('.delete-btn')
            const editBtn = element.querySelector('.edit-btn')
            
            deleteBtn.addEventListener('click', deleteItem)
            editBtn.addEventListener('click', editItem)
            list.appendChild(element)
            displayAlert('Item has been added to the list', 'success')
            groceryContainer.classList.add('show-container')
            addToLocalStorage(id, value)
            setBackToDefault()
  }
  else if(value && editFlag)
  {
    editElement.firstChild.innerText = value
    displayAlert('Item has been edited', 'success')
    editFromLocalStorage(editId, value)
    setBackToDefault()
  }
  else
  {
    displayAlert('Please enter some value.', 'danger')
  }
}
// ****** display alert
function displayAlert(msg, action)
{
  alert.innerText = msg
  alert.classList.add(`alert-${action}`)

  setTimeout(() => {
    alert.innerText = ''
    alert.classList.remove(`alert-${action}`)
  }, 800)
}

// edit item
function editItem(e)
{
  submitBtn.innerText = 'edit'
  editId = e.currentTarget.parentElement.parentElement.dataset.id
  editElement = e.currentTarget.parentElement.parentElement
  const editableItemValue = e.currentTarget.parentElement.parentElement.firstChild.innerText
  editFlag = true
  grocery.value = editableItemValue.toLowerCase()
}
// delete item
function deleteItem(e)
{
  const deletableItem = e.currentTarget.parentElement.parentElement;
  const dId = e.currentTarget.parentElement.parentElement.dataset.id
  list.removeChild(deletableItem)
  displayAlert('Item has been removed', 'danger')
  if(list.children.length === 0)
  {
    groceryContainer.classList.remove('show-container')
  }

  removeFromLocalStorage(dId)
}
// clear all items
function clearItems()
{
  const items = document.querySelectorAll('.grocery-item')

  items.forEach((item) => {
    list.removeChild(item)
  })
  groceryContainer.classList.remove('show-container')
  displayAlert('empty list', 'danger')
  localStorage.removeItem('list')
}
// ****** set back to default
function setBackToDefault()
{
  grocery.value = ''
  submitBtn.innerText = 'submit'
  editFlag = false
}

// ****** LOCAL STORAGE **********
// get local storage
function getLocalStorage()
{
  return  localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):[]
}

// add to local storage
function addToLocalStorage(id, value)
{
  const grocery = {
    id: id,
    value: value,
  }
  let items = getLocalStorage()

  items.push(grocery)
  localStorage.setItem('list', JSON.stringify(items))
}
// remove from local storage
function removeFromLocalStorage(id)
{
  let items = getLocalStorage()
  console.log(items);

  items = items.filter((item) => {
    if(item.id != id)
    {
      return item
    }
  })

  localStorage.setItem('list', JSON.stringify(items))
}

// edit from local storage
function editFromLocalStorage(id, value)
{
  let items = getLocalStorage('list')

  items = items.map((item) => {
    if(item.id == id)
    {
      item.value = value
    }

    return item
  })

  localStorage.setItem('list', JSON.stringify(items))
}
// ****** SETUP ITEMS **********
window.addEventListener('DOMContentLoaded', () => {
  const condition = getLocalStorage().length
  const items = getLocalStorage()
  if(condition != 0)
  {
    items.forEach((item) => {
        const element = document.createElement('article')
        element.classList.add('grocery-item')
        const attr = document.createAttribute('data-id')
        attr.value = item.id
        element.setAttributeNode(attr)

        element.innerHTML = `<p class="title">${item.value}</p>
        <div class="btn-container">
        <button class="edit-btn" type="button">
        <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" type="button">
        <i class="fas fa-trash"></i>
        </button>
        </div>`
        const deleteBtn = element.querySelector('.delete-btn')
        const editBtn = element.querySelector('.edit-btn')
            
        deleteBtn.addEventListener('click', deleteItem)
        editBtn.addEventListener('click', editItem)
        list.appendChild(element)
        displayAlert('Saved items', 'success')
        groceryContainer.classList.add('show-container')
    })
  }
  else
  {
    displayAlert('')
  }
})