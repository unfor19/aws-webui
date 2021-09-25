<template>
  <q-layout>
    <h5 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h5>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "ServicePage",
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
