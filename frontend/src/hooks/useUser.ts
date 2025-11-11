import { getUser } from "@/services/user";
import { useEffect, useState } from "react";
import { useStores } from "./useStores";

export function useUser() {
  const { userStore } = useStores();
  const [isGettingUser, setIsGettingUser] = useState<boolean>(true);

  useEffect(() => {
    if (!userStore.user) {
      getUser()
        .then(user => { 
          if (user) userStore.setUser(user)
        })
        .finally(() => setIsGettingUser(false));
    }
  }, [])

  return { user: userStore.user, isGettingUser };
}