import React from "react"

import { asyncComponent } from "@jaredpalmer/after"
import Loading from "./comp/Loading"

export default [
  {
    path: "/",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Index"),
      Placeholder: () => <Loading />
    }),
  },
  {
    path: "/features",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <Loading />
    }),
  },
  {
    path: "/docs",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Docs"),
      Placeholder: () => <Loading />
    }),
  },
  {
    path: "/about",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <Loading />
    }),
  },
  {
    path: "/about/terms",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <Loading />
    }),
  },
  {
    path: "/about/brand",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <Loading />
    }),
  },

  {
    path: "/home",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/user/HomePage"),
      Placeholder: () => <Loading />
    })
  },
  {
    path: "/home/logs",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Placeholder"),
      Placeholder: () => <Loading />
    }),
  },

  {
    path: "/server/:id/:key?/:subkey?",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/server/ServerPage"),
      Placeholder: () => <Loading />
    }),
  },

  {
    path: "/user/:id/:post?",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/user/UserPage"),
      Placeholder: () => <Loading />
    }),
  },

  {
    path: "/premium",
    exact: true,
    component: asyncComponent({
      loader: () => import("./pages/Premium"),
      Placeholder: () => <Loading />
    }),
  },

  {
    component: asyncComponent({
      loader: () => import("./pages/NotFound"),
      Placeholder: () => <Loading />
    }),
  }
]
