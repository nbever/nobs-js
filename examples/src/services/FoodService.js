import isUndefined from 'lodash/isUndefined';

class FoodService {

  pickAFood() {
    const index = parseInt(Math.random() * 5);
    return this.foodOptions[index];
  }

  get foodOptions() {
    if (isUndefined(this._foodOptions)) {
      this._foodOptions = [
        'Burger and Fries',
        'Sushi',
        'Okonomiyaki',
        'Sandwich',
        'Green beans'
      ];
    }

    return this._foodOptions;
  }
}

export default FoodService;
