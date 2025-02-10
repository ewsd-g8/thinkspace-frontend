import { useAuthStore } from "../stores/auth";
import { Http } from "@/services/http-common";

export function getAuthUser() {
  const store = useAuthStore();
  Http.get("auth-user")
    .then((res) => {
      store.user.id = res.data.data.id;
      store.user.name = res.data.data.name;
      store.user.email = res.data.data.email;
      store.user.profile = res.data.data.profile;
    })
    .catch(() => {
      console.log("Error getting user");
    });
}
