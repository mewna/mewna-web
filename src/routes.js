import React from "react"

import { asyncComponent } from "@jaredpalmer/after"

export default [
  {
    path: "/",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Index"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },
  {
    path: "/features",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },
  {
    path: "/docs",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Docs"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },
  {
    path: "/about",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },
  {
    path: "/about/terms",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },
  {
    path: "/about/brand",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },

  {
    path: "/home",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },
  {
    path: "/home/logs",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },

  {
    path: "/server/:id/:key?/:subkey?",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/server/ServerPage"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },

  {
    path: "/user/:id",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/user/UserPage"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },
  {
    path: "/user/:id/:post",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/user/UserPage"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  },
  {
    component: asyncComponent({
      loader: () => import("./pages/NotFound"),
      Placeholder: () => <div>...LOADING...</div>
    }),
  }
]
