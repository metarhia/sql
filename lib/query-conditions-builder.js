'use strict';

const { QueryBuilder } = require('./query-builder.js');
const { ConditionsBuilder } = require('./conditions-builder.js');

class QueryConditionsBuilder extends QueryBuilder {
  constructor(params, options) {
    super(params, options);
    this.whereConditions = new ConditionsBuilder(params, options);
  }

  where(key, cond, value) {
    this.whereConditions.and(key, cond, this._whereValueMapper(value));
    return this;
  }

  whereKey(leftKey, cond, rightKey) {
    this.whereConditions.andKey(leftKey, cond, rightKey);
    return this;
  }

  whereRaw(sql) {
    this.whereConditions.andRaw(sql);
    return this;
  }

  orWhere(key, cond, value) {
    this.whereConditions.or(key, cond, this._whereValueMapper(value));
    return this;
  }

  orWhereKey(leftKey, cond, rightKey) {
    this.whereConditions.orKey(leftKey, cond, rightKey);
    return this;
  }

  orWhereRaw(sql) {
    this.whereConditions.orRaw(sql);
    return this;
  }

  whereEq(key, value) {
    this.whereConditions.and(key, '=', this._whereValueMapper(value));
    return this;
  }

  orWhereEq(key, value) {
    this.whereConditions.or(key, '=', this._whereValueMapper(value));
    return this;
  }

  whereMore(key, value) {
    this.whereConditions.and(key, '>', this._whereValueMapper(value));
    return this;
  }

  orWhereMore(key, value) {
    this.whereConditions.or(key, '>', this._whereValueMapper(value));
    return this;
  }

  whereMoreEq(key, value) {
    this.whereConditions.and(key, '>=', this._whereValueMapper(value));
    return this;
  }

  orWhereMoreEq(key, value) {
    this.whereConditions.or(key, '>=', this._whereValueMapper(value));
    return this;
  }

  whereLess(key, value) {
    this.whereConditions.and(key, '<', this._whereValueMapper(value));
    return this;
  }

  orWhereLess(key, value) {
    this.whereConditions.or(key, '<', this._whereValueMapper(value));
    return this;
  }

  whereLessEq(key, value) {
    this.whereConditions.and(key, '<=', this._whereValueMapper(value));
    return this;
  }

  orWhereLessEq(key, value) {
    this.whereConditions.or(key, '<=', this._whereValueMapper(value));
    return this;
  }

  whereNot(key, cond, value) {
    this.whereConditions.not(key, cond, this._whereValueMapper(value));
    return this;
  }

  whereNotKey(leftKey, cond, rightKey) {
    this.whereConditions.notKey(leftKey, cond, rightKey);
    return this;
  }

  whereNotRaw(sql) {
    this.whereConditions.notRaw(sql);
    return this;
  }

  orWhereNot(key, cond, value) {
    this.whereConditions.orNot(key, cond, this._whereValueMapper(value));
    return this;
  }

  orWhereNotKey(leftKey, cond, rightKey) {
    this.whereConditions.orNotKey(leftKey, cond, rightKey);
    return this;
  }

  orWhereNotRaw(sql) {
    this.whereConditions.orNotRaw(sql);
    return this;
  }

  whereNull(key) {
    this.whereConditions.null(key);
    return this;
  }

  orWhereNull(key) {
    this.whereConditions.orNull(key);
    return this;
  }

  whereNotNull(key) {
    this.whereConditions.notNull(key);
    return this;
  }

  orWhereNotNull(key) {
    this.whereConditions.orNotNull(key);
    return this;
  }

  whereBetween(key, from, to, symmetric) {
    this.whereConditions.between(
      key,
      this._whereValueMapper(from),
      this._whereValueMapper(to),
      symmetric
    );
    return this;
  }

  orWhereBetween(key, from, to, symmetric) {
    this.whereConditions.orBetween(
      key,
      this._whereValueMapper(from),
      this._whereValueMapper(to),
      symmetric
    );
    return this;
  }

  whereNotBetween(key, from, to, symmetric) {
    this.whereConditions.notBetween(
      key,
      this._whereValueMapper(from),
      this._whereValueMapper(to),
      symmetric
    );
    return this;
  }

  orWhereNotBetween(key, from, to, symmetric) {
    this.whereConditions.orNotBetween(
      key,
      this._whereValueMapper(from),
      this._whereValueMapper(to),
      symmetric
    );
    return this;
  }

  whereIn(key, conds) {
    this.whereConditions.in(key, this._whereValueMapper(conds));
    return this;
  }

  orWhereIn(key, conds) {
    this.whereConditions.orIn(key, this._whereValueMapper(conds));
    return this;
  }

  whereNotIn(key, conds) {
    this.whereConditions.notIn(key, this._whereValueMapper(conds));
    return this;
  }

  orWhereNotIn(key, conds) {
    this.whereConditions.orNotIn(key, this._whereValueMapper(conds));
    return this;
  }

  whereAny(key, value) {
    this.whereConditions.any(key, this._whereValueMapper(value));
    return this;
  }

  orWhereAny(key, value) {
    this.whereConditions.orAny(key, this._whereValueMapper(value));
    return this;
  }

  whereExists(subquery) {
    this.whereConditions.exists(this._whereValueMapper(subquery));
    return this;
  }

  orWhereExists(subquery) {
    this.whereConditions.orExists(this._whereValueMapper(subquery));
    return this;
  }

  whereLike(key, value) {
    this.whereConditions.like(key, value);
    return this;
  }

  whereNotLike(key, value) {
    this.whereConditions.notLike(key, value);
    return this;
  }

  orWhereLike(key, value) {
    this.whereConditions.orLike(key, value);
    return this;
  }

  orWhereNotLike(key, value) {
    this.whereConditions.orNotLike(key, value);
    return this;
  }

  whereILike(key, value) {
    this.whereConditions.ilike(key, value);
    return this;
  }

  whereNotILike(key, value) {
    this.whereConditions.notILike(key, value);
    return this;
  }

  orWhereILike(key, value) {
    this.whereConditions.orILike(key, value);
    return this;
  }

  orWhereNotILike(key, value) {
    this.whereConditions.orNotILike(key, value);
    return this;
  }

  _whereValueMapper(value) {
    return value;
  }
}

module.exports = { QueryConditionsBuilder };
