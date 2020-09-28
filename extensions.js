Object.assign(String.prototype, {
  repeatSpaced(times) {
    return `${this} `.repeat(times).trim();
  }
});

Object.assign(String.prototype, {
  toFirstLetterUpperCase() {
    return `${this}`.charAt(0).toUpperCase() + `${this}`.slice(1)
  }
});

Object.assign(Array.prototype, {
  distinct() {
    return [...new Set(this)];
  }
});