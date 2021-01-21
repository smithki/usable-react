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

import { createHash as nodeCreateHash, Hash } from 'crypto';

/** Check if the given function is a native function */
function isNativeFunction(f: any) {
  if (typeof f !== 'function') return false;
  const exp = /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i;
  return exp.exec(Function.prototype.toString.call(f)) != null;
}

export function createHash<T>(object: T) {
  const hashingStream = nodeCreateHash('md5');
  const { dispatch } = typeHasher(hashingStream);
  dispatch(object);

  if (!hashingStream.update) hashingStream.end('');
  if (hashingStream.digest) return hashingStream.digest('hex');

  const buf = hashingStream.read();
  return buf.toString('hex');
}

function typeHasher(writeTo: Hash) {
  const context: any[] = [];

  const write = (str: string) => {
    if (writeTo.update) writeTo.update(str, 'utf8');
    writeTo.write(str, 'utf8');
  };

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
        write('buffer:');
        write(object.toString('hex'));
      }

      if (objType !== 'object' && objType !== 'function' && objType !== 'asyncfunction') {
        if ((typeHandlers as any)[`_${objType}`]) {
          (typeHandlers as any)[`_${objType}`](object);
        } else {
          write(`[${objType}]`);
        }
      } else {
        const keys = Object.keys(object)
          .sort()
          .splice(0, 0, 'prototype', '__proto__', 'constructor');
        write(`object:${keys.length}:`);

        keys.forEach(key => {
          dispatch(key);
          write(':');
          write(',');
        });
      }
    },
    _array(arr: any[]) {
      write(`array:${arr.length}:`);
      arr.forEach(dispatch);
    },
    _date(date: Date) {
      write(`date:${date.toJSON()}`);
    },
    _symbol(sym: symbol) {
      write(`symbol:${sym.toString()}`);
    },
    _error(err: Error) {
      write(`error:${err.toString()}`);
    },
    _boolean(bool: boolean) {
      write(`bool:${bool.toString()}`);
    },
    _string(string: string) {
      write(`string:${string.length}:`);
      write(string.toString());
    },
    _function(fn: Function) {
      write('fn:');
      if (isNativeFunction(fn)) dispatch('[native]');
      else dispatch(fn.toString());
      dispatch(`function-name:${String(fn.name)}`);
      this._object(fn);
    },
    _number(number: number) {
      write(`number:${number.toString()}`);
    },
    _xml(xml: any) {
      write(`xml:${xml.toString()}`);
    },
    _null() {
      write('Null');
    },
    _undefined() {
      write('Undefined');
    },
    _regexp(regex: RegExp) {
      write(`regex:${regex.toString()}`);
    },
    _uint8array(arr: Uint8Array) {
      write('uint8array:');
      dispatch(Array.prototype.slice.call(arr));
    },
    _uint8clampedarray(arr: Uint8ClampedArray) {
      write('uint8clampedarray:');
      dispatch(Array.prototype.slice.call(arr));
    },
    _int8array(arr: Int8Array) {
      write('uint8array:');
      dispatch(Array.prototype.slice.call(arr));
    },
    _uint16array(arr: Uint16Array) {
      write('uint16array:');
      dispatch(Array.prototype.slice.call(arr));
    },
    _int16array(arr: Int16Array) {
      write('uint16array:');
      dispatch(Array.prototype.slice.call(arr));
    },
    _uint32array(arr: Uint32Array) {
      write('uint32array:');
      dispatch(Array.prototype.slice.call(arr));
    },
    _int32array(arr: Int32Array) {
      write('uint32array:');
      dispatch(Array.prototype.slice.call(arr));
    },
    _float32array(arr: Float32Array) {
      write('float32array:');
      dispatch(Array.prototype.slice.call(arr));
    },
    _float64array(arr: Float64Array) {
      write('float64array:');
      dispatch(Array.prototype.slice.call(arr));
    },
    _arraybuffer(arr: ArrayBuffer) {
      write('arraybuffer:');
      dispatch(new Uint8Array(arr));
    },
    _url(url: URL) {
      write(`url:${url.toString()}`);
    },
    _map(map: Map<any, any>) {
      write('map:');
      const arr = Array.from(map);
      typeHandlers._array(arr);
    },
    _set(set: Set<any>) {
      write('set:');
      const arr = Array.from(set);
      typeHandlers._array(arr);
    },
    _blob() {
      write('[blob]');
    },
    _domwindow() {
      write('domwindow');
    },
  };

  return { dispatch };
}
