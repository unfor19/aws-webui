<template>
  <q-page padding>
    <h4 class="q-pl-xl q-pt-xs q-mb-xs">{{ title }}</h4>
    <div
      v-if="$route.path == '/services'"
      class="q-pa-md row items-start q-gutter-md"
    >
      <q-card class="my-card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">SSM Parameters</div>
          <div class="text-subtitle2">
            Create, modify and delete SSM Parameters.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <router-link :to="{ name: 'ssm-parameters' }" custom v-slot="props">
            <q-btn
              flat
              class="column q-mr-md"
              color="primary"
              label="View"
              v-bind="linkProps(props)"
            />
          </router-link>
          <router-link :to="{ name: 'create' }" custom v-slot="props">
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

      <q-card class="my-card">
        <q-card-section class="bg-purple text-white">
          <div class="text-h6">S3</div>
          <div class="text-subtitle2">Manage S3 buckets and objects.</div>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn flat>View</q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <router-view />
  </q-page>
</template>

<script>
export default {
  name: "ServicesPage",
  methods: {
    linkProps: function ({ route }) {
      console.log(JSON.stringify(route.name));
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
  },
  data: function () {
    return {};
  },
};
</script>
