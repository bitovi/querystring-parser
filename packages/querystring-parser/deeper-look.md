# Deeper Look on the Querystring Parsing

`parse-mongo-filter.js` runs the following steps:

1. Parses the query using the `qs` package
2. Extracts the field name as well as the operator
   1. Operators are mapped to `=`, `<>`, `>`, `=>`, `<`, `<=`, `ILIKE`, `LIKE`, `IN`, `NOT IN`, `IS NULL` or `IS NOT NULL`
   2. If omitted, will default to IN for arrays or `=` otherwise
3. Extracts the values to filter on
   1. Verifies value arrays do not have mixed types
   2. Converts `\x00` to `null`
   3. Coerces boolean/number/date without awareness of field type
      1. This could be a problem if user meant a string of `true` / `false`/ `3` / date
   4. Verifies values arrays are used only with IN, NOT IN, LIKE and ILIKE operators
   5. Verifies null values are not used with `<`, `<=`, `>`, `>=`, `LIKE` and `ILIKE` operators
   6. Verifies boolean/number/date values are not used with `LIKE` and `ILIKE` operators
4. Concatenating all filters with `AND`

`parse-ibm-filter.js` runs the following steps:

1. Parses the query using the `qs` package
2. Tokenizes each filter:
   `filter=or(and(lessThan(age,'25'),greaterThan(age,'20')),equals(age,'25'))`
   becomes
   `['or', 'and', 'lessThan', 'age', ''25'', 'greaterThan', 'age', ''20'', 'equals', 'age', ''25'']`
3. Iterating the tokens from right to left:
   1. Tokens wrapped with single quotes are treated as string values
   2. Once we hit an operator, we apply it to the values to the right
   3. Concatenating all filters with `OR`
4. 🛑 GAP: Wrapping string values with single quotes removes the need to guess which type we are looking at
5. 🛑 GAP: The operators here include `and`, `or` and `not` and the ability to nest them
6. 🛑 GAP: We can compare 2 values with `greaterThan(myAge,yourAge)`
7. 🛑 GAP: The operators are slightly different than the Mongo ones, so we have case sensitive `contains`/`startsWith`/`endsWith` rather than `LIKE` and `ILIKE`, `any` instead of `IN`, etc.
