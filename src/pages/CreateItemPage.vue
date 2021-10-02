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
  name: "CreateItemPage",
  props: {
    /**
     * Page Title
     */
    title: {
      type: String,
      default: "CreateItemPage Title",
    },
    /**
     * List of keys, provided in [src/router/routes.js](src/router/routes.js)
     * The inputs will appear according to the given keys
     */
    keys: {
      type: Array,
      default: ref([{}]),
    },
    /**
     * User-defined function provided in [src/aws/${SERVICE_NAME}](src/aws)
     * @param {any} item - The item object that will be used in the user-defined function.
     * @returns {HttpResponse} - The response is according to the service's response, it can vary.
     */
    createItem: {
      type: Function,
      default: ref(Function),
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
      /**
       * Reactive values of the inputs
       */
      models: ref({}),
    };
  },
  methods: {
    /**
     * This function is triggered on `mounted` and when user clicks the **RESET** button
     * Checks if default values were provided in [src/router/routes.js](src/router/routes.js)
     * If a default value exists, it is set in the input, otherwise it'll be a blank string ""
     */
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
    /**
     * This function is triggered on user clicks the **BACK** button.
     * The $router object navigates to the previous page.
     */
    onBack: function () {
      this.$router.back();
    },
    /**
     * This function is triggered on user clicks the **SUBMIT** button.
     * The `this.models` object is the "item" that is passed to `this.createItem` function.
     */
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
    /**
     * This function helps determining whether an input should be rendered.
     *
     * @param {any} key - Key object that was declared in [src/router/routes.js](src/router/routes.js)
     * @param {string} inputType - Input type is used to check whether this input type exists in the VIEW.
     * @returns {Boolean} - Returns true if all conditions are met, otherwise returns false
     */
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

    /**
     * This function gets the rules of the object from [src/router/routes.js](src/router/routes.js).
     * If the `rules` property wasn't defined, it will be empty and any input will be considered as valid.
     *
     * @param {any} key - Key object that was declared in [src/router/routes.js](src/router/routes.js).
     * @param {string} inputType - Input type is used to check whether this input type exists in the VIEW.
     */
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
  /**
   * Invoked `this.onReset` to initialize default values
   */
  mounted() {
    this.onReset();
  },
});
</script>
