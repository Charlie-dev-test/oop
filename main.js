const SALAD = [
  {'name': 'Цезарь', 'price': 100, 'ccal': 20, 'val': 'caesar'},
  {'name': 'Оливье', 'price': 50, 'ccal': 80, 'val': 'olivie'}
];

const DRINKS = [
  {'name': 'Кола', 'price': 50, 'ccal': 40, 'val': 'coke'},
  {'name': 'Кофе', 'price': 80, 'ccal': 20, 'val': 'cofe'}
];

const BURGER_SIZES = [
  {'name': 'Маленький', 'price': 50, 'ccal': 20, 'val': 'Small'},
  {'name': 'Большой', 'price': 100, 'ccal':40, 'val': 'Big'}
];

const BURGER_FILLES = [
  {'name': 'с сыром', 'price': 10, 'ccal': 20, 'val': 'Cheese'},
  {'name': 'с салатом', 'price': 20, 'ccal': 5, 'val': 'Salad'},
  {'name': 'с картошкой', 'price': 15, 'ccal': 10, 'val': 'Potato'}
]

class Order {
  
  constructor(){
    this.cost = 0;
    this.ccal = 0;
    this.order = [];
    this.$cost = document.getElementById('cost');
    this.$calory = document.getElementById('calory');
    this.$list = document.getElementById('list');
  }

  addItem(item){
    if(Object.isFrozen(this)){
      return false;
    }
    this.cost += item.cost;
    this.ccal += item.ccal;
    let unique = this.order.some((el) => {
      return el.code === item.code
    })
    if(!unique){
      this.order.push(item);
      let $itemRow = `
      <div class="orders__row">
        <div id="${item.code}-quantity" class="orders__quantity">1</div>
        <div class="orders__type">${item.name}</div>
        <div> <span id="${item.code}" class="close">&times;</span></div>
      </div>
      `;
      this.$list.insertAdjacentHTML('beforeEnd', $itemRow);
      document.getElementById(`${item.code}`).addEventListener('click', this.deleteItem.bind(this))
    }else{
      this.order.forEach((el) => {
        if(el.code === item.code){
          el.quantity++;
          document.getElementById(`${el.code}-quantity`).innerHTML = el.quantity;
        }
      })
    }
    this.refresh();
  }

  refresh(){
    this.$cost.innerHTML = this.cost;
    this.$calory.innerHTML = this.ccal;
  }

  deleteItem(){
    if(Object.isFrozen(this)){
      return false;
    }
    let id = event.target.getAttribute('id');
    this.order.forEach((el) => {
      if(el.code === id){
        if(el.quantity > 1){
          el.quantity--;
          this.cost -= el.cost;
          this.ccal -= el.ccal;
          document.getElementById(`${el.code}-quantity`).innerHTML = el.quantity;
          this.refresh();
        }else{
          this.cost -= el.cost;
          this.ccal -= el.ccal;
          this.refresh();
          this.order = this.order.filter(el => {
            return el.code !== id;
          })
          event.target.parentNode.parentNode.remove();
        }
      }
    })
  }
}

class Item {

  constructor(options, selector) {
    this.items = options;
    this.$selector = document.getElementById(selector);
    this._setDomSelect();
  }

  _setDomSelect(){
    this.items.forEach(el => {
      let $opt = `<option value="${el.val}">${el.name}</option>`
      this.$selector.insertAdjacentHTML('afterBegin', $opt);
    });
  }

  setToOrder(){
    let newItem = {};
    this.items.forEach(el =>{
      if(el.val === this.$selector.value){
        newItem.ccal = el.ccal;
        newItem.cost = el.price;
        newItem.name = el.name;
        newItem.code = el.val;
        newItem.quantity = 1;
      }
    })
    return newItem;
  }
}

class BurgerItem extends Item {

  constructor(size, filles, sizeSelector, fillesSelector){
    super(size, sizeSelector)
    this.filles = filles;
    this.$fillesSelector = document.getElementById(fillesSelector)
    this._setDomFillSelect()
  }

  _setDomFillSelect(){
    this.filles.forEach(el => {
      let $opt = `<option value="${el.val}">${el.name}</option>`
      this.$fillesSelector.insertAdjacentHTML('afterBegin', $opt);
    });
  }

  setToOrder(){
    let newItem = {}
    this.items.forEach(el =>{
      if(el.val === this.$selector.value){
        newItem.ccal = el.ccal;
        newItem.cost = el.price;
        newItem.name = el.name;
        newItem.code = el.val;
        newItem.quantity = 1;
      }
    })
    this.filles.forEach(el =>{
      if(el.val === this.$fillesSelector.value){
        newItem.ccal += el.ccal;
        newItem.cost += el.price;
        newItem.name = `${newItem.name} бургер ${el.name}`;
        newItem.code += el.val;
      }
    })
    return newItem;
  }

}

window.addEventListener('DOMContentLoaded', () => {
  const salad = new Item(SALAD, 'salad');
  const drinks = new Item(DRINKS, 'drinks');
  const burger = new BurgerItem(BURGER_SIZES, BURGER_FILLES, 'size', 'filles');
  const order = new Order();
  const $btnSalad = document.getElementById('salad-btn');
  $btnSalad.addEventListener('click', () => {
    order.addItem(salad.setToOrder())
  });
  const $btnDrinks = document.getElementById('drinks-btn');
  $btnDrinks.addEventListener('click', () => {
    order.addItem(drinks.setToOrder());
  });
  const $btnBurger = document.getElementById('burger-btn');
  $btnBurger.addEventListener('click', () => {
    order.addItem(burger.setToOrder());
  })
  const $purchase = document.getElementById('purchase');
  $purchase.addEventListener('click', function(){
    if(Object.isFrozen(order)){
      alert('Чтобы сделать еще один заказ обновите страницу');
    }else{
      if(order.order.length > 0){
        Object.freeze(order);
        alert('Ваш заказ принят');
      }else{
        alert('Выберите блюда!')
      }
    }
  });
});