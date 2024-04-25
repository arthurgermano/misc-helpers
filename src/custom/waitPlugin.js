class WaitPlugin {
  
  constructor() {
    this.waitList = {};
  }

  // ----------------------------------------------------------------------------------------------

  finishWait(name, isSuccessful = true, returnParam) {
    try {
      if (!this.waitList[name]) {
        return false;
      }
      if (isSuccessful) {
        return this.waitList[name].resolve(returnParam || true);
      }
      return this.waitList[name].reject(returnParam || false);
    } catch (error) {
      return error;
    } finally {
      if (this.waitList[name]) {
        delete this.waitList[name];
      }
    }
  }

  // ----------------------------------------------------------------------------------------------

  startWait(name) {
    if (this.waitList[name]) {
      return;
    }
    this.waitList[name] = {};
    this.waitList[name].promise = new Promise((resolve, reject) => {
      this.waitList[name].resolve = resolve;
      this.waitList[name].reject = reject;
    });
    return this.waitList[name].promise;
  }

  // ----------------------------------------------------------------------------------------------

  finishAll(isSuccessful, returnParam) {
    for (let key in this.waitList) {
      this.finishWait(key, isSuccessful, returnParam);
    }
  }

  // ----------------------------------------------------------------------------------------------
}

// ------------------------------------------------------------------------------------------------

const WP = new WaitPlugin();

// ------------------------------------------------------------------------------------------------

module.exports = WP;

// ------------------------------------------------------------------------------------------------