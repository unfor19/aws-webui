import { ssmSetParameter } from "../aws/ssm/set";
import { ssmGetParameterByName, ssmGetParametersByPath } from "../aws/ssm/get";
import { ssmDeleteParametersByNames } from "src/aws/ssm/delete";
import { RouteRecordNormalized } from "vue-router";

const routes: RouteRecordNormalized[] = [
  {
    // Main Layout
    path: "/",
    // @ts-ignore
    component: () => import("layouts/MainLayout.vue"),
    props: {},
    name: "root",
    children: [
      {
        name: "index",
        path: "",
        // @ts-ignore
        component: () => import("pages/Index.vue"),
      },
      {
        // Services Page
        path: "/services",
        name: "services",
        // @ts-ignore
        component: () => import("pages/ServicesPage.vue"),
        props: {
          title: "AWS Services",
          services: [
            {
              Title: "SSM Parameters",
              RouteName: "ssm-parameters",
              BtnCreate: true,
              Description: "Create, modify and delete SSM Parameters.",
            },
          ],
        },
        // Service Pages
        children: [
          {
            name: "ssm-parameters-root",
            path: "ssm-parameters",
            props: {
              title: "SSM Parameters",
            },
            // @ts-ignore
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
                      field: (item: any) => item.Name,
                      format: (val: any) => `${val}`,
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
                      label: "Last Modified Date",
                      format: (val: any) => `${val}`,
                      sortable: true,
                    },
                    { name: "Version", field: "Version", label: "Version" },
                  ],
                },
                // @ts-ignore
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
                        (val: any) =>
                          (val &&
                            val.length > 0 &&
                            val.length < 1011 &&
                            /[a-zA-Z0-9/_\.-]+/g.exec(val)?.join("").length) ||
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
                      rules: [
                        (val: any) => (val && val.length > 0) || "Required *",
                      ],
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
                    // {
                    //   name: "Tier",
                    //   label: "Tier",
                    //   editable: {
                    //     type: "select",
                    //     data: ["Standard", "Advanced", "Intelligent-Tiering"],
                    //     default: "Standard",
                    //   },
                    // },
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
                      label: "Allowed Pattern",
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
                // @ts-ignore
                component: () => import("src/pages/CreateItemPage.vue"),
              },
              {
                name: "ssm-parameters-edit",
                path: "edit/:Name([a-zA-Z0-9/_.-]+)",
                // @ts-ignore
                component: () => import("src/pages/EditItemPage.vue"),
                props: {
                  title: "Edit SSM Parameter",
                  getItem: ssmGetParameterByName,
                  setItem: ssmSetParameter,
                  rowKey: "Name",
                  keys: [
                    {
                      name: "Version",
                      label: "Version",
                    },
                    {
                      name: "Name",
                      label: "Name",
                    },
                    {
                      name: "Value",
                      label: "Value *",
                      editable: {
                        type: "textarea",
                        default: "",
                      },
                      rules: [
                        (val: any) => (val && val.length > 0) || "Required *",
                      ],
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
                    // {
                    //   name: "Tier",
                    //   label: "Tier",
                    //   editable: {
                    //     type: "select",
                    //     data: ["Standard", "Advanced", "Intelligent-Tiering"],
                    //     default: "Standard",
                    //   },
                    // },
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
                      label: "Allowed Pattern",
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
    // @ts-ignore
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
