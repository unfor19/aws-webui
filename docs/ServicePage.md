# ServicePage

## Props

| Name                    | Type       | Description | Default                |
| ----------------------- | ---------- | ----------- | ---------------------- |
| `title`                 | `String`   |             | `"Service Page Title"` |
| `name`                  | `String`   |             | `""`                   |
| `keys`                  | `Array`    |             | `null`                 |
| `get-items`             | `Function` |             | `null`                 |
| `delete-items`          | `Function` |             | `null`                 |
| `set-item`              | `Function` |             | `null`                 |
| `row-key`               | `String`   |             | `null`                 |
| `query-string-debounce` | `Number`   |             | `200`                  |

## Data

| Name                | Type      | Description | Initial value |
| ------------------- | --------- | ----------- | ------------- |
| `items`             | `array`   |             | `[]`          |
| `selected`          | `unknown` |             | `ref([{}])`   |
| `loading`           | `boolean` |             | `false`       |
| `countDeletedItems` | `number`  |             | `0`           |

## Methods

### onGetItems()

Gets a list of items, according to queryString and stores the results in
`this.items`

**Syntax**

```typescript
async onGetItems(queryString: string): Promise
```

**Parameters**

- `queryString: string`<br/>
  The value is fetched from user input, and then passed to `this.getItems`

### onClickedCreate()

The event `clickedCreate` is emitted from the child component `TableComponent`.
This event instructs the $router to navigate to the `CreateItemPage` page of the
service.

**Syntax**

```typescript
onClickedCreate(): void
```

### onClickedEdit()

The event `clickedEdit` is emitted from the child component `TableComponent`.
This event creates a `route` object with `params`. The `params` include a
dynamic key `params[rowKey]` which represents the unique ID of the item to be
edited.
The $router pushes the new route and navigates to the `EditItemPage` and passes
the params `params[rowKey]`.

**Syntax**

```typescript
onClickedEdit(item: any): void
```

### onClickedSet()

The event `clickedEdit` is emitted from the child component `TableComponent`.
This event is triggered upon "inline-editing".

**Syntax**

```typescript
async onClickedSet(setItem: any): Promise
```

**Parameters**

- `setItem: any`<br/>
  This value is passed to the `this.setItem` function, provided in
  [src/router/routes.js](src/router/routes.js)

### onClickedCancel()

The event `clickedCancel` is emitted from the child component `TableComponent`.
This event shows a popup notification

**Syntax**

```typescript
async onClickedCancel(setItem: any): Promise
```

**Parameters**

- `setItem: any`<br/>
  Unused at the moment

### onClickedDelete()

The event `clickedDelete` is emitted from the child component `TableComponent`.
This event invokes the function `this.deleteButton` which in turn calls the
`deleteItems` function.

**Syntax**

```typescript
async onClickedDelete(): Promise
```

### onSelectedChanged()

The event `selectedChanged` is emitted from the child component
`TableComponent`.
This event sets the current data property `selected` according to the provided
selection in the child component.

**Syntax**

```typescript
onSelectedChanged(selected: [{}]): void
```

**Parameters**

- `selected: [{}]`<br/>
  List of objects that were selected in the child component

