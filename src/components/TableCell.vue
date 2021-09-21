<template :props="props">
  <q-input
    bottom-slots
    dense
    :debounce="debounce"
    :label="filterBy"
    :color="color"
    v-model="filter"
  >
    <template v-slot:append>
      <q-icon
        v-if="filter !== ''"
        name="close"
        @click="filter = ''"
        class="cursor-pointer"
      />
      <q-icon name="search" />
    </template>
  </q-input>
</template>

<script>
export default {
  name: "TableCell",
  props: {
    filterBy: {
      type: String,
      default: "Name",
    },
    debounce: {
      type: Number,
      default: 100,
    },
    color: {
      type: String,
      default: "primary",
    },
  },
  data: function () {
    return {
      filter: "",
    };
  },
};
</script>
