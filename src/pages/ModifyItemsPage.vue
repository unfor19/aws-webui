<template>
  <q-page>
    <h5 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h5>
    <q-card style="max-width: 500px">
      <q-card-section dense>
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            expand-separator
            :label="rowKey"
            :caption="rowKey"
            v-for="(item, i) in items"
            :key="i"
          >
            <q-card v-for="(value, key) in item" :key="key">
              <q-card-section>
                <div class="row">
                  <div class="col">{{ key }}</div>
                  <div class="col">{{ value }}</div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
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
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { IModifyParams } from "../aws-webui/interfaces";

export default defineComponent({
  props: {
    title: {
      type: String,
      default: "",
    },
    keys: {
      type: Array,
      default: null,
    },
    setItems: {
      type: Function,
      default: null,
    },
    rowKey: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const $q = useQuasar();

    function setSessionStorage(key: string, value: any) {
      try {
        $q.sessionStorage.set(key, value);
        console.log(`Session storage was set`);
      } catch (e) {
        throw new Error(
          `SessionStorage failed to set the key "${key}"\n\n${e}`
        );
      }
    }

    async function getSessionStorage(key: string) {
      try {
        return await $q.sessionStorage.getItem(key);
      } catch (e) {
        throw new Error(
          `SessionStorage failed to get the key "${key}"\n\n${e}`
        );
      }
    }

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
      setSessionStorage,
      getSessionStorage,
    };
  },
  data: function () {
    return {
      models: ref({}),
      routeParams: ref(<IModifyParams>{}),
      items: [],
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
  async mounted() {
    // Initialize item based on router path
    const initialItemsKey = "initial-items";
    let items = <any>this.$route.params.items;
    if (!items || items.length < 1) {
      let items: any = await this.getSessionStorage(initialItemsKey);
      if (!items) {
        console.log("No items were passed! Go back!");
      } else {
        console.log("items", items);
        this.items.push(<never>items);
      }
    } else {
      console.log("items", items);
      this.items.push(<never>items);
      this.setSessionStorage("initial-items", items);
    }
  },
});
</script>
