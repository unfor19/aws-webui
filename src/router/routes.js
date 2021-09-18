const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // { path: "", component: () => import("pages/Index.vue") },
      // TODO: set a proper index page
      { path: "", component: () => import("pages/SsmParameters.vue") },
      {
        path: "ssm-parameters",
        component: () => import("pages/SsmParameters.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
