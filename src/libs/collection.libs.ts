// inspired from discord.js
export default class Collection<KEY, VALUE> extends Map<KEY, VALUE> {
  find(func: (v: VALUE, k: KEY, collection: this) => boolean): VALUE | null {
    for (const [k, v] of this) {
      if (func(v, k, this)) return v;
    }
    return null;
  }
  sort(compareFunction = Collection.defaultSort) {
    const entries = [...this.entries()];
    entries.sort((a, b) => compareFunction(a[1], b[1]));
    super.clear();
    for (const [key, value] of entries) super.set(key, value);
    return this;
  }
  static defaultSort<VALUE>(firstValue: VALUE, secondValue: VALUE) {
    return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
  }
}
