import { createContext } from "react";
import { taskStore } from "./taskStore";
import { userStore } from "./userStore";

export const stores = {
  taskStore,
  userStore
}

export const StoreContext = createContext(stores);