# ServicesPage

## Props

| Name       | Type                                                                                            | Description                                | Default                 |
| ---------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------- |
| `title`    | `String`                                                                                        | Page title                                 | `"Services Page Title"` |
| `services` | [`IService[]`](https://github.com/unfor19/aws-webui/blob/master/src/aws-webui/interfaces.ts#L1) | List of services that will appear in cards | `[{}]`                  |

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
linkProps(props: any): props
```

**Parameters**

- `props: any`<br/>
  RouterLink object properties

