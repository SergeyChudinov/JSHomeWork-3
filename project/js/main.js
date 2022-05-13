const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

let getRequest = (url) => {
  return new Promise((resolve, reject) => { 
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          reject('Error');
        } else {
          resolve(xhr.responseText);
        }
      }       
    };
    xhr.send();
  });
};

class ProductList {
  constructor(container = '.products') {
    this.goods = []; // Неклассифициорванные объекты
    this.productObjects = []; // Класифицированные объекты
    this.container = document.querySelector(container);
    this.fetchGoods();
  }

  fetchGoods() {
    getRequest(`${API}/catalogData.json`)
      .then((data) => {
        this.goods = JSON.parse(data);
        console.log(this.goods);
        this.render();
      }, (err) => { 
        console.log(err);
      });
  }

  render() {
    for (const good of this.goods) {
      const productObject = new ProductItem(good);
      this.productObjects.push(productObject);
      console.log(this.productObjects);  // 0: ProductItem {id: 123, title: 'Ноутбук', price: 45600, img: 'https:', getHTMLString:
                                        // 1: ProductItem {id: 456, title: 'Мышка', price: 1000, img: 'https:, getHTMLString: ƒ}
      this.container.insertAdjacentHTML('beforeend', productObject.getHTMLString());

      console.log(document.querySelector(`.product-item[data-id="${productObject.id}"]`));
      document.querySelector(`.product-item[data-id="${productObject.id}"]`)   // Событие на кнопку buy-btn
        .addEventListener('click', event => {
          if (!event.target.closest('.buy-btn')) {
            return;
          }
          const featuredItemEl = event.target.closest('.product-item');
          console.log(featuredItemEl);
          const item = this.productObjects.find(item => item.id === +featuredItemEl.dataset.id);  
          console.log(item);  // ProductItem {id: 123, title: 'Ноутбук', price: 45600, img: 'https://', getHTMLString: ƒ}
          basket.addToCart(item);
        })
    }
  }
}

class ProductItem {
  constructor(product, img='https://via.placeholder.com/200x150') {
    this.id = product.id_product;
    this.title = product.product_name;
    this.price = +product.price;
    this.img = img;
  }

  getHTMLString = () => 
    `<div class="product-item" data-id="${this.id}" data-name="${this.title}" data-price="${this.price}">
      <img src="${this.img}" alt="Some img">
      <div class="desc">
          <h3>${this.title}</h3>
          <p>${this.price} \u20bd</p>
          <button class="buy-btn">Купить</button>
      </div>
    </div>`;
}

class BasketItem {
  constructor(product) {
    this.id = product.id_product;
    this.title = product.product_name;
    this.price = product.price;
    this.quantity = product.quantity;
  }
  
  getHtmlBasketString = () => 
     `<div class="basketRow" data-id="${this.id}">
        <div>${this.title}</div>
        <div>
          <span class="productCount">${this.quantity}</span> шт.
        </div>
        <div>$${this.price}</div>
        <div>
          $<span class="productTotalRow">${this.price}</span>
        </div>
        <div>
          <button class="clearTheProductList">Очистить</button>
        </div>
      </div>`
}

class Basket  {
  constructor(container = '.basket'){
    this.items = [];
    this.amount = 0;   // 46600
    this.countOfGoods = 0;  // 2
    this.container = document.querySelector(container);
    this.itemsContainer = document.querySelector('.basket-buy');
    this.totalContainer = document.querySelector('.basketTotalValue'); //Товаров в корзине на сумму: 0
    this.getItems();
  };

  getItems1 = () => {
    getRequest(`${API}/getBasket.json`)
      .then((data) => {
        const cartItems = JSON.parse(data);  // {amount: 46600, countGoods: 2, contents: Array(2)}
        this.items = cartItems.contents.map(item => new BasketItem(item));  // 0: BasketItem {id: 123, title: 'Ноутбук', price: 45600, quantity: 1, getHtmlBasketString: ƒ}
                                                                            // 1: BasketItem {id: 456, title: 'Мышка', price: 1000, quantity: 1, getHtmlBasketString: ƒ}
        this.amount = +cartItems.amount;
        this.countGoods = +cartItems.countGoods;
        this.items.forEach(item => this.itemsContainer.insertAdjacentHTML("beforeend", item.getHtmlBasketString()));
        this.totalContainer.textContent = this.amount; 
      },
    (err) => { console.error(err) })
  };
  getItems = () => {
    getRequest(`${API}/getBasket.json`)
      .then((data) => {
        const cartItems = JSON.parse(data);  // {amount: 46600, countGoods: 2, contents: Array(2)}
        console.log(cartItems.contents);      // 0: {id_product: 123, product_name: 'Ноутбук', price: 45600, quantity: 1}
        cartItems.contents                    // 1: {id_product: 456, product_name: 'Мышка', price: 1000, quantity: 1}
          .map(item => new BasketItem(item))       // BasketItem {id: 123, title: 'Ноутбук', price: 45600, quantity: 1, getHtmlBasketString: ƒ}
          .forEach(item => this.addToCart(item));  // BasketItem {id: 456, title: 'Мышка', price: 1000, quantity: 1, getHtmlBasketString: ƒ}
      },
    (err) => { console.error(err) })
  };
  
  addToCart = (newItem) => {
    getRequest(`${API}/addToBasket.json`)
      .then((data) => {
        const existingItem = this.items.find(item => item.id === newItem.id);
        console.log(existingItem);   // BasketItem {id: 123, title: 'Ноутбук', price: 45600, quantity: 1, getHtmlBasketString: ƒ}
        this.amount += newItem.price;
        this.countOfGoods++;
        this.totalContainer.innerHTML = +this.amount;

        if(existingItem) {
          existingItem.quantity++; 
          console.log(existingItem);  // BasketItem {id: 123, title: 'Ноутбук', price: 45600, quantity: 2, getHtmlBasketString: ƒ}
          const element = this.itemsContainer.querySelector(`.basketRow[data-id="${newItem.id}"]`);
          console.log(element);
          element.querySelector('span.productCount').innerHTML = +existingItem.quantity;
          element.querySelector('span.productTotalRow').innerHTML = +existingItem.price * +existingItem.quantity;
        } else {
          const item = new BasketItem({
            id_product: newItem.id,
            product_name: newItem.title,
            price: newItem.price,
            quantity: 1
          });
          this.items.push(item);
          console.log(item);  // BasketItem {id: 123, title: 'Ноутбук', price: 45600, quantity: 1, getHtmlBasketString: ƒ}
          this.itemsContainer.insertAdjacentHTML("beforeend", item.getHtmlBasketString());
          this.itemsContainer.querySelector(`.basketRow[data-id="${newItem.id}"] .clearTheProductList`)
            .addEventListener('click', () => this.clearOne(item))
        }
      })
  };

  clear = () => {
    getRequest(`${API}/deleteFromBasket.json`).then((data) => {
      this.items = [];
      this.amount = 0;
      this.itemsContainer.innerHTML = '';
      this.totalContainer.textContent = 0;
    })
  };

  clearOne = (newItem) => {
    this.items = this.items.filter(item => newItem.id !== item.id);
    this.itemsContainer.querySelector(`.basketRow[data-id="${newItem.id}"]`).remove();
    this.amount -= newItem.price * newItem.quantity;
    this.container.querySelector('span.basketTotalValue').innerHTML = this.amount;
    this.countOfGoods -= newItem.quantity;
  }
}

let productList = new ProductList();
let basket = new Basket();

const basketEl = document.querySelector('.basket'); // наш див с товарами
const basketBuy = document.querySelector('.basket-buy');
/**
 * Обработчик открытия корзины при клике на ее значок.
 */
document.querySelector('.btn-cart').addEventListener('click', () => {
  basketEl.classList.toggle('hidden');
});

document.querySelector('.clearTheList').addEventListener('click', () => {
  basket.clear();
});
