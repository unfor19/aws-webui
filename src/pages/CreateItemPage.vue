<template>
  <q-page>
    <h5 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h5>
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <div v-for="key in keys" :key="key.name">
          <q-input
            v-if="getShowInput(key, 'textarea')"
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
          <q-btn label="Apply" type="submit" color="positive" />
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
    createItem: {
      type: Function,
      default: null,
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
    };
  },
  data: function () {
    return {
      models: ref({}),
    };
  },
  name: "CreateItemPage",
  methods: {
    onReset: function () {
      let defaultModels: any = {};
      this.keys.forEach((key: any) => {
        try {
          defaultModels[key.name] = key.editable.default;
        } catch (e) {
          // set empty string on error
          defaultModels[key.name] = "";
        }
      });
      this.models = defaultModels;
    },
    onBack: function () {
      this.$router.back();
    },
    onSubmit: async function () {
      console.log("Clicked submit!", this.models);
      const response = await this.createItem(this.models);
      if (
        response.$metadata.httpStatusCode >= 200 &&
        response.$metadata.httpStatusCode < 300
      ) {
        this.showNotifySuccessApply(response);
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

      if (dependantInputValue == undefined && key.editable.type == inputType) {
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
      // :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      return rules;
    },
  },
  mounted() {
    // Initialize default values
    this.onReset();
  },
});
</script>