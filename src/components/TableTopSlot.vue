<template v-slot:top>
  <!-- <q-btn color="primary" :disable="loading" label="Add row" @click="addRow" />
        <q-btn class="q-ml-sm" color="primary" :disable="loading" label="Remove row" @click="removeRow" />
        <q-space /> -->
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
  name: "TableTopSlot",
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
