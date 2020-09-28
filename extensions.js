Object.assign(String.prototype, {
  toFirstLetterUpperCase() {
    return `${this}`.charAt(0).toUpperCase() + `${this}`.slice(1)
  }
});