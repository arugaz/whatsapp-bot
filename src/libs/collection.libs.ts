// inspired from discord.js
export default class Collection<KEY, VALUE> extends Map<KEY, VALUE> {
  find(func: (v: VALUE, k: KEY, collection: this) => boolean): VALUE | null {
    for (const [k, v] of this) {
      if (func(v, k, this)) return v;
    }
    return null;
  }
}
