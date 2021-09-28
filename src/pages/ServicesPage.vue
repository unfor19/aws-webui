<template>
  <q-page padding>
    <h4 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h4>
    <div
      v-if="$route.path == '/services'"
      class="q-pa-md row items-start q-gutter-md"
    >
      <q-card v-for="service in services" :key="service.Title">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ service.Title }}</div>
          <div class="text-subtitle2">
            {{ service.Description }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <router-link :to="{ name: service.RouteName }" custom v-slot="props">
            <q-btn
              flat
              class="column q-mr-md"
              color="primary"
              label="View"
              v-bind="linkProps(props)"
            />
          </router-link>
          <router-link
            v-if="service.BtnCreate"
            :to="{ name: service.RouteName + '-create' }"
            custom
            v-slot="props"
          >
            <q-btn
              flat
              class="column q-mr-md"
              color="primary"
              label="Create"
              v-bind="linkProps(props)"
            />
          </router-link>
        </q-card-actions>
      </q-card>
    </div>
    <router-view></router-view>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
const IService = require("../aws-webui/interfaces");

export default defineComponent({
  name: "ServicesPage",
  methods: {
    linkProps: function (routeObject: any) {
      const route = routeObject.route;
      const props = {
        to: route.path,
        href: "/#" + route.path,
      };
      return props;
    },
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    services: {
      type: Array,
      default: null,
    },
  },
});
</script>
