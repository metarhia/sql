'use strict';

const { QueryBuilder } = require('./query-builder');
const escapeIdentifier = name => `"${name}"`;

const escapeKey = (key, escapeIdentifier) =>
  key
    .split('.')
    .map(k => (k === '*' ? '*' : escapeIdentifier(k)))
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

const checkTypeOrQuery = (value, name, type) => {
  if (!(value instanceof QueryBuilder) && typeof value !== type) {
    throw new TypeError(
      `Invalid '${name}' value type, expected type ${type} or QueryBuilder. ` +
        `Received: ${value}`
    );
  }
};

module.exports = {
  escapeIdentifier,
  escapeKey,
  mapJoinIterable,
  joinIterable,
  checkTypeOrQuery,
};
