import { ssmSetParameter } from "../aws/ssm/set";
import { ssmGetParametersByPath } from "../aws/ssm/get";
import { ssmDeleteParametersByNames } from "src/aws/ssm/delete";

const routes = [
  {
    // Main Layout
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
          // Services Cards
          services: [
            {
              Title: "SSM Parameters",
              RouteName: "ssm-parameters",
              BtnCreate: true,
              Description: "Create, modify and delete SSM Parameters.",
            },
          ],
        },
        // Services Pages
        children: [
          {
            path: "ssm-parameters",
            props: {
              title: "SSM Parameters",
            },
            component: () => import("layouts/ServiceLayout.vue"),
            children: [
              {
                name: "ssm-parameters",
                path: "",
                props: {
                  title: "Manage SSM Parameters",
                  rowKey: "Name",
                  name: "ssm-parameters",
                  filterDebounce: 200,
                  queryStringDebounce: 500,
                  getItems: ssmGetParametersByPath,
                  setItem: ssmSetParameter,
                  deleteItems: ssmDeleteParametersByNames,
                  keys: [
                    {
                      name: "Name",
                      align: "left",
                      field: (item) => item.Name,
                      format: (val) => `${val}`,
                      sortable: true,
                      label: "Name",
                    },
                    {
                      name: "Value",
                      field: "Value",
                      label: "Value",
                      sortable: true,
                      editable: {
                        type: "textarea",
                      },
                    },
                    {
                      name: "Type",
                      field: "Type",
                      label: "Type",
                      sortable: true,
                      editable: {
                        type: "select",
                        data: ["String", "SecureString", "StringList"],
                      },
                    },
                    {
                      name: "LastModifiedDate",
                      field: "LastModifiedDate",
                      label: "LastModifiedDate",
                      format: (val) => `${val}`,
                      sortable: true,
                    },
                    { name: "Version", field: "Version", label: "Version" },
                  ],
                },
                component: () => import("pages/ServicePage.vue"),
              },
              {
                name: "ssm-parameters-create",
                path: "create",
                props: {
                  title: "Create SSM Parameter",
                  createItem: ssmSetParameter,
                  keys: [
                    {
                      name: "Name",
                      editable: {
                        type: "textarea",
                        default: "",
                      },
                      label: "Name *",
                      rules: [
                        (val) =>
                          (val &&
                            val.length > 0 &&
                            val.length < 1011 &&
                            /[a-zA-Z0-9/_\.-]+/g.exec(val).join("").length ==
                              val.length) ||
                          "Allowed RegEx pattern: /[a-zA-Z0-9/_.-]+/g",
                      ],
                    },
                    {
                      name: "Value",
                      label: "Value *",
                      editable: {
                        type: "textarea",
                        default: "",
                      },
                      rules: [(val) => val && val.length > 0],
                    },
                    {
                      name: "Type",
                      label: "Type *",
                      editable: {
                        type: "select",
                        data: ["String", "SecureString", "StringList"],
                        default: "String",
                      },
                    },
                    {
                      name: "KeyId",
                      label: "KMS Key Id",
                      editable: {
                        type: "textarea",
                        default: "alias/aws/ssm",
                      },
                      depends_on: {
                        name: "Type",
                        value: "SecureString",
                      },
                    },
                    {
                      name: "Tier",
                      label: "Tier",
                      editable: {
                        type: "select",
                        data: ["Standard", "Advanced", "Intelligent-Tiering"],
                        default: "Standard",
                      },
                    },
                    {
                      name: "Description",
                      label: "Description",
                      editable: {
                        type: "textarea",
                        default: "",
                      },
                    },
                    {
                      name: "AllowedPattern",
                      label: "AllowedPattern",
                      editable: {
                        type: "textarea",
                        default: "",
                      },
                    },
                    {
                      name: "Tags",
                      label: "Tags",
                      editable: {
                        type: "textarea",
                        default: [],
                      },
                    },
                  ],
                },
                component: () => import("src/pages/CreateItemPage.vue"),
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
