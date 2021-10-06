<template>
  <q-page>
    <h5 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h5>
    <div class="row"></div>
    <table-component
      @get-items="onGetItems"
      @selected-changed="onSelectedChanged"
      @clicked-delete="onClickedDelete"
      @clicked-edit="onClickedEdit"
      @clicked-create="onClickedCreate"
      @clicked-set="onClickedSet"
      @clicked-cancel="onClickedCancel"
      @clicked-modify="onClickedModify"
      :items="items"
      :keys="keys"
      :row-key="rowKey"
      :loading="loading"
      :query-string-debounce="queryStringDebounce"
      :count-deleted-items="countDeletedItems"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TableComponent from "../components/TableComponent.vue";
import { IModifyParams } from "../aws-webui/interfaces";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "ServicePage",
  components: {
    TableComponent,
  },
  props: {
    title: {
      type: String,
      default: "Service Page Title",
    },
    name: {
      type: String,
      default: "",
    },
    keys: {
      type: Array,
      default: null,
    },
    getItems: {
      type: Function,
      default: null,
    },
    deleteItems: {
      type: Function,
      default: null,
    },
    setItem: {
      type: Function,
      default: null,
    },
    rowKey: {
      type: String,
      default: null,
    },
    queryStringDebounce: {
      type: Number,
      default: 200,
    },
  },
  data: function () {
    return {
      items: [],
      selected: ref([{}]),
      loading: false,
      countDeletedItems: 0,
    };
  },
  setup: function () {
    const $q = useQuasar();

    function stringifyMessage(msg: any) {
      if (typeof msg == "string") {
        return msg;
      } else if (typeof msg == "object") {
        return JSON.stringify(msg);
      }
    }

    function showNotifyCancelled() {
      $q.notify({
        message: "Cancelled",
        color: "grey",
        type: "info",
        position: "top",
        timeout: 1500,
      });
    }

    function showNotifySuccessDelete(selectedLength: Number) {
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

    function showNotifySuccessEdited(editedItem: any) {
      $q.notify({
        message: `Successfully edited`,
        color: "green",
        type: "info",
        position: "top",
        timeout: 1500,
      });
    }

    function showNotifyFailedDelete(selectedLength: Number, err: any) {
      $q.notify({
        message: `<div>Failed to delete ${selectedLength} ${
          selectedLength > 1 ? "items" : "item"
        }</div>
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

    function showNotifyRefreshFailed(queryString: string, err: any) {
      $q.notify({
        message: `<div>Failed to refresh with the queryString "${queryString}"</div>
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

    function showNotifyRefreshWarning() {
      $q.notify({
        message: `Refresh - No Results`,
        html: true,
        type: "warning",
        position: "top",
        timeout: 1000,
      });
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

    async function deleteButton(
      selected: any,
      rowKey: string,
      deleteItems: Function
    ) {
      function generateUnorderedList(selected: any, rowKey: string) {
        // console.log(rowKey, selected[0]);
        const m = selected.map((item: any) => item[rowKey]);
        // console.log("m", m);
        const tmpl = "<li>ROWKEY_VALUE</li>";
        var unorderedList = "";
        m.forEach((value: any) => {
          unorderedList += tmpl.replace("ROWKEY_VALUE", value);
        });
        return unorderedList;
      }
      return new Promise((resolve, reject) => {
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
            const response = await deleteItems(selected);
            console.log(
              "deleteItems Http Status Code:",
              response.$metadata.httpStatusCode
            );
            if (
              response.$metadata.httpStatusCode &&
              response.$metadata.httpStatusCode >= 200 &&
              response.$metadata.httpStatusCode < 300
            ) {
              showNotifySuccessDelete(selected.length);
              resolve("success");
            } else {
              showNotifyFailedDelete(selected.length, response.$metadata);
              reject("failed");
            }
          })
          .onCancel(() => {
            showNotifyCancelled();
          });
      });
    }
    return {
      deleteButton,
      showNotifyRefreshSuccess,
      showNotifyRefreshFailed,
      showNotifySuccessEdited,
      showNotifyCancelled,
      showNotifyRefreshWarning,
    };
  },
  methods: {
    /**
     * Gets a list of items, according to queryString and stores the results in `this.items`
     * @param {string} queryString - The value is fetched from user input, and then passed to `this.getItems`
     */
    async onGetItems(queryString: string) {
      try {
        this.loading = true;
        const response = await this.getItems(queryString);
        this.items = response.items;
        if (this.items.length > 0) {
          this.showNotifyRefreshSuccess();
        } else {
          this.showNotifyRefreshWarning();
        }
      } catch (err) {
        console.log("get itemS error", err);
        this.showNotifyRefreshFailed(queryString, err);
      } finally {
        this.loading = false;
      }
    },
    /**
     * The event `clickedCreate` is emitted from the child component `TableComponent`.
     * This event instructs the $router to navigate to the `CreateItemPage` page of the service.
     */
    onClickedCreate() {
      console.log("Clicked create");
      this.$router.push({ name: this.name + "-create" });
    },
    /**
     * The event `clickedEdit` is emitted from the child component `TableComponent`.
     * This event creates a `route` object with `params`. The `params` include a dynamic key `params[rowKey]` which represents the unique ID of the item to be edited.
     * The $router pushes the new route and navigates to the `EditItemPage` and passes the params `params[rowKey]`.
     */
    onClickedEdit(item: any) {
      console.log("Clicked edit", item);
      const rowKey: string = this.rowKey;
      let itemRowKeyValue: string = item[rowKey as keyof Object];
      const targetPath: string = this.name + "/edit" + itemRowKeyValue;
      const params: any = {};
      params[rowKey] = itemRowKeyValue;
      this.$router.push({
        path: targetPath,
        params: params,
        name: this.name + "-edit",
      });
    },
    /**
     * The event `clickedModify` is emitted from the child component `TableComponent`.
     * This event creates a `route` object with `params`. The `params` include the selected items.
     * The $router pushes the new route and navigates to the `ModifyItemsPage` and passes the params `this.selected`.
     */
    onClickedModify() {
      console.log("Clicked modify", this.selected);
      const params: IModifyParams = {
        items: <any[]>this.selected,
        rowKey: this.rowKey,
      };
      this.$router.push({
        path: this.name + "/modify",
        params: params,
        name: this.name + "-modify",
      });
    },
    /**
     * The event `clickedSet` is emitted from the child component `TableComponent`. This event is triggered upon "inline-editing".
     * @param {any} setItem - This value is passed to the `this.setItem` function, provided in [src/router/routes.ts](src/router/routes.ts)
     */
    async onClickedSet(setItem: any) {
      try {
        const setStatus = await this.setItem(setItem.item);
        console.log("setStatus", setStatus);
        this.showNotifySuccessEdited(setItem.item);
      } catch (err) {
        console.log(err);
      } finally {
        this.onGetItems(setItem.queryString);
      }
    },
    /**
     * The event `clickedCancel` is emitted from the child component `TableComponent`.
     * This event shows a popup notification
     * @param {any} setItem - Unused at the moment
     */
    async onClickedCancel(setItem: any) {
      this.showNotifyCancelled();
    },
    /**
     * The event `clickedDelete` is emitted from the child component `TableComponent`.
     * This event invokes the function `this.deleteButton` which in turn calls the `deleteItems` function.
     */
    async onClickedDelete() {
      try {
        const deleteStatus = await this.deleteButton(
          this.selected,
          this.rowKey,
          this.deleteItems
        );
        console.log("deleteStatus", deleteStatus);
        this.countDeletedItems += 1;
      } catch (err) {
        console.log("delete itemS error", err);
      }
    },
    /**
     * The event `selectedChanged` is emitted from the child component `TableComponent`.
     * This event sets the current data property `selected` according to the provided selection in the child component.
     * @param {[{}]} selected - List of objects that were selected in the child component
     */
    onSelectedChanged(selected: [{}]) {
      this.selected = selected;
    },
  },
});
</script>
