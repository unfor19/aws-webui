<template>
  <q-page padding>
    <TableLayout
      :title="title"
      :keys="keys"
      :items="items"
      :loading="loading"
      rowKey="Name"
    />
  </q-page>
</template>

<script>
import TableLayout from "../layouts/TableLayout.vue";
import { ssmGetParametersByPath } from "../aws/ssm/get";

import mitt from "mitt";

const emitter = mitt();

export default {
  name: "SsmParameters",
  data: function () {
    return {
      keys: [],
      items: [],
      loading: true,
      title: "SsmParameters",
    };
  },
  components: {
    TableLayout,
  },
  methods: {
    async get() {
      this.loading = true;
      try {
        var params = {
          Path: "/",
          MaxResults: "10",
          Recursive: true,
          WithDecryption: true,
        };
        const data = await ssmGetParametersByPath(params);
        this.items = data.Items;
        this.keys = data.Keys;
        this.loading = false;
      } catch (err) {
        console.log("get error", err);
      }
    },
  },
  mounted() {
    this.get();
    emitter.on("save", (data) => {
      console.log("Custom event triggered!", data);
    });
  },
};
</script>
