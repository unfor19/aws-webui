# ServicesPage

## Props

| Name       | Type     | Description | Default                 |
| ---------- | -------- | ----------- | ----------------------- |
| `title`    | `String` |             | `"Services Page Title"` |
| `services` | `Array`  |             | `null`                  |

## Methods

### linkProps()

Sets the props of the link according to the route object

Example
```html
<router-link :to="{ name: service.RouteName }" custom v-slot="props">
  <q-btn
    flat
    class="column q-mr-md"
    color="primary"
    label="View"
    v-bind="linkProps(props)" <!-- Bind `href` and `to` -->
  />
</router-link>
```

**Syntax**

```typescript
linkProps(props: any): void
```

**Parameters**

- `props: any`<br/>
  RouterLink object properties

