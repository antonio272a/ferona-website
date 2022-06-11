class Store {
  constructor(initalState = {}) {
    this._state = initalState
    this._stateCallback = async () => {};
  }

  setStateCallback(callback) {
    this._stateCallback = callback;
  }

  setState = async (state) => {
    if(!state instanceof Object) {
      throw new TypeError('State must be object');
    }
    
    this._state = { ...this._state, ...state };
    await this._stateCallback();
  }

  get state() {
    return this._state;
  }
}