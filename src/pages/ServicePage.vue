<template>
  <q-page>
    <h5 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h5>
    <div class="row"></div>
    <table-component
      @get-items="onGetItems"
      @selected-changed="onSelectedChanged"
      @clicked-delete-button="onDeleteItems"
      @clicked-create="onClickedCreate"
      @clicked-set="onClickedSet"
      @clicked-cancel="onClickedCancel"
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
import { defineComponent } from "vue";
import TableComponent from "../components/TableComponent.vue";
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
      selected: [],
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
    };
  },
  methods: {
    async onGetItems(queryString: string) {
      try {
        this.loading = true;
        const response = await this.getItems(queryString);
        this.items = response.items;
        if (this.items.length > 0) {
          this.showNotifyRefreshSuccess();
        } else {
          this.showNotifyRefreshFailed(queryString, "Empty number of items");
        }
      } catch (err) {
        console.log("get itemS error", err);
        this.showNotifyRefreshFailed(queryString, err);
      } finally {
        this.loading = false;
      }
    },
    onClickedCreate() {
      console.log("Clicked create");
      this.$router.push({ name: this.name + "-create" });
    },
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
    async onClickedCancel(setItem: any) {
      this.showNotifyCancelled();
    },
    async onDeleteItems() {
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
    onSelectedChanged(selected: any) {
      this.selected = selected;
    },
  },
});
</script>
