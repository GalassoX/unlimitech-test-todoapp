import { StoreContext } from "@/stores/rootStore";
import { useContext } from "react";

export const useStores = () => useContext(StoreContext);