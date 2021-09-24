const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    props: true,
    children: [
      // { path: "", component: () => import("pages/Index.vue") },
      // TODO: set a proper index page
      // { path: "", component: () => import("pages/SsmParameters.vue") },
      {
        path: "/services",
        name: "services",
        component: () => import("pages/ServicesPage.vue"),
        props: {
          title: "AWS Services",
        },
        children: [
          {
            path: "ssm-parameters",
            props: {
              title: "SSM Parameters",
            },
            component: () => import("layouts/ServiceLayout.vue"),
            children: [
              {
                path: "",
                name: "ssm-parameters",
                props: {
                  title: "Manage",
                },
                component: () => import("pages/SsmParameters.vue"),
              },
              {
                name: "create",
                path: "create",
                props: { title: "Create SSM Parameter" },
                component: () => import("pages/CreatePage.vue"),
              },
            ],
          },
        ],
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
