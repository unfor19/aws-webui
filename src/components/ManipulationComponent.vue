<template>
  <draggable
    v-model="groupsWithItems"
    group="children"
    @start="drag = true"
    @end="drag = false"
    item-key="id"
    tag="div"
    class="list-group q-pa-xs"
  >
    <template #item="{ element }">
      <q-item class="list-group-item">
        <div class="cursor-pointer row">
          <q-icon name="drag_indicator" class="col" />
          <span class="col">{{ element.id }} </span>
        </div>
      </q-item>
    </template>
  </draggable>
</template>

<script>
import { defineComponent, ref } from "vue";
import draggable from "vuedraggable";

export default defineComponent({
  name: "ManipulationComponent",
  components: { draggable },
  data() {
    return {
      drag: ref(false),
      groupsWithItems: [
        {
          id: 1,
          children: [
            {
              id: 1,
              label: "Item 1",
            },
            {
              id: 2,
              label: "Item 2",
            },
          ],
        },
        {
          id: 2,
          children: [
            {
              id: 3,
              label: "Item 3",
            },
            {
              id: 4,
              label: "Item 4",
            },
          ],
        },
      ],
    };
  },
});
</script>
