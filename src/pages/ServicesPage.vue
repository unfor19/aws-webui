<template>
  <q-page padding>
    <h4 class="q-pl-xl q-pt-xs q-mb-xs">
      <router-link
        :to="{ name: 'services' }"
        custom
        v-slot="{ href, navigate, isActive, isExactActive }"
      >
        <a
          :class="[
            isActive && 'router-link-active',
            isExactActive && 'router-link-exact-active',
          ]"
          :href="href"
          @click="navigate"
          >{{ title }}</a
        >
      </router-link>
    </h4>
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
    /**
     * Sets the props of the link according to the route object
     *
     * Example
     * ```html
     * <router-link :to="{ name: service.RouteName }" custom v-slot="props">
     *   <q-btn
     *     flat
     *     class="column q-mr-md"
     *     color="primary"
     *     label="View"
     *     v-bind="linkProps(props)" <!-- Bind `href` and `to` -->
     *   />
     * </router-link>
     * ```
     *
     * @param {any} props - RouterLink object properties
     */
    linkProps: function (props: any) {
      return {
        to: props.route.path,
        href: "/#" + props.route.path,
      };
    },
  },

  props: {
    /**
     * @param {string} title - Page title
     */
    title: {
      type: String,
      default: "Services Page Title",
    },
    /**
     * @param {Array} services - List of services, provided in src/router/routes.js
     */
    services: {
      type: Array,
      default: null,
    },
  },
});
</script>

<style scoped>
a,
a:visited,
a:hover,
a:active {
  color: #1976d2;
  text-decoration: inherit;
}
</style>
