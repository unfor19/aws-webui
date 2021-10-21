<template>
  <div class="row">
    <div class="col q-pa-md">
      <q-select v-model="givenStr" :options="keys" label="Select Key" />
    </div>
    <div class="col q-pa-md">
      <q-input v-model="findStr" type="text" />
    </div>
    <div class="col q-pa-md">
      <q-input v-model="replaceWithStr" type="text" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { keysValidator } from "../aws-webui/interfaces";

export default defineComponent({
  name: "ManipulationFindAndReplaceComponent",
  props: {
    rowKey: {
      type: String,
      default: ref(""),
    },
    keys: {
      validator: keysValidator,
      default: ref([]),
    },
  },
  methods: {
    findAndReplace: function (
      givenStr: string,
      findStr: string,
      replaceWithStr: string
    ) {
      return givenStr.replace(findStr, replaceWithStr);
    },
  },
  data() {
    return {
      givenStr: ref(""),
      findStr: ref(""),
      replaceWithStr: ref(""),
    };
  },
});
</script>
