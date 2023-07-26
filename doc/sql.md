# API Documentation

- [Interface sql](#interface-sql)
  - [QueryBuilder](#class-querybuilder)
    - [QueryBuilder.prototype.constructor](#querybuilderprototypeconstructorparams-options)
    - [QueryBuilder.prototype.build](#querybuilderprototypebuild)
    - [QueryBuilder.prototype.buildParams](#querybuilderprototypebuildparams)
    - [QueryBuilder.prototype.makeKeyOrExpr](#querybuilderprototypemakekeyorexprvalue-wrap--false)
    - [QueryBuilder.prototype.makeParamValue](#querybuilderprototypemakeparamvaluevalue)
  - [SelectBuilder](#class-selectbuilder-extends-queryconditionsbuilder)
    - [SelectBuilder.prototype.constructor](#selectbuilderprototypeconstructorparams-options)
    - [SelectBuilder.prototype.\_addSelectClause](#selectbuilderprototype_addselectclausetype-field-alias)
    - [SelectBuilder.prototype.\_processDistinct](#selectbuilderprototype_processdistinct)
    - [SelectBuilder.prototype.avg](#selectbuilderprototypeavgfield-alias)
    - [SelectBuilder.prototype.build](#selectbuilderprototypebuild)
    - [SelectBuilder.prototype.count](#selectbuilderprototypecountfield---alias)
    - [SelectBuilder.prototype.distinct](#selectbuilderprototypedistinct)
    - [SelectBuilder.prototype.from](#selectbuilderprototypefromtablename-alias)
    - [SelectBuilder.prototype.groupBy](#selectbuilderprototypegroupbyfields)
    - [SelectBuilder.prototype.innerJoin](#selectbuilderprototypeinnerjointablename-leftkey-rightkey)
    - [SelectBuilder.prototype.limit](#selectbuilderprototypelimitlimit)
    - [SelectBuilder.prototype.max](#selectbuilderprototypemaxfield-alias)
    - [SelectBuilder.prototype.min](#selectbuilderprototypeminfield-alias)
    - [SelectBuilder.prototype.offset](#selectbuilderprototypeoffsetoffset)
    - [SelectBuilder.prototype.orderBy](#selectbuilderprototypeorderbyfield-dir--asc)
    - [SelectBuilder.prototype.select](#selectbuilderprototypeselectfields)
    - [SelectBuilder.prototype.selectAs](#selectbuilderprototypeselectasfield-alias)
    - [SelectBuilder.prototype.sum](#selectbuilderprototypesumfield-alias)
  - [RawBuilder](#class-rawbuilder-extends-querybuilder)
    - [RawBuilder.prototype.constructor](#rawbuilderprototypeconstructorsqltemplate)
    - [RawBuilder.prototype.build](#rawbuilderprototypebuild)
  - [UpdateBuilder](#class-updatebuilder-extends-queryconditionsbuilder)
    - [UpdateBuilder.prototype.constructor](#updatebuilderprototypeconstructorparams-options)
    - [UpdateBuilder.prototype.build](#updatebuilderprototypebuild)
    - [UpdateBuilder.prototype.from](#updatebuilderprototypefromtablename-alias)
    - [UpdateBuilder.prototype.set](#updatebuilderprototypesetcolumn-value)
    - [UpdateBuilder.prototype.setKey](#updatebuilderprototypesetkeycolumn-key)
    - [UpdateBuilder.prototype.sets](#updatebuilderprototypesetsobj)
    - [UpdateBuilder.prototype.table](#updatebuilderprototypetabletablename-alias)
  - [DeleteBuilder](#class-deletebuilder-extends-queryconditionsbuilder)
    - [DeleteBuilder.prototype.constructor](#deletebuilderprototypeconstructorparams-options)
    - [DeleteBuilder.prototype.build](#deletebuilderprototypebuild)
    - [DeleteBuilder.prototype.from](#deletebuilderprototypefromtablename-alias)
  - [InsertBuilder](#class-insertbuilder-extends-querybuilder)
    - [InsertBuilder.prototype.constructor](#insertbuilderprototypeconstructorparams-options)
    - [InsertBuilder.prototype.build](#insertbuilderprototypebuild)
    - [InsertBuilder.prototype.table](#insertbuilderprototypetabletablename-alias)
    - [InsertBuilder.prototype.value](#insertbuilderprototypevaluekey-value)
    - [InsertBuilder.prototype.values](#insertbuilderprototypevaluesobj)
  - [PgInsertBuilder](#class-pginsertbuilder-extends-insertbuilder)
    - [PgInsertBuilder.prototype.constructor](#pginsertbuilderprototypeconstructorparams-options)
    - [PgInsertBuilder.prototype.build](#pginsertbuilderprototypebuild)
    - [PgInsertBuilder.prototype.conflict](#pginsertbuilderprototypeconflicttarget-action)
    - [PgInsertBuilder.prototype.returning](#pginsertbuilderprototypereturningkey-alias)
  - [PgSelectBuilder](#class-pgselectbuilder-extends-selectbuilder)
    - [PgSelectBuilder.prototype.constructor](#pgselectbuilderprototypeconstructorparams-options)
    - [PgSelectBuilder.prototype.\_processDistinct](#pgselectbuilderprototype_processdistinct)
    - [PgSelectBuilder.prototype.distinctOn](#pgselectbuilderprototypedistinctonkeyorexpr)
  - [ConditionsBuilder](#class-conditionsbuilder-extends-querybuilder)
    - [ConditionsBuilder.prototype.constructor](#conditionsbuilderprototypeconstructorparams-options)
    - [ConditionsBuilder.prototype.and](#conditionsbuilderprototypeandkey-cond-value)
    - [ConditionsBuilder.prototype.andConds](#conditionsbuilderprototypeandcondsconditions)
    - [ConditionsBuilder.prototype.andKey](#conditionsbuilderprototypeandkeyleftkey-cond-rightkey)
    - [ConditionsBuilder.prototype.andRaw](#conditionsbuilderprototypeandrawsql)
    - [ConditionsBuilder.prototype.any](#conditionsbuilderprototypeanykey-value)
    - [ConditionsBuilder.prototype.between](#conditionsbuilderprototypebetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.build](#conditionsbuilderprototypebuild)
    - [ConditionsBuilder.prototype.exists](#conditionsbuilderprototypeexistssubquery)
    - [ConditionsBuilder.prototype.in](#conditionsbuilderprototypeinkey-conds)
    - [ConditionsBuilder.prototype.not](#conditionsbuilderprototypenotkey-cond-value)
    - [ConditionsBuilder.prototype.notBetween](#conditionsbuilderprototypenotbetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.notIn](#conditionsbuilderprototypenotinkey-conds)
    - [ConditionsBuilder.prototype.notKey](#conditionsbuilderprototypenotkeyleftkey-cond-rightkey)
    - [ConditionsBuilder.prototype.notNull](#conditionsbuilderprototypenotnullkey)
    - [ConditionsBuilder.prototype.notRaw](#conditionsbuilderprototypenotrawsql)
    - [ConditionsBuilder.prototype.null](#conditionsbuilderprototypenullkey)
    - [ConditionsBuilder.prototype.or](#conditionsbuilderprototypeorkey-cond-value)
    - [ConditionsBuilder.prototype.orAny](#conditionsbuilderprototypeoranykey-value)
    - [ConditionsBuilder.prototype.orBetween](#conditionsbuilderprototypeorbetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.orConds](#conditionsbuilderprototypeorcondsconditions)
    - [ConditionsBuilder.prototype.orExists](#conditionsbuilderprototypeorexistssubquery)
    - [ConditionsBuilder.prototype.orIn](#conditionsbuilderprototypeorinkey-conds)
    - [ConditionsBuilder.prototype.orKey](#conditionsbuilderprototypeorkeyleftkey-cond-rightkey)
    - [ConditionsBuilder.prototype.orNot](#conditionsbuilderprototypeornotkey-cond-value)
    - [ConditionsBuilder.prototype.orNotBetween](#conditionsbuilderprototypeornotbetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.orNotIn](#conditionsbuilderprototypeornotinkey-conds)
    - [ConditionsBuilder.prototype.orNotKey](#conditionsbuilderprototypeornotkeyleftkey-cond-rightkey)
    - [ConditionsBuilder.prototype.orNotNull](#conditionsbuilderprototypeornotnullkey)
    - [ConditionsBuilder.prototype.orNotRaw](#conditionsbuilderprototypeornotrawsql)
    - [ConditionsBuilder.prototype.orNull](#conditionsbuilderprototypeornullkey)
    - [ConditionsBuilder.prototype.orRaw](#conditionsbuilderprototypeorrawsql)
  - [ParamsBuilder](#class-paramsbuilder)
    - [ParamsBuilder.prototype.constructor](#paramsbuilderprototypeconstructor)
    - [ParamsBuilder.prototype.add](#paramsbuilderprototypeaddvalue-options)
    - [ParamsBuilder.prototype.build](#paramsbuilderprototypebuild)
  - [PostgresParamsBuilder](#class-postgresparamsbuilder-extends-paramsbuilder)
    - [PostgresParamsBuilder.prototype.constructor](#postgresparamsbuilderprototypeconstructor)
    - [PostgresParamsBuilder.prototype.add](#postgresparamsbuilderprototypeaddvalue-options)
    - [PostgresParamsBuilder.prototype.build](#postgresparamsbuilderprototypebuild)
  - [pg](#pghandler)
  - [pgQuerySelect](#pgqueryselectpg-handler)
  - [pgQueryInsert](#pgqueryinsertpg-handler)
  - [pgQueryUpdate](#pgqueryupdatepg-handler)
  - [pgQueryDelete](#pgquerydeletepg-handler)

## Interface: sql

### class QueryBuilder

#### QueryBuilder.prototype.constructor(params, options)

- `params`: [`<ParamsBuilder>`][paramsbuilder]
- `options`: [`<Object>`][object]
  - `escapeIdentifier`: [`<Function>`][function]
    - `identifier`: [`<string>`][string] to escape
  - _Returns:_ [`<string>`][string] escaped string

#### QueryBuilder.prototype.build()

_Returns:_ [`<string>`][string]

Build and return the SQL query

#### QueryBuilder.prototype.buildParams()

_Returns:_ `<Array<unknown>>`

Build params for this query

#### QueryBuilder.prototype.makeKeyOrExpr(value, wrap = false)

#### QueryBuilder.prototype.makeParamValue(value)

### class SelectBuilder extends QueryConditionsBuilder

#### SelectBuilder.prototype.constructor(params, options)

#### SelectBuilder.prototype.\_addSelectClause(type, field, alias)

#### SelectBuilder.prototype.\_processDistinct()

#### SelectBuilder.prototype.avg(field, alias)

#### SelectBuilder.prototype.build()

#### SelectBuilder.prototype.count(field = '\*', alias)

#### SelectBuilder.prototype.distinct()

#### SelectBuilder.prototype.from(tableName, alias)

#### SelectBuilder.prototype.groupBy(...fields)

#### SelectBuilder.prototype.innerJoin(tableName, leftKey, rightKey)

#### SelectBuilder.prototype.limit(limit)

#### SelectBuilder.prototype.max(field, alias)

#### SelectBuilder.prototype.min(field, alias)

#### SelectBuilder.prototype.offset(offset)

#### SelectBuilder.prototype.orderBy(field, dir = 'ASC')

#### SelectBuilder.prototype.select(...fields)

#### SelectBuilder.prototype.selectAs(field, alias)

#### SelectBuilder.prototype.sum(field, alias)

### class RawBuilder extends [QueryBuilder][sql-querybuilder]

#### RawBuilder.prototype.constructor(sqlTemplate)

- `sqlTemplate`: [`<Function>`][function] function or sql string
  - `params`: [`<ParamsBuilder>`][paramsbuilder]
- _Returns:_ [`<string>`][string] query

#### RawBuilder.prototype.build()

### class UpdateBuilder extends QueryConditionsBuilder

#### UpdateBuilder.prototype.constructor(params, options)

#### UpdateBuilder.prototype.build()

#### UpdateBuilder.prototype.from(tableName, alias)

#### UpdateBuilder.prototype.set(column, value)

#### UpdateBuilder.prototype.setKey(column, key)

#### UpdateBuilder.prototype.sets(obj)

#### UpdateBuilder.prototype.table(tableName, alias)

### class DeleteBuilder extends QueryConditionsBuilder

#### DeleteBuilder.prototype.constructor(params, options)

#### DeleteBuilder.prototype.build()

#### DeleteBuilder.prototype.from(tableName, alias)

### class InsertBuilder extends [QueryBuilder][sql-querybuilder]

#### InsertBuilder.prototype.constructor(params, options)

#### InsertBuilder.prototype.build()

#### InsertBuilder.prototype.table(tableName, alias)

#### InsertBuilder.prototype.value(key, value)

#### InsertBuilder.prototype.values(obj)

### class PgInsertBuilder extends [InsertBuilder][sql-insertbuilder]

#### PgInsertBuilder.prototype.constructor(params, options)

#### PgInsertBuilder.prototype.build()

#### PgInsertBuilder.prototype.conflict(target, action)

#### PgInsertBuilder.prototype.returning(key, alias)

### class PgSelectBuilder extends [SelectBuilder][sql-selectbuilder]

#### PgSelectBuilder.prototype.constructor(params, options)

#### PgSelectBuilder.prototype.\_processDistinct()

#### PgSelectBuilder.prototype.distinctOn(keyOrExpr)

### class ConditionsBuilder extends [QueryBuilder][sql-querybuilder]

#### ConditionsBuilder.prototype.constructor(params, options)

#### ConditionsBuilder.prototype.and(key, cond, value)

#### ConditionsBuilder.prototype.andConds(conditions)

#### ConditionsBuilder.prototype.andKey(leftKey, cond, rightKey)

#### ConditionsBuilder.prototype.andRaw(sql)

#### ConditionsBuilder.prototype.any(key, value)

#### ConditionsBuilder.prototype.between(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.build()

#### ConditionsBuilder.prototype.exists(subquery)

#### ConditionsBuilder.prototype.in(key, conds)

#### ConditionsBuilder.prototype.not(key, cond, value)

#### ConditionsBuilder.prototype.notBetween(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.notIn(key, conds)

#### ConditionsBuilder.prototype.notKey(leftKey, cond, rightKey)

#### ConditionsBuilder.prototype.notNull(key)

#### ConditionsBuilder.prototype.notRaw(sql)

#### ConditionsBuilder.prototype.null(key)

#### ConditionsBuilder.prototype.or(key, cond, value)

#### ConditionsBuilder.prototype.orAny(key, value)

#### ConditionsBuilder.prototype.orBetween(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.orConds(conditions)

#### ConditionsBuilder.prototype.orExists(subquery)

#### ConditionsBuilder.prototype.orIn(key, conds)

#### ConditionsBuilder.prototype.orKey(leftKey, cond, rightKey)

#### ConditionsBuilder.prototype.orNot(key, cond, value)

#### ConditionsBuilder.prototype.orNotBetween(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.orNotIn(key, conds)

#### ConditionsBuilder.prototype.orNotKey(leftKey, cond, rightKey)

#### ConditionsBuilder.prototype.orNotNull(key)

#### ConditionsBuilder.prototype.orNotRaw(sql)

#### ConditionsBuilder.prototype.orNull(key)

#### ConditionsBuilder.prototype.orRaw(sql)

### class ParamsBuilder

Base class for all ParamsBuilders

#### ParamsBuilder.prototype.constructor()

Base class for all ParamsBuilders

#### ParamsBuilder.prototype.add(value, options)

- `value`: `<any>`
- `options`: [`<Object>`][object] optional

_Returns:_ [`<string>`][string] name to put in an sql query

Add passed value to parameters

#### ParamsBuilder.prototype.build()

_Returns:_ [`<string>`][string]

Build and return the SQL query

### class PostgresParamsBuilder extends [ParamsBuilder][paramsbuilder]

#### PostgresParamsBuilder.prototype.constructor()

#### PostgresParamsBuilder.prototype.add(value, options)

- `value`: `<any>`
- `options`: [`<Object>`][object] optional

_Returns:_ [`<string>`][string] name to put in a sql query

Add passed value to parameters

#### PostgresParamsBuilder.prototype.build()

_Returns:_ `<any>`

Generic building method that must return the parameters object

### pg(handler)

### pgQuerySelect(pg, handler)

### pgQueryInsert(pg, handler)

### pgQueryUpdate(pg, handler)

### pgQueryDelete(pg, handler)

[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[paramsbuilder]: ../lib/params-builder.js
[sql-querybuilder]: #class-querybuilder
[sql-selectbuilder]: #class-selectbuilder-extends-queryconditionsbuilder
[sql-insertbuilder]: #class-insertbuilder-extends-querybuilder
