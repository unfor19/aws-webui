<template>
  <q-page padding>
    <TableLayout
      :title="title"
      :keys="keys"
      :items="items"
      :loading="loading"
      :setItem="setItem"
      :getItems="getItems"
      rowKey="Name"
    />
  </q-page>
</template>

<script>
import TableLayout from "../layouts/TableLayout.vue";
import { ssmGetParametersByPath } from "../aws/ssm/get";
import { ssmSetParameter } from "../aws/ssm/set";

export default {
  name: "SsmParameters",
  data: function () {
    return {
      keys: [
        {
          name: "Name",
          align: "left",
          field: (item) => item.Name,
          format: (val) => `${val}`,
          sortable: true,
          label: "Name",
        },
        {
          name: "Value",
          field: "Value",
          label: "Value",
          sortable: true,
          editable: {
            type: "textarea",
          },
        },
        {
          name: "Type",
          field: "Type",
          label: "Type",
          sortable: true,
          editable: {
            type: "select",
            data: ["String", "SecureString", "StringList"],
          },
        },
        {
          name: "LastModifiedDate",
          field: "LastModifiedDate",
          label: "LastModifiedDate",
          format: (val) => `${val}`,
          sortable: true,
        },
        { name: "Version", field: "Version", label: "Version" },
      ],
      items: [],
      loading: true,
      title: "SsmParameters",
    };
  },
  components: {
    TableLayout,
  },
  methods: {
    async getItems() {
      this.loading = true;
      try {
        var params = {
          Path: "/",
          MaxResults: "10",
          Recursive: true,
          WithDecryption: true,
        };
        console.log("getItems params:", params);
        const data = await ssmGetParametersByPath(params);
        this.items = data.items;
        console.log("Keys:", this.keys);
        this.loading = false;
      } catch (err) {
        console.log("get error", err);
      }
    },
    async setItem(item, v, ov) {
      try {
        var params = {
          Name: item.Name,
          Value: item.Value,
          Type: item.Type,
          Overwrite: true,
        };
        params[item._changedProperty] = v;
        console.log("setItem params:", params);
        const data = await ssmSetParameter(params);
        console.log("Response data: ", data);
      } catch (err) {
        console.log("get error", err);
      }
    },
  },
  mounted() {
    this.getItems();
  },
};
</script>
