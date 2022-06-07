class Store {
  constructor(initalState = {}) {
    this._state = initalState
    this._stateCallbacks = [];
  }

  _throwStateCallBacks() {
    this._stateCallbacks.forEach((callback) => {
      callback(this._state);
    })
  }

  setStateCallback(callback) {
    this._stateCallbacks = [...this._stateCallbacks, callback];
  }

  setState(state) {
    if(!state instanceof Object) {
      throw new TypeError('State must be object');
    }
    
    this._state = { ...this._state, ...state };
    this._throwStateCallBacks();
  }

  get state() {
    return this._state;
  }
}