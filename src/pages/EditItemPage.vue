<template>
  <q-page>
    <h5 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h5>
    <div class="row">
      <div class="col q-pa-md" style="max-width: 500px">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <div v-for="key in keys" :key="key.name">
            <q-field
              filled
              disable
              v-if="getShowInput(key, 'label')"
              :label="key.label"
              stack-label
            >
              <template #control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ models[key.name] }}
                </div>
              </template>
            </q-field>
            <q-input
              v-else-if="getShowInput(key, 'textarea')"
              :label="key.label"
              v-model="models[key.name]"
              lazy-rules
              :rules="getRules(key)"
            />
            <q-select
              v-else-if="getShowInput(key, 'select')"
              filled
              :options="key.editable.data"
              :label="key.label"
              v-model="models[key.name]"
              lazy-rules
              :rules="getRules(key)"
            />
          </div>
          <div>
            <q-btn label="Apply" type="submit" color="primary" />
            <q-btn
              @click="onBack"
              label="Back"
              color="primary"
              flat
              class="q-ml-sm"
            />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </div>

      <div
        class="col"
        style="max-width: 500px"
        v-if="
          itemHistoryArray && itemHistoryArray.length > 1 && historyRowKey != ''
        "
      >
        <h5 class="q-pl-xl q-mt-xs q-mb-xs">
          History ({{ itemHistoryArray.length }} records)
        </h5>
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            expand-separator
            :label="itemHistory[historyRowKey]"
            :caption="historyRowKey"
            v-for="(itemHistory, i) in itemHistoryArray"
            :key="i"
          >
            <q-card v-for="(value, key) in itemHistory" :key="key">
              <q-card-section>
                <div class="row">
                  <div class="col">{{ key }}</div>
                  <div class="col">{{ value }}</div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

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
    setItem: {
      type: Function,
      default: null,
    },
    getItem: {
      type: Function,
      default: null,
    },
    rowKey: {
      type: String,
      default: "",
    },
    historyRowKey: {
      type: String,
      default: "",
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
      routeParams: ref({}),
      itemKey: ref({}),
      itemHistoryArray: ref([{}]),
    };
  },
  name: "EditItemPage",
  methods: {
    onRefresh: async function () {
      this.onReset();
    },
    onReset: async function () {
      const response = await this.getItem(this.itemKey);
      console.log("onReset response", response.item);
      if (
        response.metadata.httpStatusCode >= 200 &&
        response.metadata.httpStatusCode < 300
      ) {
        this.models = Object.assign({}, response.item);
        try {
          this.itemHistoryArray = response.history.items;
          console.log("itemHistoryArray", this.itemHistoryArray);
        } catch (e) {
          // do nothing
        }
        this.showNotifyRefreshSuccess();
      } else {
        this.showNotifyRefreshFailed(response);
      }
    },
    onBack: function () {
      this.$router.back();
    },
    onSubmit: async function () {
      console.log("Clicked submit!", this.models);
      const response = await this.setItem(this.models);
      if (
        response.$metadata.httpStatusCode >= 200 &&
        response.$metadata.httpStatusCode < 300
      ) {
        this.showNotifySuccessApply(response);
        this.onRefresh();
      } else {
        this.showNotifyFailedApply(response);
      }
      console.log(response);
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
    this.routeParams = this.$route.params;
    this.itemKey = this.routeParams[this.rowKey as keyof Object];
    await this.onReset();
  },
});
</script>
