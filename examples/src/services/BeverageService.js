class BeverageService {

  constructor() {
    this._beverages = [
      'Oban 14yr.',
      'Glenmorangie Quinta Ruben',
      'Springbank 10yr',
      'The Macallan 25yr.'
    ];
  }

  pickAScotch() {
    const index = parseInt(Math.random() * 4);
    return this._beverages[index];
  }
}

export default BeverageService;
