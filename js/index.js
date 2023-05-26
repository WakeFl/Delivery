const priceRange = document.querySelector('.search__range')
const priceNumber = document.querySelector('#price')
const company = document.querySelector('.search__producer')
const nameInput = document.querySelector('.search__input')
const content = document.querySelector('.products')

let myData;
let filteredObject;

fetch('https://delivery-app-c64ab-default-rtdb.firebaseio.com/goods.json')
    .then(res => {
        return res.json()
    })
    .then(data => {
        postGoodsProducts(data)
    })
    .catch(err => new Error(err))

const postGoodsProducts = (myJson) => {
    myData = myJson
    filteredObject = myJson
    searchProductByName(myData)
    getPrices(myData)
    content.innerHTML = createTemplate(myData)
    content.addEventListener('click', (e) => {
        getGoods(e, myData)
    })
}

const getPrices = (data) => {
    if (data.length === 0) {
        priceRange.min = 0
        priceNumber.innerHTML = priceRange.value = priceRange.max = 0
    }
    else {
        const prices = data.map(item => item = item.price)
        priceRange.min = Math.round(Math.min(...prices))
        priceNumber.innerHTML = priceRange.value = priceRange.max = Math.round(Math.max(...prices))
        priceRange.addEventListener('input', () => {
            filterPrices(data)
        })
    }
}

const filterPrices = (myData) => {
    filteredObject = myData.filter(obj => obj.price <= priceRange.value);
    priceNumber.innerHTML = priceRange.value
    content.innerHTML = createTemplate(filteredObject)
}



const getCompany = (e) => {
    let currCompany = e.target.dataset.company
    const arr = [...company.children]
    arr.forEach(item => {
        if (currCompany == undefined) return;
        item.classList.remove('active')
        if (item.dataset.company === currCompany) {
            filterCompany(currCompany)
            searchProductByName(filterCompany(currCompany))
            item.classList.add('active')
            nameInput.value = ''
        }
        else if (currCompany === 'All') {
            filteredObject = myData
            content.innerHTML = createTemplate(filteredObject)
            getPrices(filteredObject)
            searchProductByName(filteredObject)
            nameInput.value = ''
        }
    })
}


const filterCompany = (currCompany) => {
    filteredObject = myData.filter(obj => obj.company === currCompany);
    content.innerHTML = createTemplate(filteredObject)
    getPrices(filteredObject)
    return filteredObject
}

company.addEventListener('click', getCompany)

const searchProductByName = (myData) => {
    nameInput.addEventListener('input', () => {
        content.innerHTML = createTemplate(filterProductByName(myData, nameInput.value))
    })
}

const filterProductByName = (myData, productName) => {
    filteredObject = myData.filter((obj) => {
        return obj.name.toLowerCase().includes(productName.toLowerCase());
    });
    getPrices(filteredObject)
    return filteredObject
};



