<template>
  <div padding class="q-pa-md">
    <q-table
      :rows="items"
      :columns="keys"
      :row-key="rowKey"
      :filter="filter"
      :loading="loading"
      v-model:pagination="pagination"
      :selected-rows-label="getSelectedString"
      v-model:selected="selected"
      selection="multiple"
    >
      <template #top>
        <div class="q-gutter-y-md column" style="max-width: 300px">
          <q-input
            bottom-slots
            dense
            :color="color"
            :debounce="queryStringDebounce"
            label="Query String"
            v-model="queryString"
          >
            <template #append>
              <q-icon
                v-if="filter !== ''"
                name="close"
                @click="filter = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>
          <q-input
            bottom-slots
            dense
            :debounce="filterDebounce"
            :label="filterBy"
            :color="color"
            v-model="filter"
          >
            <template #append>
              <q-icon
                v-if="filter !== ''"
                name="close"
                @click="filter = ''"
                class="cursor-pointer"
              />
              <q-icon name="filter_alt" />
            </template>
          </q-input>
          <div class="row">
            <q-btn
              class="column"
              label="Refresh"
              color="primary"
              @click="$emit('getItems', queryString)"
            />
            <q-btn
              class="column q-ml-md"
              color="positive"
              :disable="loading"
              label="Create"
              @click="$emit('clickedCreate', true)"
            />
            <q-btn
              class="column q-ml-md"
              color="negative"
              :disable="loading || !selected.length"
              label="Delete"
              @click="$emit('clickedDeleteButton', true)"
            />
          </div>
        </div>
      </template>

      <!-- Show "edit" icon on specific headers -->
      <template
        v-for="(item, i) in headerCellSlots"
        :key="item + i"
        #[item]="props"
      >
        <q-th :props="props">
          <q-icon name="edit" size="1.6em" class="q-pa-xs" />
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            :offset="[20, -5]"
          >
            Click on value to edit
          </q-tooltip>
          {{ props.col.label }}
        </q-th>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td>
            <!-- Fixes `selected` issue where the checkboxes are corrupted -->
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td v-for="key in keys" :key="key.name" :props="props">
            <div class="text-pre-wrap">{{ props.row[key.name] }}</div>
            <!-- Edit mode - renders only one of the q-popup-edit components -->
            <q-popup-edit
              v-if="key.editable && key.editable.type == 'textarea'"
              v-model="props.row[key.name]"
              :validate="(val) => props.row[key.name].length > 0"
              @save="onSave"
              @hide="onHidePopup"
              @show="onShowPopup(props.row)"
              @change="onChange(key.name)"
              v-slot="scope"
              buttons
            >
              <q-input type="textarea" v-model="scope.value" dense autofocus />
            </q-popup-edit>
            <q-popup-edit
              v-else-if="key.editable && key.editable.type == 'select'"
              v-model="props.row[key.name]"
              @save="onSave"
              @hide="onHidePopup"
              @show="onShowPopup(props.row)"
              @change="onChange(key.name)"
              @blur="onChange(key.name)"
              v-slot="scope"
              buttons
            >
              <q-select
                filled
                v-model="scope.value"
                :options="key.editable.data"
                :label="key.name"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="pagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="sm"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TableComponent",
  emits: [
    "changedQueryString",
    "getItems",
    "selectedChanged",
    "clickedDeleteButton",
    "clickedCreate",
    "clickedSet",
  ],
  props: {
    items: {
      type: Array,
      default: null,
    },
    keys: {
      type: Array,
      default: null,
    },
    rowKey: {
      type: String,
      default: "",
    },
    filterDebounce: {
      type: Number,
      default: 200,
    },
    queryStringDebounce: {
      type: Number,
      default: 500,
    },
    color: {
      type: String,
      default: "primary",
    },
    rowsPerPage: {
      type: Number,
      default: 10,
    },
    countDeletedItems: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      queryString: "",
      filter: "",
      editItem: {},
      changedProperty: "",
      selected: [],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: this.rowsPerPage,
      },
    };
  },
  watch: {
    countDeletedItems: function (v: Number, ov: Number) {
      this.selected = [];
      this.$emit("selectedChanged", this.selected);
      this.$emit("getItems", this.queryString);
    },
    queryString: function (queryString: string) {
      this.$emit("getItems", queryString);
    },
  },
  computed: {
    filterBy: function () {
      return "Filter by " + this.rowKey;
    },
    pagesNumber: function () {
      return Math.ceil(this.items.length / this.pagination.rowsPerPage);
    },
    editableColumns: function () {
      const editableColumns = this.keys
        .filter((key: any) => key.editable)
        .map((key: any) => key.name);
      console.log("Editable columns:", editableColumns);
      return editableColumns;
    },
    headerCellSlots() {
      return (this.editableColumns || []).map(
        (n: string) => "header-cell-" + n
      );
    },
  },
  methods: {
    getSelectedString() {
      this.$emit("selectedChanged", this.selected);
      return this.selected.length === 0
        ? ""
        : `${this.selected.length} record${
            this.selected.length > 1 ? "s" : ""
          } selected of ${this.items.length}`;
    },
    // Methods are ordered according to the sequence of events
    onShowPopup: function (item: any) {
      console.log("onShowPopup was triggered, Started Editing Item:", item);
      this.editItem = item;
    },
    onChange: function (name: string) {
      console.log(
        "onChange was triggered, setting this.changedProperty =",
        name
      );
      this.changedProperty = name;
    },
    onSave: function (v: any, ov: any) {
      console.log("onSave was triggered, invoking setItem on", this.editItem);
      console.log("New value:", v);
      console.log("Old value:", ov);
    },
    onHidePopup: function (e: any) {
      if (this.changedProperty != "") {
        this.$emit("clickedSet", {
          item: this.editItem,
          queryString: this.queryString,
        });
      }
      console.log(
        "onHidePopup was triggeted, Stopped Editing Item:",
        this.editItem
      );
      this.editItem = {};
      this.changedProperty = "";
    },
  },
  mounted() {
    this.$emit("getItems", this.queryString);
  },
});
</script>