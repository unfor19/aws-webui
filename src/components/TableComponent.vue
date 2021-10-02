<template>
  <div padding class="q-pa-md">
    <q-pull-to-refresh @refresh="onPullRefresh">
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
          <div class="q-gutter-y-md" style="max-width: 500px">
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
            <div class="row q-gutter-md">
              <q-btn
                color="positive"
                class="col"
                :disable="loading"
                label="Create"
                @click="$emit('clickedCreate', true)"
              />
              <q-btn
                color="primary"
                class="col"
                :disable="loading || selected.length != 1"
                label="Edit"
                @click="$emit('clickedEdit', selected[0])"
              />
              <q-btn
                color="negative"
                class="col"
                :disable="loading || !selected.length"
                label="Delete"
                @click="$emit('clickedDelete', true)"
              />
            </div>
            <div class="row q-gutter-md">
              <div class="col q-mr-xs">
                <div>
                  <q-checkbox
                    v-model="selectAll"
                    label="Select All"
                    @click="getSelectedString"
                  />
                </div>
              </div>
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
                @show="onShowPopup(props.row, key.name)"
                @cancel="onCancel"
                v-slot="scope"
                buttons
              >
                <q-input
                  :label="key.label"
                  type="textarea"
                  v-model="scope.value"
                  dense
                  autofocus
                />
              </q-popup-edit>
              <q-popup-edit
                v-else-if="key.editable && key.editable.type == 'select'"
                v-model="props.row[key.name]"
                @save="onSave"
                @hide="onHidePopup"
                @show="onShowPopup(props.row, key.name)"
                @cancel="onCancel"
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
    </q-pull-to-refresh>

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
import { defineComponent, ref } from "vue";
import { keysValidator, IKey, TKey } from "../aws-webui/interfaces";

export default defineComponent({
  name: "TableComponent",
  emits: [
    "changedQueryString",
    "getItems",
    "selectedChanged",
    "clickedDelete",
    "clickedCreate",
    "clickedEdit",
    "clickedSet",
    "clickedCancel",
  ],
  props: {
    items: {
      type: Array,
      default: ref([]),
    },
    keys: {
      validator: keysValidator,
      default: ref([]),
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
      editItem: ref({}),
      changedProperty: "",
      toggleChanged: false,
      selected: [{}],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: this.rowsPerPage,
      },
      selectAll: false,
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
    selectAll: function (v: Boolean, ov: Boolean) {
      if (v) {
        this.selected = <[{}]>this.items;
      } else {
        this.selected = [];
      }
      this.$emit("selectedChanged", this.selected);
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
      const keys = this.keys as unknown as IKey[];
      const editableColumns = keys
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
    async onPullRefresh(done: Function) {
      this.$emit("getItems", this.queryString);
      done();
    },
    getSelectedString() {
      this.$emit("selectedChanged", this.selected);
      return this.selected.length === 0
        ? ""
        : `${this.selected.length} record${
            this.selected.length > 1 ? "s" : ""
          } selected of ${this.items.length}`;
    },
    // Methods are ordered according to the sequence of events
    onShowPopup: function (item: any, name: string) {
      console.log("onShowPopup was triggered, Started Editing Item:", item);
      this.editItem = item;
      this.selected = [item];
      this.changedProperty = name;
    },
    onCancel(v: any, ov: any) {
      console.log("onCancel was triggered");
      this.changedProperty = "";
    },
    onSave: function (v: any, ov: any) {
      console.log("onSave was triggered, invoking setItem on", this.editItem);
      console.log("New value:", v);
      console.log("Old value:", ov);

      if (v != ov) {
        let tempEditItem: any = {};
        Object.assign(tempEditItem, this.editItem);
        console.log("tempedit item", tempEditItem);
        tempEditItem[this.changedProperty] = v;
        this.editItem = tempEditItem;
        this.$emit("clickedSet", {
          item: this.editItem,
          queryString: this.queryString,
        });
        this.toggleChanged = true;
      }
    },
    onHidePopup: function (e: any) {
      if (this.toggleChanged == false) {
        this.$emit("clickedCancel", this.editItem);
      }
      console.log(
        "onHidePopup was triggeted, Stopped Editing Item:",
        this.editItem
      );
      this.toggleChanged = false;
      this.selected = [];
      this.editItem = {};
      this.changedProperty = "";
    },
  },
  mounted() {
    this.selected = [];
    this.$emit("getItems", this.queryString);
  },
});
</script>
