<template>
  <div class="q-pa-md">
    <q-table
      :rows="items"
      :columns="keys"
      :row-key="rowKey"
      :filter="filter"
      :loading="loading"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :selected-rows-label="getSelectedString"
      selection="multiple"
    >
      <template #top>
        <div class="q-gutter-y-md column" style="max-width: 300px">
          <q-input
            bottom-slots
            dense
            :color="color"
            :debounce="queryStringDebounce"
            v-model="queryString"
            label="Query String"
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
            :debounce="debounce"
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
            <router-link :to="{ name: 'create' }" custom v-slot="props">
              <q-btn
                class="column q-mr-md"
                color="primary"
                :disable="loading"
                label="Create"
                v-bind="linkProps(props)"
              />
            </router-link>

            <q-btn
              class="column q-ml-md"
              color="negative"
              :disable="loading || !selected.length"
              label="Delete"
              @click="deleteBtn(selected, rowKey)"
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

<script>
import { useQuasar } from "quasar";

export default {
  setup: function () {
    const $q = useQuasar();
    function showNotifyCancelled() {
      $q.notify({
        message: "Cancelled",
        color: "grey",
        type: "info",
        position: "top",
        timeout: 1500,
      });
    }

    function showNotifySuccessDelete(selectedLength) {
      $q.notify({
        message: `Successfully deleted ${selectedLength} ${
          selectedLength > 1 ? "items" : "item"
        }`,
        color: "green",
        type: "info",
        position: "top",
        timeout: 1500,
      });
    }

    function showNotifyFailedDelete(selectedLength, err) {
      $q.notify({
        message: `<div>Failed to delete ${selectedLength} ${
          selectedLength > 1 ? "items" : "item"
        }</div>
        <div>Error Message:</div>
        <div>${JSON.stringify(err)}</div>`,
        html: true,
        type: "negative",
        position: "top",
        timeout: 60000,
        actions: [
          {
            label: "Dismiss",
            color: "white",
            handler: () => {
              /* ... */
            },
          },
        ],
      });
    }

    function deleteBtn(selected, rowKey) {
      console.log("Row Key:", rowKey);
      function generateUnorderedList(selected, rowKey) {
        const m = selected.map((item) => item[rowKey]);
        const tmpl = "<li>ROWKEY_VALUE</li>";
        var unorderedList = "";
        m.forEach((value, i) => {
          unorderedList += tmpl.replace("ROWKEY_VALUE", value);
        });
        return unorderedList;
      }

      $q.dialog({
        title: "Confirm",
        message: `
        <div>Are you sure you want to delete the following items?</div>
        <div>
          <ul>
            ${generateUnorderedList(selected, rowKey)}
          </ul>
        </div>
        `,
        html: true,
        ok: {
          push: true,
          color: "negative",
        },
        cancel: {
          push: true,
          color: "grey",
        },
        persistent: false,
      })
        .onOk(async () => {
          const response = await this.deleteItemWrapper();
          await this.getItemsWrapper();
          console.log(
            "deleteItemWrapper response:",
            response.$metadata.httpStatusCode
          );
          if (
            response.$metadata.httpStatusCode &&
            response.$metadata.httpStatusCode >= 200 &&
            response.$metadata.httpStatusCode < 300
          ) {
            showNotifySuccessDelete(this.selected.length);
          } else {
            showNotifyFailedDelete(this.selected.length, response.$metadata);
          }

          this.selected = [];
        })
        .onCancel(() => {
          showNotifyCancelled();
        });
    }
    return { deleteBtn };
  },
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
    rowKey: {
      type: String,
      default: "",
    },
    // Functions
    deleteItems: {
      type: Function,
      default: () => {},
    },
    setItem: {
      type: Function,
      default: () => {},
    },
    getItems: {
      type: Function,
      default: () => {},
    },
    getItem: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    editItem: function (v, ov) {
      this.getItemsWrapper();
    },
    queryString: function (v, ov) {
      this.getItemsWrapper();
    },
    selected: function (v, ov) {
      console.log("Selected:", this.selected);
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
      selected: [],
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
    linkClick: function (e, go) {
      e.preventDefault(); // we choose when we navigate

      // console.log('triggering navigation in 3s')
      setTimeout(() => {
        // console.log('navigating as promised 3s ago')
        go();
      }, 3000);
    },
    linkProps: function ({ route }) {
      const props = {
        to: route.path,
      };
      return props;
    },
    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.selected.length} record${
            this.selected.length > 1 ? "s" : ""
          } selected of ${this.items.length}`;
    },
    deleteItemWrapper: async function () {
      this.loading = true;
      const response = await this.deleteItems(this.selected);
      console.log("Response:", response);
      this.loading = false;
      return response;
    },
    getItemsWrapper: async function () {
      this.loading = true;
      await this.getItems(this.queryString);
      this.loading = false;
      return true;
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
