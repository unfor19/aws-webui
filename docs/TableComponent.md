# TableComponent

## Props

| Name                    | Type      | Description | Default     |
| ----------------------- | --------- | ----------- | ----------- |
| `items`                 | `Array`   |             | `ref([])`   |
| `keys`                  | `unknown` |             | `ref([])`   |
| `row-key`               | `String`  |             | `""`        |
| `filter-debounce`       | `Number`  |             | `200`       |
| `query-string-debounce` | `Number`  |             | `500`       |
| `color`                 | `String`  |             | `"primary"` |
| `rows-per-page`         | `Number`  |             | `10`        |
| `count-deleted-items`   | `Number`  |             | `0`         |
| `loading`               | `Boolean` |             | `false`     |

## Data

| Name              | Type      | Description | Initial value                                                                                                                                                                                                                                 |
| ----------------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `queryString`     | `string`  |             | `""`                                                                                                                                                                                                                                          |
| `filter`          | `string`  |             | `""`                                                                                                                                                                                                                                          |
| `editItem`        | `unknown` |             | `ref({})`                                                                                                                                                                                                                                     |
| `changedProperty` | `string`  |             | `""`                                                                                                                                                                                                                                          |
| `toggleChanged`   | `boolean` |             | `false`                                                                                                                                                                                                                                       |
| `selected`        | `array`   |             | `[{}]`                                                                                                                                                                                                                                        |
| `pagination`      | `object`  |             | `{"descending":{"type":"boolean","value":false,"raw":"false","member":false},"page":{"type":"number","value":1,"raw":"1","member":false},"rowsPerPage":{"type":"Object","value":"this.rowsPerPage","raw":"this.rowsPerPage","member":false}}` |
| `selectAll`       | `boolean` |             | `false`                                                                                                                                                                                                                                       |

## Computed Properties

| Name              | Type      | Description                             |
| ----------------- | --------- | --------------------------------------- |
| `filterBy`        | `unknown` | **Dependencies:** `rowKey`              |
| `queryStringBy`   | `unknown` | **Dependencies:** `rowKey`              |
| `pagesNumber`     | `unknown` | **Dependencies:** `items`, `pagination` |
| `editableColumns` | `unknown` | **Dependencies:** `keys`                |
| `headerCellSlots` | `unknown` | **Dependencies:** `editableColumns`     |

## Events

| Name              | Description                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `selectedChanged` | <br/>**Arguments**<br/><ul><li>**`selected: array`**</li></ul>                                                 |
| `getItems`        | <br/>**Arguments**<br/><ul><li>**`queryString: string`**</li></ul>                                             |
| `clickedSet`      | <br/>**Arguments**<br/><ul><li>**`{ item: this.editItem, queryString: this.queryString, }: object`**</li></ul> |
| `clickedCancel`   | <br/>**Arguments**<br/><ul><li>**`editItem: unknown`**</li></ul>                                               |
| `clickedCreate`   |                                                                                                                |
| `clickedEdit`     |                                                                                                                |
| `clickedDelete`   | &nbsp;                                                                                                         |

## Methods

### onPullRefresh()

**Syntax**

```typescript
async onPullRefresh(done: Function): Promise
```

### getSelectedString()

**Syntax**

```typescript
getSelectedString(): unknown
```

### onShowPopup()

Methods are ordered according to the sequence of events

**Syntax**

```typescript
onShowPopup(item: any, name: string): void
```

### onCancel()

**Syntax**

```typescript
onCancel(v: any, ov: any): void
```

### onSave()

**Syntax**

```typescript
onSave(v: any, ov: any): void
```

### onHidePopup()

**Syntax**

```typescript
onHidePopup(e: any): void
```

