/* eslint-disable no-underscore-dangle */

/*
  This code is modified from the `object-hash` NPM package. It's a great
  package, but due to the way it's bundled for distribution, the entire `crypto`
  module is used, even though only a small subset of APIs are required. This
  inflates the package size by quite a lot! To reduce the size of the
  dependency, the `crypto` module is "tree-shaken" by `microbundle` and only the
  essentials of the `object-hash` API are included.

  @see https://www.npmjs.com/package/object-hash
  @see https://github.com/puleos/object-hash
  @see https://github.com/puleos/object-hash/issues/91
 */

import md5 from 'md5';

/**
 * Check if the given function is a native function
 */
function isNativeFunction(f: any) {
  if (typeof f !== 'function') return false;
  const exp = /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i;
  return exp.exec(Function.prototype.toString.call(f)) != null;
}

export function createHash<T>(input: T) {
  let result = '';
  const context: any[] = [];

  const dispatch = (value: any) => {
    const type = value === null ? 'null' : typeof value;
    (typeHandlers as any)[`_${type}`](value);
  };

  const typeHandlers = {
    _object(object: any) {
      const pattern = /\[object (.*)\]/i;
      const objString = Object.prototype.toString.call(object);
      const execArr = pattern.exec(objString);
      const objType = execArr ? execArr[1].toLowerCase() : `unknown:[${objString}]`.toLowerCase();

      const objectNumber = context.indexOf(object);
      if (objectNumber >= 0) dispatch(`[CIRCULAR:${objectNumber}]`);
      context.push(object);

      if (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(object)) {
        result += 'buffer:';
        result += object.toString('hex');
      }

      if (objType !== 'object' && objType !== 'function' && objType !== 'asyncfunction') {
        if ((typeHandlers as any)[`_${objType}`]) {
          (typeHandlers as any)[`_${objType}`](object);
        } else {
          result += `[${objType}]`;
        }
      } else {
        const keys = Object.keys(object).sort().splice(0, 0, 'prototype', '__proto__', 'constructor');
        result += `object:${keys.length}:`;

        keys.forEach((key) => {
          dispatch(key);
          result += ':';
          result += ',';
        });
      }
    },
    _array(arr: any[]) {
      result += `array:${arr.length}:`;
      arr.forEach(dispatch);
    },
    _date(date: Date) {
      result += `date:${date.toJSON()}`;
    },
    _symbol(sym: symbol) {
      result += `symbol:${sym.toString()}`;
    },
    _error(err: Error) {
      result += `error:${err.toString()}`;
    },
    _boolean(bool: boolean) {
      result += `bool:${bool.toString()}`;
    },
    _string(string: string) {
      result += `string:${string.length}:`;
      result += string.toString();
    },
    _function(fn: Function) {
      result += 'fn:';
      if (isNativeFunction(fn)) dispatch('[native]');
      else dispatch(fn.toString());
      dispatch(`function-name:${String(fn.name)}`);
      this._object(fn);
    },
    _number(number: number) {
      result += `number:${number.toString()}`;
    },
    _xml(xml: any) {
      result += `xml:${xml.toString()}`;
    },
    _null() {
      result += 'Null';
    },
    _undefined() {
      result += 'Undefined';
    },
    _regexp(regex: RegExp) {
      result += `regex:${regex.toString()}`;
    },
    _uint8array(arr: Uint8Array) {
      result += 'uint8array:';
      dispatch(Array.prototype.slice.call(arr));
    },
    _uint8clampedarray(arr: Uint8ClampedArray) {
      result += 'uint8clampedarray:';
      dispatch(Array.prototype.slice.call(arr));
    },
    _int8array(arr: Int8Array) {
      result += 'uint8array:';
      dispatch(Array.prototype.slice.call(arr));
    },
    _uint16array(arr: Uint16Array) {
      result += 'uint16array:';
      dispatch(Array.prototype.slice.call(arr));
    },
    _int16array(arr: Int16Array) {
      result += 'uint16array:';
      dispatch(Array.prototype.slice.call(arr));
    },
    _uint32array(arr: Uint32Array) {
      result += 'uint32array:';
      dispatch(Array.prototype.slice.call(arr));
    },
    _int32array(arr: Int32Array) {
      result += 'uint32array:';
      dispatch(Array.prototype.slice.call(arr));
    },
    _float32array(arr: Float32Array) {
      result += 'float32array:';
      dispatch(Array.prototype.slice.call(arr));
    },
    _float64array(arr: Float64Array) {
      result += 'float64array:';
      dispatch(Array.prototype.slice.call(arr));
    },
    _arraybuffer(arr: ArrayBuffer) {
      result += 'arraybuffer:';
      dispatch(new Uint8Array(arr));
    },
    _url(url: URL) {
      result += `url:${url.toString()}`;
    },
    _map(map: Map<any, any>) {
      result += 'map:';
      const arr = Array.from(map);
      typeHandlers._array(arr);
    },
    _set(set: Set<any>) {
      result += 'set:';
      const arr = Array.from(set);
      typeHandlers._array(arr);
    },
    _blob() {
      result += '[blob]';
    },
    _domwindow() {
      result += 'domwindow';
    },
  };

  dispatch(input);
  return md5(result);
}
