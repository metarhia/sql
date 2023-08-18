# API Documentation

- [Interface sql](#interface-sql)
  - [QueryBuilder](#class-querybuilder)
    - [QueryBuilder.prototype.constructor](#querybuilderprototypeconstructorparams-options)
    - [QueryBuilder.prototype.build](#querybuilderprototypebuild)
    - [QueryBuilder.prototype.buildParams](#querybuilderprototypebuildparams)
    - [QueryBuilder.prototype.makeKeyOrExpr](#querybuilderprototypemakekeyorexprvalue-wrap--false)
    - [QueryBuilder.prototype.makeParamValue](#querybuilderprototypemakeparamvaluevalue)
    - [QueryBuilder.prototype.raw](#querybuilderprototyperawsqltemplate)
  - [QueryConditionsBuilder](#class-queryconditionsbuilder-extends-querybuilder)
    - [QueryConditionsBuilder.prototype.constructor](#queryconditionsbuilderprototypeconstructorparams-options)
    - [QueryConditionsBuilder.prototype.\_whereValueMapper](#queryconditionsbuilderprototype_wherevaluemappervalue)
    - [QueryConditionsBuilder.prototype.orWhere](#queryconditionsbuilderprototypeorwherekey-cond-value)
    - [QueryConditionsBuilder.prototype.orWhereAny](#queryconditionsbuilderprototypeorwhereanykey-value)
    - [QueryConditionsBuilder.prototype.orWhereBetween](#queryconditionsbuilderprototypeorwherebetweenkey-from-to-symmetric)
    - [QueryConditionsBuilder.prototype.orWhereExists](#queryconditionsbuilderprototypeorwhereexistssubquery)
    - [QueryConditionsBuilder.prototype.orWhereILike](#queryconditionsbuilderprototypeorwhereilikekey-value)
    - [QueryConditionsBuilder.prototype.orWhereIn](#queryconditionsbuilderprototypeorwhereinkey-conds)
    - [QueryConditionsBuilder.prototype.orWhereKey](#queryconditionsbuilderprototypeorwherekeyleftkey-cond-rightkey)
    - [QueryConditionsBuilder.prototype.orWhereLike](#queryconditionsbuilderprototypeorwherelikekey-value)
    - [QueryConditionsBuilder.prototype.orWhereNot](#queryconditionsbuilderprototypeorwherenotkey-cond-value)
    - [QueryConditionsBuilder.prototype.orWhereNotBetween](#queryconditionsbuilderprototypeorwherenotbetweenkey-from-to-symmetric)
    - [QueryConditionsBuilder.prototype.orWhereNotILike](#queryconditionsbuilderprototypeorwherenotilikekey-value)
    - [QueryConditionsBuilder.prototype.orWhereNotIn](#queryconditionsbuilderprototypeorwherenotinkey-conds)
    - [QueryConditionsBuilder.prototype.orWhereNotKey](#queryconditionsbuilderprototypeorwherenotkeyleftkey-cond-rightkey)
    - [QueryConditionsBuilder.prototype.orWhereNotLike](#queryconditionsbuilderprototypeorwherenotlikekey-value)
    - [QueryConditionsBuilder.prototype.orWhereNotNull](#queryconditionsbuilderprototypeorwherenotnullkey)
    - [QueryConditionsBuilder.prototype.orWhereNotRaw](#queryconditionsbuilderprototypeorwherenotrawsql)
    - [QueryConditionsBuilder.prototype.orWhereNull](#queryconditionsbuilderprototypeorwherenullkey)
    - [QueryConditionsBuilder.prototype.orWhereRaw](#queryconditionsbuilderprototypeorwhererawsql)
    - [QueryConditionsBuilder.prototype.where](#queryconditionsbuilderprototypewherekey-cond-value)
    - [QueryConditionsBuilder.prototype.whereAny](#queryconditionsbuilderprototypewhereanykey-value)
    - [QueryConditionsBuilder.prototype.whereBetween](#queryconditionsbuilderprototypewherebetweenkey-from-to-symmetric)
    - [QueryConditionsBuilder.prototype.whereEq](#queryconditionsbuilderprototypewhereeqkey-value)
    - [QueryConditionsBuilder.prototype.whereExists](#queryconditionsbuilderprototypewhereexistssubquery)
    - [QueryConditionsBuilder.prototype.whereILike](#queryconditionsbuilderprototypewhereilikekey-value)
    - [QueryConditionsBuilder.prototype.whereIn](#queryconditionsbuilderprototypewhereinkey-conds)
    - [QueryConditionsBuilder.prototype.whereKey](#queryconditionsbuilderprototypewherekeyleftkey-cond-rightkey)
    - [QueryConditionsBuilder.prototype.whereLess](#queryconditionsbuilderprototypewherelesskey-value)
    - [QueryConditionsBuilder.prototype.whereLessEq](#queryconditionsbuilderprototypewherelesseqkey-value)
    - [QueryConditionsBuilder.prototype.whereLike](#queryconditionsbuilderprototypewherelikekey-value)
    - [QueryConditionsBuilder.prototype.whereMore](#queryconditionsbuilderprototypewheremorekey-value)
    - [QueryConditionsBuilder.prototype.whereMoreEq](#queryconditionsbuilderprototypewheremoreeqkey-value)
    - [QueryConditionsBuilder.prototype.whereNot](#queryconditionsbuilderprototypewherenotkey-cond-value)
    - [QueryConditionsBuilder.prototype.whereNotBetween](#queryconditionsbuilderprototypewherenotbetweenkey-from-to-symmetric)
    - [QueryConditionsBuilder.prototype.whereNotILike](#queryconditionsbuilderprototypewherenotilikekey-value)
    - [QueryConditionsBuilder.prototype.whereNotIn](#queryconditionsbuilderprototypewherenotinkey-conds)
    - [QueryConditionsBuilder.prototype.whereNotKey](#queryconditionsbuilderprototypewherenotkeyleftkey-cond-rightkey)
    - [QueryConditionsBuilder.prototype.whereNotLike](#queryconditionsbuilderprototypewherenotlikekey-value)
    - [QueryConditionsBuilder.prototype.whereNotNull](#queryconditionsbuilderprototypewherenotnullkey)
    - [QueryConditionsBuilder.prototype.whereNotRaw](#queryconditionsbuilderprototypewherenotrawsql)
    - [QueryConditionsBuilder.prototype.whereNull](#queryconditionsbuilderprototypewherenullkey)
    - [QueryConditionsBuilder.prototype.whereRaw](#queryconditionsbuilderprototypewhererawsql)
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
    - [SelectBuilder.prototype.selectRaw](#selectbuilderprototypeselectrawsqlorbuilder)
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
    - [ConditionsBuilder.prototype.ilike](#conditionsbuilderprototypeilikekey-value)
    - [ConditionsBuilder.prototype.in](#conditionsbuilderprototypeinkey-conds)
    - [ConditionsBuilder.prototype.like](#conditionsbuilderprototypelikekey-value)
    - [ConditionsBuilder.prototype.not](#conditionsbuilderprototypenotkey-cond-value)
    - [ConditionsBuilder.prototype.notBetween](#conditionsbuilderprototypenotbetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.notILike](#conditionsbuilderprototypenotilikekey-value)
    - [ConditionsBuilder.prototype.notIn](#conditionsbuilderprototypenotinkey-conds)
    - [ConditionsBuilder.prototype.notKey](#conditionsbuilderprototypenotkeyleftkey-cond-rightkey)
    - [ConditionsBuilder.prototype.notLike](#conditionsbuilderprototypenotlikekey-value)
    - [ConditionsBuilder.prototype.notNull](#conditionsbuilderprototypenotnullkey)
    - [ConditionsBuilder.prototype.notRaw](#conditionsbuilderprototypenotrawsql)
    - [ConditionsBuilder.prototype.null](#conditionsbuilderprototypenullkey)
    - [ConditionsBuilder.prototype.or](#conditionsbuilderprototypeorkey-cond-value)
    - [ConditionsBuilder.prototype.orAny](#conditionsbuilderprototypeoranykey-value)
    - [ConditionsBuilder.prototype.orBetween](#conditionsbuilderprototypeorbetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.orConds](#conditionsbuilderprototypeorcondsconditions)
    - [ConditionsBuilder.prototype.orExists](#conditionsbuilderprototypeorexistssubquery)
    - [ConditionsBuilder.prototype.orILike](#conditionsbuilderprototypeorilikekey-value)
    - [ConditionsBuilder.prototype.orIn](#conditionsbuilderprototypeorinkey-conds)
    - [ConditionsBuilder.prototype.orKey](#conditionsbuilderprototypeorkeyleftkey-cond-rightkey)
    - [ConditionsBuilder.prototype.orLike](#conditionsbuilderprototypeorlikekey-value)
    - [ConditionsBuilder.prototype.orNot](#conditionsbuilderprototypeornotkey-cond-value)
    - [ConditionsBuilder.prototype.orNotBetween](#conditionsbuilderprototypeornotbetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.orNotILike](#conditionsbuilderprototypeornotilikekey-value)
    - [ConditionsBuilder.prototype.orNotIn](#conditionsbuilderprototypeornotinkey-conds)
    - [ConditionsBuilder.prototype.orNotKey](#conditionsbuilderprototypeornotkeyleftkey-cond-rightkey)
    - [ConditionsBuilder.prototype.orNotLike](#conditionsbuilderprototypeornotlikekey-value)
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
  - [pgSelect](#pgselecthandler)
  - [pgInsert](#pginserthandler)
  - [pgUpdate](#pgupdatehandler)
  - [pgDelete](#pgdeletehandler)
  - [pgQuerySelect](#pgqueryselectpg-handler)
  - [pgQueryInsert](#pgqueryinsertpg-handler)
  - [pgQueryUpdate](#pgqueryupdatepg-handler)
  - [pgQueryDelete](#pgquerydeletepg-handler)

## Interface: sql

### class QueryBuilder

#### QueryBuilder.prototype.constructor(params, options)

- `params`: `<ParamsBuilder>`
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

#### QueryBuilder.prototype.raw(sqlTemplate)

### class QueryConditionsBuilder extends [QueryBuilder][sql-querybuilder]

#### QueryConditionsBuilder.prototype.constructor(params, options)

#### QueryConditionsBuilder.prototype.\_whereValueMapper(value)

#### QueryConditionsBuilder.prototype.orWhere(key, cond, value)

#### QueryConditionsBuilder.prototype.orWhereAny(key, value)

#### QueryConditionsBuilder.prototype.orWhereBetween(key, from, to, symmetric)

#### QueryConditionsBuilder.prototype.orWhereExists(subquery)

#### QueryConditionsBuilder.prototype.orWhereILike(key, value)

#### QueryConditionsBuilder.prototype.orWhereIn(key, conds)

#### QueryConditionsBuilder.prototype.orWhereKey(leftKey, cond, rightKey)

#### QueryConditionsBuilder.prototype.orWhereLike(key, value)

#### QueryConditionsBuilder.prototype.orWhereNot(key, cond, value)

#### QueryConditionsBuilder.prototype.orWhereNotBetween(key, from, to, symmetric)

#### QueryConditionsBuilder.prototype.orWhereNotILike(key, value)

#### QueryConditionsBuilder.prototype.orWhereNotIn(key, conds)

#### QueryConditionsBuilder.prototype.orWhereNotKey(leftKey, cond, rightKey)

#### QueryConditionsBuilder.prototype.orWhereNotLike(key, value)

#### QueryConditionsBuilder.prototype.orWhereNotNull(key)

#### QueryConditionsBuilder.prototype.orWhereNotRaw(sql)

#### QueryConditionsBuilder.prototype.orWhereNull(key)

#### QueryConditionsBuilder.prototype.orWhereRaw(sql)

#### QueryConditionsBuilder.prototype.where(key, cond, value)

#### QueryConditionsBuilder.prototype.whereAny(key, value)

#### QueryConditionsBuilder.prototype.whereBetween(key, from, to, symmetric)

#### QueryConditionsBuilder.prototype.whereEq(key, value)

#### QueryConditionsBuilder.prototype.whereExists(subquery)

#### QueryConditionsBuilder.prototype.whereILike(key, value)

#### QueryConditionsBuilder.prototype.whereIn(key, conds)

#### QueryConditionsBuilder.prototype.whereKey(leftKey, cond, rightKey)

#### QueryConditionsBuilder.prototype.whereLess(key, value)

#### QueryConditionsBuilder.prototype.whereLessEq(key, value)

#### QueryConditionsBuilder.prototype.whereLike(key, value)

#### QueryConditionsBuilder.prototype.whereMore(key, value)

#### QueryConditionsBuilder.prototype.whereMoreEq(key, value)

#### QueryConditionsBuilder.prototype.whereNot(key, cond, value)

#### QueryConditionsBuilder.prototype.whereNotBetween(key, from, to, symmetric)

#### QueryConditionsBuilder.prototype.whereNotILike(key, value)

#### QueryConditionsBuilder.prototype.whereNotIn(key, conds)

#### QueryConditionsBuilder.prototype.whereNotKey(leftKey, cond, rightKey)

#### QueryConditionsBuilder.prototype.whereNotLike(key, value)

#### QueryConditionsBuilder.prototype.whereNotNull(key)

#### QueryConditionsBuilder.prototype.whereNotRaw(sql)

#### QueryConditionsBuilder.prototype.whereNull(key)

#### QueryConditionsBuilder.prototype.whereRaw(sql)

### class SelectBuilder extends [QueryConditionsBuilder][sql-queryconditionsbuilder]

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

#### SelectBuilder.prototype.selectRaw(sqlOrBuilder)

#### SelectBuilder.prototype.sum(field, alias)

### class RawBuilder extends [QueryBuilder][sql-querybuilder]

#### RawBuilder.prototype.constructor(sqlTemplate)

- `sqlTemplate`: [`<Function>`][function] function or sql string
  - `params`: `<ParamsBuilder>`
- _Returns:_ [`<string>`][string] query

#### RawBuilder.prototype.build()

### class UpdateBuilder extends [QueryConditionsBuilder][sql-queryconditionsbuilder]

#### UpdateBuilder.prototype.constructor(params, options)

#### UpdateBuilder.prototype.build()

#### UpdateBuilder.prototype.from(tableName, alias)

#### UpdateBuilder.prototype.set(column, value)

#### UpdateBuilder.prototype.setKey(column, key)

#### UpdateBuilder.prototype.sets(obj)

#### UpdateBuilder.prototype.table(tableName, alias)

### class DeleteBuilder extends [QueryConditionsBuilder][sql-queryconditionsbuilder]

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

#### ConditionsBuilder.prototype.ilike(key, value)

#### ConditionsBuilder.prototype.in(key, conds)

#### ConditionsBuilder.prototype.like(key, value)

#### ConditionsBuilder.prototype.not(key, cond, value)

#### ConditionsBuilder.prototype.notBetween(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.notILike(key, value)

#### ConditionsBuilder.prototype.notIn(key, conds)

#### ConditionsBuilder.prototype.notKey(leftKey, cond, rightKey)

#### ConditionsBuilder.prototype.notLike(key, value)

#### ConditionsBuilder.prototype.notNull(key)

#### ConditionsBuilder.prototype.notRaw(sql)

#### ConditionsBuilder.prototype.null(key)

#### ConditionsBuilder.prototype.or(key, cond, value)

#### ConditionsBuilder.prototype.orAny(key, value)

#### ConditionsBuilder.prototype.orBetween(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.orConds(conditions)

#### ConditionsBuilder.prototype.orExists(subquery)

#### ConditionsBuilder.prototype.orILike(key, value)

#### ConditionsBuilder.prototype.orIn(key, conds)

#### ConditionsBuilder.prototype.orKey(leftKey, cond, rightKey)

#### ConditionsBuilder.prototype.orLike(key, value)

#### ConditionsBuilder.prototype.orNot(key, cond, value)

#### ConditionsBuilder.prototype.orNotBetween(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.orNotILike(key, value)

#### ConditionsBuilder.prototype.orNotIn(key, conds)

#### ConditionsBuilder.prototype.orNotKey(leftKey, cond, rightKey)

#### ConditionsBuilder.prototype.orNotLike(key, value)

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

### class PostgresParamsBuilder extends [ParamsBuilder][sql-paramsbuilder]

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

### pgSelect(handler)

### pgInsert(handler)

### pgUpdate(handler)

### pgDelete(handler)

### pgQuerySelect(pg, handler)

### pgQueryInsert(pg, handler)

### pgQueryUpdate(pg, handler)

### pgQueryDelete(pg, handler)

[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[sql-querybuilder]: #class-querybuilder
[sql-queryconditionsbuilder]: #class-queryconditionsbuilder-extends-querybuilder
[sql-selectbuilder]: #class-selectbuilder-extends-queryconditionsbuilder
[sql-insertbuilder]: #class-insertbuilder-extends-querybuilder
[sql-paramsbuilder]: #class-paramsbuilder
