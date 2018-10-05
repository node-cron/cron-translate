# cron-translate

Translate english to cron expressions

## Usage

Install `cron-translate`

```
npm install --save cron-translate
```

```js
const cronTranslate = require('cron-translate');

let cron = cronTranslate.toCron('every minute');
```

## Syntax

`cron-translate` allows to use some fields and operators to compose the expressions that are translatable to cron expressions

### Fields

The allowed fields are `second`, `minute`, `hour`, `day`, `month`, `week day`, or the plurals `seconds`, `minutes`, `hours`, `days`, `months`, `week days`.

### Operators

 - **every** operator may be used in three ways:
    - `every <field>`: sets the field value to `*`. e.g: `every day`;
    - `every <value> <field>`: sets the field value to `*/<value>`. e.g: `every 10 minutes`;
    - `every <field> <value>`: sets the field value to `<value>`. e.g: `every hour 2`;
 - **on** operator may be use as the `every <field> value`:
    - `on <field> <value>`: sets the field value to `<value>`. e.g: `on hour 2`;
 - **from to** operator is used to create ranges.
    - `from <field> <value1> to <value2>`: It sets the field value `<value1>-<value2>`. e.g: `from minute 2 to 10`;

### Values

The allowed values are:
 - **Numbers**: for all fields.
 - **Names**: for months and week days, full names and abreviations are allowed. e.g: `monday` and `mon` are the same.


## Examples

### Every usage

- `every second` is converted to `* * * * * *`;
- `every minute` is converted to `0 * * * * *`;
- `every hour` is converted to `0 0 * * * *`;
- `every sunday` is converted to `0 0 0 * * sunday`; 
- `every january` is converted to `0 0 0 * january *`; 
- `every 2 minutes` is converted to `0 */2 * * * *`;
- `every day 10` is converted to `0 0 0 10 * *`;

### On usage

- `on minute 2` is converted to `0 2 * * * *`;
- `on sat` is converted to `0 0 0 * * sat`;

### From to usage
- `from minute 2 to 30` is converted to `0 2-30 * * * *`;

### Combining expressions

The expressions may be combined to create complex cron expresions:

- `every 10 minutes from hour 2 to 8` is converted to `0 */10 2-8 * * *`;
- `every monday on hour 2 from minute 10 to 20` is converted to `0 10-20 2 * * monday`;
