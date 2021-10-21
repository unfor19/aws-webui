<template>
  <q-page>
    <h5 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h5>
    <q-card class="q-ma-md">
      <span v-for="manipulation in currentManipulation" :key="manipulation.id">
        <span>{{ manipulation.id }}, </span>
      </span>
      <q-form @submit="onAdd" class="q-pa-md">
        <div class="q-pa-md">
          <q-option-group
            v-model="manipulationSelected"
            :options="manipulationOptions"
            color="primary"
          />
        </div>
        <q-btn label="Add" type="submit" color="primary" />
      </q-form>
      <draggable
        v-model="groupsWithItems"
        group="children"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
        tag="div"
        class="list-group"
      >
        <template #item="{ element }">
          <q-item v-if="element.id" class="list-group-item">
            <q-card>
              <q-card-section>
                <div class="cursor-pointer">
                  <div class="row items-start">
                    <q-item class="q-pa-md">
                      <q-icon name="drag_indicator" />
                    </q-item>
                    <q-item class="q-pa-md">
                      <span>{{ element.manipulation }} </span>
                    </q-item>
                    <q-item class="q-pa-md">
                      <ManipulationFindAndReplaceComponent
                        :keys="filteredKeys"
                        :row-key="rowKey"
                      />
                    </q-item>
                    <q-item class="q-pa-md">
                      <q-btn
                        label="Remove"
                        @click="onRemove(element.id)"
                        color="negative"
                      />
                    </q-item>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-item>
        </template>
      </draggable>
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
import draggable from "vuedraggable";
import ManipulationFindAndReplaceComponent from "../components/ManipulationFindAndReplaceComponent.vue";

export default defineComponent({
  components: {
    ManipulationFindAndReplaceComponent,
    draggable,
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
      drag: ref(false),
      initialManipulation: {
        id: 1,
        manipulation: "initial",
      },
      groupsWithItems: ref([{}]),
      manipulationSelected: ref("findAndReplace"),
      manipulationOptions: [
        {
          label: "Find And Replace",
          value: "findAndReplace",
        },
        {
          label: "Another Manipulation",
          value: "anotherManipulation",
        },
      ],
    };
  },
  name: "ModifyItemsPage",
  methods: {
    getMaxItemId: function () {
      const myArray = this.currentManipulation.sort(function (a, b) {
        return a.id - b.id;
      });
      return this.currentManipulation[this.currentManipulation.length - 1].id;
    },
    onRemove: function (id: number) {
      this.groupsWithItems = this.groupsWithItems.filter(
        (obj: any) => obj.id !== id
      );
    },
    onRefresh: async function () {
      this.onReset();
    },
    onAdd: function () {
      this.groupsWithItems.push({
        id: this.getMaxItemId() + 1,
        manipulation: this.manipulationSelected,
      });
    },
    onClickedCreate: function (e: any) {},
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
    filteredKeys() {
      let k = <any[]>(<unknown>this.keys);
      return <any[]>(<unknown>k.filter((obj: any) => obj.name != this.rowKey));
    },
    currentItems: function () {
      return <any>this.itemsLists[this.itemsLists.length - 1];
    },
    currentManipulation: function () {
      return Array.prototype.concat(
        [this.initialManipulation],
        this.groupsWithItems.filter((x) => "id" in x)
      );
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
