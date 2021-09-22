<template>
  <div class="q-pa-md">
    <q-table
      :rows="items"
      :columns="keys"
      :row-key="rowKey"
      :filter="filter"
      :loading="loading"
      v-model:pagination="pagination"
    >
      <template v-slot:top>
        <div class="q-gutter-y-md column" style="max-width: 300px">
          <q-input
            bottom-slots
            dense
            :color="color"
            :debounce="queryStringDebounce"
            v-model="queryString"
            label="Query String"
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
              <q-icon name="filter_alt" />
            </template>
          </q-input>
        </div>
      </template>

      <!-- Show "edit" icon on specific headers -->
      <template
        v-for="(item, i) in headerCellSlots"
        :key="item + i"
        v-slot:[item]="props"
      >
        <q-th :props="props">
          <q-icon name="edit" size="1.6em" class="q-pa-xs" />
          {{ props.col.label }}
        </q-th>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
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

<script>
export default {
  name: "TableLayout",
  props: {
    title: {
      type: String,
      default: "Page Title",
    },
    // TopHeaderSlot
    debounce: {
      type: Number,
      default: 100,
    },
    color: {
      type: String,
      default: "primary",
    },
    rowsPerPage: {
      type: Number,
      default: 10,
    },
    queryStringDebounce: {
      type: Number,
      default: 1000,
    },
    // Body
    keys: {
      type: Array[Object],
      default: [],
    },
    items: {
      type: Array[Object],
      default: [],
    },
    rowKey: String,
    // Functions
    setItem: Function,
    getItems: Function,
    getItem: Function,
  },
  watch: {
    editItem: function (v, ov) {
      this.getItemsWrapper();
    },
    queryString: function (v, ov) {
      this.getItemsWrapper();
    },
  },
  data: function () {
    return {
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: this.rowsPerPage,
      },
      filter: "",
      editItem: {},
      viewItem: {},
      loading: false,
      queryString: "",
    };
  },
  computed: {
    filterBy: function () {
      return "Filter by " + this.rowKey;
    },
    editableColumns: function () {
      const editableColumns = this.keys
        .filter((key) => key.editable)
        .map((key) => key.name);
      console.log("Editable columns:", editableColumns);
      return editableColumns;
    },
    pagesNumber: function () {
      return Math.ceil(this.items.length / this.pagination.rowsPerPage);
    },
    headerCellSlots() {
      return (this.editableColumns || []).map((n) => "header-cell-" + n);
    },
  },
  methods: {
    getItemsWrapper: async function () {
      this.loading = true;
      await this.getItems(this.queryString);
      this.loading = false;
    },
    // Methods are ordered according to the sequence of events
    onShowPopup: function (item) {
      console.log("onShowPopup was triggered, Started Editing Item:", item);
      this.editItem = item;
    },
    onChange: function (name) {
      console.log(
        "onChange was triggered, setting editItem._changedProperty =",
        name
      );
      this.editItem._changedProperty = name;
    },
    onSave: function (v, ov) {
      console.log(
        "onSave was triggered, invoking setItem on",
        this.editItem.Name
      );
      this.setItem(this.editItem, v, ov);
    },
    onHidePopup: function (e) {
      console.log(
        "onHidePopup was triggeted, Stopped Editing Item:",
        this.editItem.Name
      );
      this.editItem = {};
    },
  },
  async mounted() {
    await this.getItemsWrapper();
    console.log("Number of items: ", this.items.length);
    console.log("Items Array:", this.items);
  },
};
</script>
