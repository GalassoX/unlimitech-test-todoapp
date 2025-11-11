import { getUser } from "@/services/user";
import { userStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

export function useUser() {
  const [isGettingUser, setIsGettingUser] = useState<boolean>(true);

  useEffect(() => {
    if (!userStore.user?._id) {
      getUser()
        .then(user => { 
          if (user) userStore.setUser(user)
        })
        .finally(() => setIsGettingUser(false));
    }
  }, [])

  return { user: userStore.user, isGettingUser };
}