# API Documentation

- [Interface sql](#interface-sql)
  - [QueryBuilder](#class-querybuilder)
    - [QueryBuilder.prototype.constructor](#querybuilderprototypeconstructorparams-options)
    - [QueryBuilder.prototype.build](#querybuilderprototypebuild)
  - [SelectBuilder](#class-selectbuilder-extends-querybuilder)
    - [SelectBuilder.prototype.constructor](#selectbuilderprototypeconstructorparams-options)
    - [SelectBuilder.prototype.\_addSelectClause](#selectbuilderprototype_addselectclausetype-field-alias)
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
    - [SelectBuilder.prototype.orWhere](#selectbuilderprototypeorwherekey-cond-value)
    - [SelectBuilder.prototype.orWhereAny](#selectbuilderprototypeorwhereanykey-value)
    - [SelectBuilder.prototype.orWhereBetween](#selectbuilderprototypeorwherebetweenkey-from-to-symmetric)
    - [SelectBuilder.prototype.orWhereExists](#selectbuilderprototypeorwhereexistssubquery)
    - [SelectBuilder.prototype.orWhereIn](#selectbuilderprototypeorwhereinkey-conds)
    - [SelectBuilder.prototype.orWhereNot](#selectbuilderprototypeorwherenotkey-cond-value)
    - [SelectBuilder.prototype.orWhereNotBetween](#selectbuilderprototypeorwherenotbetweenkey-from-to-symmetric)
    - [SelectBuilder.prototype.orWhereNotIn](#selectbuilderprototypeorwherenotinkey-conds)
    - [SelectBuilder.prototype.orWhereNotNull](#selectbuilderprototypeorwherenotnullkey)
    - [SelectBuilder.prototype.orWhereNull](#selectbuilderprototypeorwherenullkey)
    - [SelectBuilder.prototype.orderBy](#selectbuilderprototypeorderbyfield-dir--asc)
    - [SelectBuilder.prototype.processFrom](#selectbuilderprototypeprocessfromfrom)
    - [SelectBuilder.prototype.processOrder](#selectbuilderprototypeprocessorderclauses)
    - [SelectBuilder.prototype.processSelect](#selectbuilderprototypeprocessselectselect)
    - [SelectBuilder.prototype.select](#selectbuilderprototypeselectfields)
    - [SelectBuilder.prototype.selectAs](#selectbuilderprototypeselectasfield-alias)
    - [SelectBuilder.prototype.sum](#selectbuilderprototypesumfield-alias)
    - [SelectBuilder.prototype.where](#selectbuilderprototypewherekey-cond-value)
    - [SelectBuilder.prototype.whereAny](#selectbuilderprototypewhereanykey-value)
    - [SelectBuilder.prototype.whereBetween](#selectbuilderprototypewherebetweenkey-from-to-symmetric)
    - [SelectBuilder.prototype.whereEq](#selectbuilderprototypewhereeqkey-value)
    - [SelectBuilder.prototype.whereExists](#selectbuilderprototypewhereexistssubquery)
    - [SelectBuilder.prototype.whereIn](#selectbuilderprototypewhereinkey-conds)
    - [SelectBuilder.prototype.whereLess](#selectbuilderprototypewherelesskey-value)
    - [SelectBuilder.prototype.whereLessEq](#selectbuilderprototypewherelesseqkey-value)
    - [SelectBuilder.prototype.whereMore](#selectbuilderprototypewheremorekey-value)
    - [SelectBuilder.prototype.whereMoreEq](#selectbuilderprototypewheremoreeqkey-value)
    - [SelectBuilder.prototype.whereNot](#selectbuilderprototypewherenotkey-cond-value)
    - [SelectBuilder.prototype.whereNotBetween](#selectbuilderprototypewherenotbetweenkey-from-to-symmetric)
    - [SelectBuilder.prototype.whereNotIn](#selectbuilderprototypewherenotinkey-conds)
    - [SelectBuilder.prototype.whereNotNull](#selectbuilderprototypewherenotnullkey)
    - [SelectBuilder.prototype.whereNull](#selectbuilderprototypewherenullkey)
  - [RawBuilder](#class-rawbuilder-extends-querybuilder)
    - [RawBuilder.prototype.constructor](#rawbuilderprototypeconstructorsqltemplate)
    - [RawBuilder.prototype.build](#rawbuilderprototypebuild)
  - [ConditionsBuilder](#class-conditionsbuilder-extends-querybuilder)
    - [ConditionsBuilder.prototype.constructor](#conditionsbuilderprototypeconstructorparams-options)
    - [ConditionsBuilder.prototype.and](#conditionsbuilderprototypeandkey-cond-value)
    - [ConditionsBuilder.prototype.andConds](#conditionsbuilderprototypeandcondsconditions)
    - [ConditionsBuilder.prototype.any](#conditionsbuilderprototypeanykey-value)
    - [ConditionsBuilder.prototype.between](#conditionsbuilderprototypebetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.build](#conditionsbuilderprototypebuild)
    - [ConditionsBuilder.prototype.exists](#conditionsbuilderprototypeexistssubquery)
    - [ConditionsBuilder.prototype.in](#conditionsbuilderprototypeinkey-conds)
    - [ConditionsBuilder.prototype.not](#conditionsbuilderprototypenotkey-cond-value)
    - [ConditionsBuilder.prototype.notBetween](#conditionsbuilderprototypenotbetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.notIn](#conditionsbuilderprototypenotinkey-conds)
    - [ConditionsBuilder.prototype.notNull](#conditionsbuilderprototypenotnullkey)
    - [ConditionsBuilder.prototype.null](#conditionsbuilderprototypenullkey)
    - [ConditionsBuilder.prototype.or](#conditionsbuilderprototypeorkey-cond-value)
    - [ConditionsBuilder.prototype.orAny](#conditionsbuilderprototypeoranykey-value)
    - [ConditionsBuilder.prototype.orBetween](#conditionsbuilderprototypeorbetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.orConds](#conditionsbuilderprototypeorcondsconditions)
    - [ConditionsBuilder.prototype.orExists](#conditionsbuilderprototypeorexistssubquery)
    - [ConditionsBuilder.prototype.orIn](#conditionsbuilderprototypeorinkey-conds)
    - [ConditionsBuilder.prototype.orNot](#conditionsbuilderprototypeornotkey-cond-value)
    - [ConditionsBuilder.prototype.orNotBetween](#conditionsbuilderprototypeornotbetweenkey-from-to-symmetric--false)
    - [ConditionsBuilder.prototype.orNotIn](#conditionsbuilderprototypeornotinkey-conds)
    - [ConditionsBuilder.prototype.orNotNull](#conditionsbuilderprototypeornotnullkey)
    - [ConditionsBuilder.prototype.orNull](#conditionsbuilderprototypeornullkey)
  - [ParamsBuilder](#class-paramsbuilder)
    - [ParamsBuilder.prototype.constructor](#paramsbuilderprototypeconstructor)
    - [ParamsBuilder.prototype.add](#paramsbuilderprototypeaddvalue-options)
    - [ParamsBuilder.prototype.build](#paramsbuilderprototypebuild)
  - [PostgresParamsBuilder](#class-postgresparamsbuilder-extends-paramsbuilder)
    - [PostgresParamsBuilder.prototype.constructor](#postgresparamsbuilderprototypeconstructor)
    - [PostgresParamsBuilder.prototype.add](#postgresparamsbuilderprototypeaddvalue-options)
    - [PostgresParamsBuilder.prototype.build](#postgresparamsbuilderprototypebuild)
  - [pg](#pghandler)

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

### class SelectBuilder extends [QueryBuilder][sql-querybuilder]

#### SelectBuilder.prototype.constructor(params, options)

#### SelectBuilder.prototype.\_addSelectClause(type, field, alias)

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

#### SelectBuilder.prototype.orWhere(key, cond, value)

#### SelectBuilder.prototype.orWhereAny(key, value)

#### SelectBuilder.prototype.orWhereBetween(key, from, to, symmetric)

#### SelectBuilder.prototype.orWhereExists(subquery)

#### SelectBuilder.prototype.orWhereIn(key, conds)

#### SelectBuilder.prototype.orWhereNot(key, cond, value)

#### SelectBuilder.prototype.orWhereNotBetween(key, from, to, symmetric)

#### SelectBuilder.prototype.orWhereNotIn(key, conds)

#### SelectBuilder.prototype.orWhereNotNull(key)

#### SelectBuilder.prototype.orWhereNull(key)

#### SelectBuilder.prototype.orderBy(field, dir = 'ASC')

#### SelectBuilder.prototype.processFrom(from)

#### SelectBuilder.prototype.processOrder(clauses)

#### SelectBuilder.prototype.processSelect(select)

#### SelectBuilder.prototype.select(...fields)

#### SelectBuilder.prototype.selectAs(field, alias)

#### SelectBuilder.prototype.sum(field, alias)

#### SelectBuilder.prototype.where(key, cond, value)

#### SelectBuilder.prototype.whereAny(key, value)

#### SelectBuilder.prototype.whereBetween(key, from, to, symmetric)

#### SelectBuilder.prototype.whereEq(key, value)

#### SelectBuilder.prototype.whereExists(subquery)

#### SelectBuilder.prototype.whereIn(key, conds)

#### SelectBuilder.prototype.whereLess(key, value)

#### SelectBuilder.prototype.whereLessEq(key, value)

#### SelectBuilder.prototype.whereMore(key, value)

#### SelectBuilder.prototype.whereMoreEq(key, value)

#### SelectBuilder.prototype.whereNot(key, cond, value)

#### SelectBuilder.prototype.whereNotBetween(key, from, to, symmetric)

#### SelectBuilder.prototype.whereNotIn(key, conds)

#### SelectBuilder.prototype.whereNotNull(key)

#### SelectBuilder.prototype.whereNull(key)

### class RawBuilder extends [QueryBuilder][sql-querybuilder]

#### RawBuilder.prototype.constructor(sqlTemplate)

- `sqlTemplate`: [`<Function>`][function]
  - `params`: [`<ParamsBuilder>`][paramsbuilder]
- _Returns:_ [`<string>`][string] query

#### RawBuilder.prototype.build()

### class ConditionsBuilder extends [QueryBuilder][sql-querybuilder]

#### ConditionsBuilder.prototype.constructor(params, options)

#### ConditionsBuilder.prototype.and(key, cond, value)

#### ConditionsBuilder.prototype.andConds(conditions)

#### ConditionsBuilder.prototype.any(key, value)

#### ConditionsBuilder.prototype.between(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.build()

#### ConditionsBuilder.prototype.exists(subquery)

#### ConditionsBuilder.prototype.in(key, conds)

#### ConditionsBuilder.prototype.not(key, cond, value)

#### ConditionsBuilder.prototype.notBetween(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.notIn(key, conds)

#### ConditionsBuilder.prototype.notNull(key)

#### ConditionsBuilder.prototype.null(key)

#### ConditionsBuilder.prototype.or(key, cond, value)

#### ConditionsBuilder.prototype.orAny(key, value)

#### ConditionsBuilder.prototype.orBetween(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.orConds(conditions)

#### ConditionsBuilder.prototype.orExists(subquery)

#### ConditionsBuilder.prototype.orIn(key, conds)

#### ConditionsBuilder.prototype.orNot(key, cond, value)

#### ConditionsBuilder.prototype.orNotBetween(key, from, to, symmetric = false)

#### ConditionsBuilder.prototype.orNotIn(key, conds)

#### ConditionsBuilder.prototype.orNotNull(key)

#### ConditionsBuilder.prototype.orNull(key)

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

[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[paramsbuilder]: ../lib/params-builder.js
[sql-querybuilder]: #class-querybuilder
