// inspired from discord.js
export default class Collection<KEY, VALUE> extends Map<KEY, VALUE> {
  /** Searches for a single item where the given function returns a truthy value*/
  find(func: (v: VALUE, k: KEY, collection: this) => boolean): VALUE | null {
    for (const [k, v] of this) {
      if (func(v, k, this)) return v;
    }
    return null;
  }
  /** Searches for the key of a single item where the given function returns a truthy value*/
  findKey(func: (v: VALUE, k: KEY, collection: this) => boolean): KEY | null {
    for (const [k, v] of this) {
      if (func(v, k, this)) return k;
    }
    return null;
  }
  /** Sorts the items of a collection in place and returns it. */
  sort(compareFunction = Collection.defaultSort) {
    const entries = [...this.entries()];
    entries.sort((a, b) => compareFunction(a[0], b[0]));
    super.clear();
    for (const [key, value] of entries) super.set(key, value);
    return this;
  }
  /** Maps each item to another value into a collection. Identical in behavior to */
  map<T>(func: (value: VALUE, key: KEY, collection: this) => T): T[] {
    const iter = this.entries();
    return Array.from({ length: this.size }, () => {
      const [key, value] = iter.next().value;
      return func(value, key, this);
    });
  }
  /** Default sort compareFunction. */
  static defaultSort<KEY>(firstKey: KEY, secondKey: KEY) {
    return Number(firstKey > secondKey) || Number(firstKey === secondKey) - 1;
  }
}
