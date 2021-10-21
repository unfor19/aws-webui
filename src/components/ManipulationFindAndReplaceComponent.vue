<template>
  <q-item class="list-group-item">
    <div class="row items-start">
      <q-input v-model="findStr" type="textarea" />
      <q-input v-model="replaceWithStr" type="textarea" />
    </div>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ManipulationFindAndReplaceComponent",
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
      findStr: ref(""),
      replaceWithStr: ref(""),
    };
  },
});
</script>
