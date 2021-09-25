<template>
  <q-page padding>
    <table-layout
      :keys="keys"
      :items="items"
      :delete-items="deleteItems"
      :get-item="getItem"
      :set-item="setItem"
      :get-items="getItems"
      :row-key="rowKey"
    />
  </q-page>
</template>

<script>
import TableLayout from "../layouts/TableLayout.vue";
import { ssmDeleteParametersByNames } from "../aws/ssm/delete";
import { ssmGetParametersByPath, ssmGetParameterHistory } from "../aws/ssm/get";
import { ssmSetParameter } from "../aws/ssm/set";

export default {
  name: "SsmParameters",
  data: function () {
    return {
      rowKey: "Name",
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
    };
  },
  components: {
    TableLayout,
  },
  methods: {
    async deleteItems(items) {
      try {
        const params = {
          Names: items.map((item) => item.Name),
        };
        console.log("deleteItems params:", params);
        const response = await ssmDeleteParametersByNames(params);
        return response;
      } catch (err) {
        console.log("deleteItems error", err);
        return err;
      }
    },
    async getItem(itemName) {
      try {
        var params = {
          Name: itemName,
          WithDecryption: true,
        };
        console.log("getItem params:", params);
        const data = await ssmGetParameterHistory(params);
        console.log("Data:", data);
      } catch {
        console.log("get item error", err);
      }
    },
    async getItems(queryString) {
      try {
        var params = {
          Path: queryString,
          MaxResults: "10",
          Recursive: true,
          WithDecryption: true,
        };
        console.log("getItems params:", params);
        const data = await ssmGetParametersByPath(params);
        this.items = data.items;
        console.log("Keys:", this.keys);
      } catch (err) {
        console.log("get itemS error", err);
      }
    },
    async setItem(item, v, ov) {
      try {
        var params = {
          Name: item.Name,
          Value: item.Value,
          Type: item.Type,
          Overwrite: true,
          Description: item.Description,
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
};
</script>
