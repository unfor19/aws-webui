<template>
  <div class="q-pa-md">
    <q-table
      :title="title"
      :rows="items"
      :columns="keys"
      :row-key="rowKey"
      :filter="filter"
      v-model:pagination="pagination"
      hide-pagination
    >
      <template v-slot:top>
        <!-- <q-btn color="primary" :disable="loading" label="Add row" @click="addRow" />
        <q-btn class="q-ml-sm" color="primary" :disable="loading" label="Remove row" @click="removeRow" />
        <q-space /> -->
        <q-input
          bottom-slots
          dense
          debounce="100"
          label="Filter By Name"
          color="primary"
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
      <template v-slot:header-cell-Value="props">
        <q-th :props="props">
          <q-icon name="edit" size="1.6em" class="q-pa-xs" />
          {{ props.col.label }}
        </q-th>
      </template>
      <template v-slot:header-cell-Type="props">
        <q-th :props="props">
          <q-icon name="edit" size="1.6em" class="q-pa-xs" />
          {{ props.col.label }}
        </q-th>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="Name" :props="props">
            {{ props.row.Name }}
          </q-td>
          <q-td key="Value" :props="props">
            <div class="text-pre-wrap">{{ props.row.Value }}</div>
            <q-popup-edit
              v-model="props.row.Value"
              :validate="(val) => props.row.Value.length > 0"
              @save="onSave"
              @hide="onHidePopup"
              @show="onShowPopup(props.row)"
              @change="onChange('Value')"
              v-slot="scope"
              buttons
            >
              <q-input type="textarea" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="Type" :props="props">
            <div class="text-pre-wrap">{{ props.row.Type }}</div>
            <q-popup-edit
              v-model="props.row.Type"
              @save="onSave"
              @hide="onHidePopup"
              @show="onShowPopup(props.row)"
              @change="onChange('Type')"
              @blur="onChange('Type')"
              v-slot="scope"
              buttons
            >
              <q-select
                filled
                v-model="scope.value"
                :options="itemTypes"
                label="Type"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="LastModifiedDate" :props="props">
            <div class="text-pre-wrap">{{ props.row.LastModifiedDate }}</div>
          </q-td>
          <q-td key="Version" :props="props">
            <div class="text-pre-wrap">{{ props.row.Version }}</div>
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
    msg: String,
    keys: Array,
    items: Array,
    loading: Boolean,
    title: String,
    rowKey: String,
    setItem: Function,
    getItems: Function,
  },
  watch: {
    editItem: function (v, ov) {
      this.getItems();
    },
  },
  data: function () {
    return {
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      filter: "",
      editItem: {},
      itemTypes: ["String", "SecureString", "StringList"],
    };
  },
  computed: {
    pagesNumber: function () {
      return Math.ceil(this.items.length / this.pagination.rowsPerPage);
    },
  },
  methods: {
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.loader {
  font-size: 10px;
  margin: 50px auto;
  text-indent: -9999em;
  width: 11em;
  height: 11em;
  border-radius: 50%;
  background: #000000;
  background: -moz-linear-gradient(left, #000000 10%, rgba(0, 0, 0, 0) 42%);
  background: -webkit-linear-gradient(left, #000000 10%, rgba(0, 0, 0, 0) 42%);
  background: -o-linear-gradient(left, #000000 10%, rgba(0, 0, 0, 0) 42%);
  background: -ms-linear-gradient(left, #000000 10%, rgba(0, 0, 0, 0) 42%);
  background: linear-gradient(to right, #000000 10%, rgba(0, 0, 0, 0) 42%);
  position: relative;
  -webkit-animation: load3 1.4s infinite linear;
  animation: load3 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.loader:before {
  width: 50%;
  height: 50%;
  background: #000000;
  border-radius: 100% 0 0 0;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
}
.loader:after {
  background: #ffffff;
  width: 75%;
  height: 75%;
  border-radius: 50%;
  content: "";
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
@-webkit-keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
