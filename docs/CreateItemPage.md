# CreateItemPage

## Props

| Name          | Type       | Description                                                                                                               | Default                  |
| ------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `title`       | `String`   | Page Title                                                                                                                | `"CreateItemPage Title"` |
| `keys`        | `Array`    | List of keys, provided in [src/router/routes.js](src/router/routes.js) The inputs will appear according to the given keys | `ref([{}])`              |
| `create-item` | `Function` | User-defined function provided in [src/aws/${SERVICE_NAME}](src/aws)                                                      | `ref(Function)`          |

## Data

| Name     | Type      | Description                   | Initial value |
| -------- | --------- | ----------------------------- | ------------- |
| `models` | `unknown` | Reactive values of the inputs | `ref({})`     |

## Methods

### onReset()

This function is triggered on `mounted` and when user clicks the **RESET**
button
Checks if default values were provided in
[src/router/routes.js](src/router/routes.js)
If a default value exists, it is set in the input, otherwise it'll be a blank
string ""

**Syntax**

```typescript
onReset(): void
```

### onBack()

This function is triggered on user clicks the **BACK** button.
The $router object navigates to the previous page.

**Syntax**

```typescript
onBack(): void
```

### onSubmit()

This function is triggered on user clicks the **SUBMIT** button.
The `this.models` object is the "item" that is passed to `this.createItem`
function.

**Syntax**

```typescript
async onSubmit(): void
```

### getShowInput()

This function helps determining whether an input should be rendered.

**Syntax**

```typescript
getShowInput(key: any, inputType: string): Boolean
```

**Parameters**

- `key: any`<br/>
  Key object that was declared in [src/router/routes.js](src/router/routes.js)

- `inputType: string`<br/>
  Input type is used to check whether this input type exists in the VIEW.

**Return value**

Returns true if all conditions are met, otherwise returns false

### getRules()

This function gets the rules of the object from
[src/router/routes.js](src/router/routes.js).
If the `rules` property wasn't defined, it will be empty and any input will be
considered as valid.

**Syntax**

```typescript
getRules(key: any, inputType: string): void
```

**Parameters**

- `key: any`<br/>
  Key object that was declared in [src/router/routes.js](src/router/routes.js).

- `inputType: string`<br/>
  Input type is used to check whether this input type exists in the VIEW.

