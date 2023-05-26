const notifyWrapper = document.querySelector('.notify')

let storage = JSON.parse(localStorage.getItem('goods')) ?? []

const createTemplate = (data) => {
    let template = ''
    data.forEach((item) => {
        template += `
            <div class="content__item" data-index="${item.id}">
                <div class="content__background">
                    <img src="${item.img}" alt="" class="content__img" >
                    <div class="content__overlay" data-index="${item.id}"><img src="img/cart-plus.svg" alt="" srcset="" data-index="${item.id}"></div>
                </div>
                <p class="content__name">${item.name}</p>
                <span class="content__price">$<span class="content__price_qty">${item.price}</span></span>
            </div>`
    })
    return template
}

const getGoods = (e, goods) => {
    let currGoods = e.target.dataset.index
    if (currGoods == undefined) return;
    storage.push(goods[currGoods])
    notify(goods[currGoods])
    localStorage.setItem('goods', JSON.stringify(storage))
    sortObj()
}

const notify = (item) => {
    notifyWrapper.style.display = 'block'
    notifyWrapper.style.opacity = '0.9'
    let template = ''
    template += `
        <div class="notify__window">
            <h3>Added to cart</h3>
            <div class="good">
                <img src="${item.img}" alt="" class="good__img">
                <div class="good__info">
                    <h4 class="good__title">${item.name}</h4>
                    <span class="good__price">$${item.price}</span>
                </div>
            </div>
            <button class="notify__close">X</button>
        </div>`
    notifyWrapper.innerHTML = template

    document.querySelector('.notify__close').addEventListener('click', () => {
        notifyWrapper.style.display = 'none'
    })
}
