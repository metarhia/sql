'use strict';

const { SelectBuilder } = require('./select-builder.js');
const { mapJoinIterable } = require('./utils.js');

class PgSelectBuilder extends SelectBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = {
      ...this.operations,
      selectDistinctOn: [],
    };
  }

  distinctOn(keyOrExpr) {
    this.operations.selectDistinct = true;
    this.operations.selectDistinctOn.push(keyOrExpr);
    return this;
  }

  _processDistinct() {
    const distinctOn = this.operations.selectDistinctOn;
    if (distinctOn.length === 0) {
      return super._processDistinct();
    }
    const keys = mapJoinIterable(
      distinctOn,
      (v) => this.makeKeyOrExpr(v),
      ', '
    );
    return `DISTINCT ON (${keys})`;
  }
}

module.exports = { PgSelectBuilder };
