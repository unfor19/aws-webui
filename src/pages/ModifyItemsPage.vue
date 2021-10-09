<template>
  <q-page>
    <h5 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h5>
    <q-card class="q-ma-md">
      <ManipulationComponent />
      <div padding class="q-pa-md">
        <q-form @submit="onSubmit" @reset="onReset" class="q-pb-lg">
          <div>
            <q-btn label="Apply" type="submit" color="primary" />
            <q-btn
              @click="onBack"
              label="Back"
              color="primary"
              flat
              class="q-ml-sm"
            />
            <!-- <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            /> -->
          </div>
        </q-form>
        <q-table :rows="currentItems" :columns="keys" :row-key="rowKey" dense>
          <template #body="props">
            <q-tr :props="props">
              <!-- v-for="(item, i) in currentItems" :key="i" -->
              <q-td v-for="key in keys" :key="key.name" :props="props">
                <div class="text-pre-wrap">{{ props.row[key.name] }}</div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { IModifyParams } from "../aws-webui/interfaces";
import { keysValidator } from "../aws-webui/interfaces";
import ManipulationComponent from "../components/ManipulationComponent.vue";

export default defineComponent({
  components: {
    ManipulationComponent,
  },
  props: {
    title: {
      type: String,
      default: ref(""),
    },
    keys: {
      validator: keysValidator,
      default: ref([]),
    },
    setItems: {
      type: Function,
      default: null,
    },
    rowKey: {
      type: String,
      default: ref(""),
    },
  },
  setup(props) {
    const $q = useQuasar();

    function stringifyMessage(msg: any) {
      if (typeof msg == "string") {
        return msg;
      } else if (typeof msg == "object") {
        return JSON.stringify(msg);
      }
    }

    function showNotifyRefreshSuccess() {
      $q.notify({
        message: `Refreshed`,
        html: true,
        type: "positive",
        position: "top",
        timeout: 1000,
        color: "primary",
      });
    }

    function showNotifyRefreshFailed(err: any) {
      $q.notify({
        message: `<div>Failed to refresh item</div>
        <div>Error Message:</div>
        <div>${stringifyMessage(err)}</div>`,
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

    function showNotifySuccessApply(editedItem: any) {
      $q.notify({
        message: `Successfully applied`,
        color: "green",
        type: "info",
        position: "top",
        timeout: 1500,
      });
    }

    function showNotifyFailedApply(err: any) {
      $q.notify({
        message: `<div>Failed to apply"</div>
        <div>Error Message:</div>
        <div>${stringifyMessage(err)}</div>`,
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

    return {
      showNotifySuccessApply,
      showNotifyFailedApply,
      showNotifyRefreshSuccess,
      showNotifyRefreshFailed,
    };
  },
  data: function () {
    return {
      models: ref({}),
      routeParams: ref(<IModifyParams>{}),
      itemsLists: ref([]),
    };
  },
  name: "ModifyItemsPage",
  methods: {
    onRefresh: async function () {
      this.onReset();
    },
    onReset: async function () {
      // const response = await this.getItem(this.itemKey);
      // console.log("onReset response", response.item);
      // if (
      //   response.metadata.httpStatusCode >= 200 &&
      //   response.metadata.httpStatusCode < 300
      // ) {
      //   this.models = Object.assign({}, response.item);
      //   try {
      //     this.itemHistoryArray = response.history.items;
      //     console.log("itemHistoryArray", this.itemHistoryArray);
      //   } catch (e) {
      //     // do nothing
      //   }
      //   this.showNotifyRefreshSuccess();
      // } else {
      //   this.showNotifyRefreshFailed(response);
      // }
    },
    onBack: function () {
      this.$router.back();
    },
    onSubmit: async function () {
      console.log("Clicked apply!", this.models);
      // const response = await this.setItems(this.models);
      // if (
      //   response.$metadata.httpStatusCode >= 200 &&
      //   response.$metadata.httpStatusCode < 300
      // ) {
      //   this.showNotifySuccessApply(response);
      //   this.onRefresh();
      // } else {
      //   this.showNotifyFailedApply(response);
      // }
      // console.log(response);
    },
    getShowInput: function (key: any, inputType: string): Boolean {
      let inputValue = this.models[key.name as keyof Object];
      let dependantInputValue = undefined;
      try {
        dependantInputValue = this.models[key.depends_on.name as keyof Object];
      } catch (e) {
        // do nothing
      }
      if (
        dependantInputValue == undefined &&
        !("editable" in key) &&
        inputType == "label"
      ) {
        return true;
      } else if (
        dependantInputValue == undefined &&
        key.editable.type == inputType
      ) {
        return true;
      } else if (
        key.editable.type == inputType &&
        key.depends_on.value == dependantInputValue
      ) {
        console.log(true, key, "inputvalue:", inputValue);
        return true;
      } else {
        return false;
      }
    },
    getRules: function (key: any) {
      let rules = [];
      try {
        rules = key.rules;
      } catch (e) {
        // do nothing
      }
      return rules;
    },
  },
  watch: {
    itemsLists: function (v: any) {
      console.log("itemsLists changed", v);
    },
  },
  computed: {
    currentItems: function () {
      return <any>this.itemsLists[this.itemsLists.length - 1];
    },
  },
  async mounted() {
    // Initialize item based on router path
    console.log("mounted");
    try {
      const paramsItems: Array<any> = JSON.parse(
        <string>this.$route.params.items
      );
      if (!paramsItems || paramsItems.length < 1) {
        console.log("No items were passed! Go back!");
      } else {
        this.itemsLists.push(<never>paramsItems);
        console.log("itemsLists", this.itemsLists);
        console.log("items", paramsItems);
      }
    } catch (e) {
      // do nothing
    }
  },
});
</script>
