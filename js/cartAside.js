const cartBtn = document.querySelector('#cart')
const modal = document.querySelector('.modal')
const modalClose = document.querySelector('.modal__close')
const cartNum = document.querySelector('.cart-num')
const modalContent = document.querySelector('.modal__content')
const body = document.querySelector('body')
const total = document.querySelector('.modal__total_qty')
const done = document.querySelector('.done')
const overlay = document.querySelector('.modal__overlay')

const createCartTemplate = (data) => {
    let template = ''
    data.forEach((item) => {
        template += `
        <div class="good" data-id="${item.id}">
        <img src="${item.img}" alt="" class="good__img">
        <div class="good__info">
            <h4 class="good__title">${item.name}</h4>
            <span class="good__price">$${item.price}</span>
            <button class="good__remove" data-remove="${item.id}">remove</button>
        </div>
        <div class="good__count">
            <button class="good__up" data-add="${item.id}">⇧</button>
            <span class="good__qty">${item.count}</span>
            <button class="good__down" data-delete="${item.id}">⇩</button>
        </div>
    </div>`
    })
    return template
}

cartBtn.addEventListener('click', () => {
    modal.style.display = 'block'
    body.style.overflow = 'hidden'
    getPostCart()
    notifyWrapper.style.display = 'none'
})

const sortObj = () => {
    let newArr
    JSON.parse(localStorage.getItem('goods')).forEach((item) => {
        newArr = JSON.parse(localStorage.getItem('cart')) ?? []
        const index = newArr.findIndex((t) => (
            t.name === item.name
        ));
        if (index === -1) {
            newArr.push({ ...item, count: 1 });
        } else {
            newArr[index].count++;
        }
    });
    localStorage.removeItem('goods')
    localStorage.setItem('cart', JSON.stringify(newArr))
    qtyGoods()
}

const closeModalWindow = () => {
    modal.style.display = 'none'
    body.style.overflow = 'visible'
}

modalClose.addEventListener('click', closeModalWindow)

const qtyGoods = () => {
    if (localStorage.getItem('cart')) {
        let cartQty = 0
        cartNum.style.display = 'block'
        JSON.parse(localStorage.getItem('cart')).forEach(item => {
            cartQty += item.count
        })
        if (cartQty === 0) cartNum.style.display = 'none'
        cartNum.innerHTML = cartQty
    }
    else {
        cartNum.style.display = 'none'
    }
}

qtyGoods()

const getPostCart = () => {
    modalContent.innerHTML = ""
    let totalPrice = 0
    if (localStorage.getItem('cart')) {
        modalContent.innerHTML += createCartTemplate(JSON.parse(localStorage.getItem('cart')))
        JSON.parse(localStorage.getItem('cart')).forEach(item => {
            const price = item.count * item.price
            totalPrice += price
        })
    }
    total.innerHTML = totalPrice.toFixed(2)
}

modalContent.addEventListener('click', e => {
    addQty(e)
    deleteQty(e)
    removeItem(e)
})

const removeItem = e => {
    const currGood = e.target.dataset.remove
    if (currGood === undefined) return
    const arr = [...modalContent.children]
    arr.forEach(item => {
        if (item.dataset.id === currGood) {
            const newArr = JSON.parse(localStorage.getItem('cart'))
            const index = newArr.findIndex(obj => obj.id == currGood);
            newArr.splice(index, 1)
            localStorage.setItem('cart', JSON.stringify(newArr))
            getPostCart()
            qtyGoods()
        }
    })
}

const addQty = e => {
    const currGood = e.target.dataset.add
    if (currGood === undefined) return
    const arr = [...modalContent.children]
    arr.forEach(item => {
        if (item.dataset.id === currGood) {
            const newArr = JSON.parse(localStorage.getItem('cart'))
            const index = newArr.findIndex(obj => obj.id == currGood);
            newArr[index].count += 1
            localStorage.setItem('cart', JSON.stringify(newArr))
            getPostCart()
            qtyGoods()
        }
    })
}

const deleteQty = e => {
    const currGood = e.target.dataset.delete
    if (currGood === undefined) return
    const arr = [...modalContent.children]
    arr.forEach(item => {
        if (item.dataset.id === currGood) {
            const newArr = JSON.parse(localStorage.getItem('cart'))
            const index = newArr.findIndex(obj => obj.id == currGood);
            newArr[index].count -= 1
            if (newArr[index].count === 0) {
                newArr.splice(index, 1)
            }
            localStorage.setItem('cart', JSON.stringify(newArr))
            getPostCart()
            qtyGoods()
        }
    })
}


overlay.addEventListener('click', closeModalWindow)
