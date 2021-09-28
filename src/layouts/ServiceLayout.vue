<template>
  <q-layout>
    <h5 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h5>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "ServiceLayout",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data: function () {
    return {};
  },
};
</script>
