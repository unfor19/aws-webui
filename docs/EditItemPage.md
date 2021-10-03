# EditItemPage

## Props

| Name              | Type       | Description | Default |
| ----------------- | ---------- | ----------- | ------- |
| `title`           | `String`   |             | `""`    |
| `keys`            | `Array`    |             | `null`  |
| `set-item`        | `Function` |             | `null`  |
| `get-item`        | `Function` |             | `null`  |
| `row-key`         | `String`   |             | `""`    |
| `history-row-key` | `String`   |             | `""`    |

## Data

| Name               | Type      | Description | Initial value |
| ------------------ | --------- | ----------- | ------------- |
| `models`           | `unknown` |             | `ref({})`     |
| `routeParams`      | `unknown` |             | `ref({})`     |
| `itemKey`          | `unknown` |             | `ref({})`     |
| `itemHistoryArray` | `unknown` |             | `ref([{}])`   |
| `showHistory`      | `unknown` |             | `ref(false)`  |

## Computed Properties

| Name              | Type      | Description                                           |
| ----------------- | --------- | ----------------------------------------------------- |
| `historyDisabled` | `unknown` | **Dependencies:** `itemHistoryArray`, `historyRowKey` |

## Methods

### onRefresh()

**Syntax**

```typescript
async onRefresh(): void
```

### onReset()

**Syntax**

```typescript
async onReset(): void
```

### onBack()

**Syntax**

```typescript
onBack(): void
```

### onSubmit()

**Syntax**

```typescript
async onSubmit(): void
```

### getShowInput()

**Syntax**

```typescript
getShowInput(key: any, inputType: string): void
```

### getRules()

**Syntax**

```typescript
getRules(key: any): void
```

