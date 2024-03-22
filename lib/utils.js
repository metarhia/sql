'use strict';

const escapeIdentifier = (name) => name && `"${name}"`;

const pgEscapeIdentifier = (name) => {
  if (!name || typeof name !== 'string') return name;
  const castPos = name.indexOf('::');
  if (castPos === -1) return `"${name}"`;
  return `"${name.slice(0, castPos)}"` + name.slice(castPos);
};

const escapeKey = (key, escapeIdentifier) =>
  key &&
  key
    .split('.')
    .map((k) => (k === '*' ? '*' : escapeIdentifier(k)))
    .join('.');

const mapJoinIterable = (val, mapper, sep) => {
  const it = val[Symbol.iterator]();
  const { done, value } = it.next();
  if (done) return '';
  let res = mapper(value);
  for (const value of it) {
    res += sep + mapper(value);
  }
  return res;
};

const joinIterable = (val, sep) => {
  const it = val[Symbol.iterator]();
  const { done, value } = it.next();
  if (done) return '';
  let res = String(value);
  for (const value of it) {
    res += sep + value;
  }
  return res;
};

module.exports = {
  escapeIdentifier,
  pgEscapeIdentifier,
  escapeKey,
  mapJoinIterable,
  joinIterable,
};
