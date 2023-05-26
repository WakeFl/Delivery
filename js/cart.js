const dataContainer = document.querySelector('.cart__content')
const total = document.querySelector('.cart__total_qty')
const cartInfo = document.querySelector('.cart-info')
const userName = document.querySelector('input[name="name"]');
const userEmail = document.querySelector('input[name="email"]');
const userPhone = document.querySelector('input[name="phone"]');
const userAddress = document.querySelector('input[name="address"]');
const done = document.querySelector('.done');
const cross = document.querySelector('.cross');

const createCartTemplate = (data) => {
    let template = ''
    data.forEach((item) => {
        template += `
        <div class="meal" data-id="${item.id}">
        <img src="${item.img}" alt="" class="meal__img">
        <div class="meal__info">
            <h3 class="meal__title">${item.name}</h3>
            <span class="meal__price">$${item.price}</span>
            <button class="meal__remove" data-remove="${item.id}">remove</button>
        </div>
        <div class="meal__count">
            <button class="meal__up" data-add="${item.id}">⇧</button>
            <span class="meal__qty">${item.count}</span>
            <button class="meal__down" data-delete="${item.id}">⇩</button>
        </div>
    </div>`
    })
    return template
}

const getPostCart = () => {
    dataContainer.innerHTML = ""
    let totalPrice = 0
    if (localStorage.getItem('cart')) {
        dataContainer.innerHTML += createCartTemplate(JSON.parse(localStorage.getItem('cart')))
        JSON.parse(localStorage.getItem('cart')).forEach(item => {
            const price = item.count * item.price
            totalPrice += price
        })
    }
    total.innerHTML = totalPrice.toFixed(2)
    if (dataContainer.innerHTML === '') dataContainer.innerHTML = '<h3>Empty</h3>'
}

dataContainer.addEventListener('click', e => {
    addQty(e)
    deleteQty(e)
    removeItem(e)
})

const removeItem = e => {
    const currmeal = e.target.dataset.remove
    if (currmeal === undefined) return
    const arr = [...dataContainer.children]
    arr.forEach(item => {
        if (item.dataset.id === currmeal) {
            const newArr = JSON.parse(localStorage.getItem('cart'))
            const index = newArr.findIndex(obj => obj.id == currmeal);
            newArr.splice(index, 1)
            localStorage.setItem('cart', JSON.stringify(newArr))
            getPostCart()
        }
    })
}

const addQty = e => {
    const currmeal = e.target.dataset.add
    if (currmeal === undefined) return
    const arr = [...dataContainer.children]
    arr.forEach(item => {
        if (item.dataset.id === currmeal) {
            const newArr = JSON.parse(localStorage.getItem('cart'))
            const index = newArr.findIndex(obj => obj.id == currmeal);
            newArr[index].count += 1
            localStorage.setItem('cart', JSON.stringify(newArr))
            getPostCart()
        }
    })
}

const deleteQty = e => {
    const currmeal = e.target.dataset.delete
    if (currmeal === undefined) return
    const arr = [...dataContainer.children]
    arr.forEach(item => {
        if (item.dataset.id === currmeal) {
            const newArr = JSON.parse(localStorage.getItem('cart'))
            const index = newArr.findIndex(obj => obj.id == currmeal);
            newArr[index].count -= 1
            if (newArr[index].count === 0) {
                newArr.splice(index, 1)
            }
            localStorage.setItem('cart', JSON.stringify(newArr))
            getPostCart()
        }
    })
}

const createOrder = () => {
    return {
        name: userName.value,
        email: userEmail.value,
        phone: userPhone.value,
        address: userAddress.value,
        order: JSON.parse(localStorage.getItem('cart')),
        totalPrice: total.innerHTML,
        date: new Date().toLocaleString(),
    }
}

const clearData = () => {
    userName.value = ''
    userEmail.value = ''
    userPhone.value = ''
    userAddress.value = ''
    localStorage.removeItem('cart');
}

cartInfo.addEventListener('submit', e => {
    e.preventDefault()
    if (localStorage.getItem('cart')) {
        fetch('https://delivery-app-c64ab-default-rtdb.firebaseio.com/orders.json', {
            method: 'POST',
            body: JSON.stringify(createOrder())
        })
            .then(response => {
                if (response.ok) {
                    done.style.opacity = '1'
                    setTimeout(() => {
                        done.style.opacity = '0'
                    }, 2000)
                    clearData()
                    getPostCart()
                }
                else {
                    cross.style.opacity = '1'
                    setTimeout(() => {
                        cross.style.opacity = '0'
                    }, 2000)
                }
            })
    }
    else {
        alert('Cart is empty')
    }
})

getPostCart()


