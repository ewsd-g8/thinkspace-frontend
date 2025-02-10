import { computed } from "vue";
import { useAuthStore } from "../stores/auth";

const isSuperAdmin = computed(() => {
  const store = useAuthStore();
  return store.roles.includes("Admin");
});

export function hasPermissions(permissions) {
  const store = useAuthStore();
  if (!store.permissions.length) {
    return false;
  }
  const permissionArray = permissions.filter((permission) => {
    return store.permissions.includes(permission);
  });
  return permissionArray.length > 0 || isSuperAdmin.value;
}

export function hasPermission(permission) {
  const store = useAuthStore();
  if (!store.permissions.length) {
    return false;
  }

  return store.permissions.includes(permission) || isSuperAdmin.value;
}

export function hasRoles(roles) {
  const store = useAuthStore();
  if (!store.roles.length) {
    return false;
  }
  const roleArray = roles.filter((role) => {
    return store.roles.includes(role);
  });
  return roleArray.length > 0 || isSuperAdmin.value;
}

export function hasRole(role) {
  const store = useAuthStore();
  if (!store.roles.length) {
    return false;
  }
  return store.roles.includes(role);
}
