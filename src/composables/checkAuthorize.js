import { computed } from "vue";
import { useAuthStore } from "../stores/auth";


const isSuperAdmin = computed(() => {
  const store = useAuthStore();
  return store.roles.includes("Superadmin");
});
export function hasPermissions(permissions) {
  const store = useAuthStore();

  console.log("User's roles:", store.roles);
  console.log("User's permissions:", store.permissions);
  console.log("Checking permissions for:", permissions);

  if (!Array.isArray(permissions) || permissions.length === 0) {
    console.warn("Invalid permissions array. Returning false.");
    return false;
  }

  if (!store.permissions || store.permissions.length === 0) {
    console.warn("User has no permissions. Returning false.");
    return false;
  }

  // Check if the user has the required permissions
  const matchingPermissions = permissions.filter(permission => 
    store.permissions.includes(permission)
  );

  console.log("Matching permissions:", matchingPermissions);

  // Superadmin bypasses permission checks, but Staff does not
  if (store.roles.includes("Superadmin")) {
    return true;
  }

  // Staff must have explicit permission (no auto-access)
  return matchingPermissions.length > 0;
}



export function hasPermission(permission) { 
  console.log("Checking permission for:", permission); // Debugging line

  console.log("Checking d permission for:", permission); // Debugging line

  const store = useAuthStore();
  if (!store.permissions.length) {
    return false;
  }

  return store.permissions.includes(permission) || isSuperAdmin.value || isStaff.value;
}

export function hasRoles(roles) { 
  console.log("Checking roles for:", roles); // Debugging line

  console.log("Checking roles for:", roles); // Debugging line

  const store = useAuthStore();
  if (!store.roles.length) {
    return false;
  }
  const roleArray = roles.filter((role) => {
    return store.roles.includes(role);
  });
  return roleArray.length > 0 || isSuperAdmin.value || isStaff.value;
}

export function hasRole(role) { 
  console.log("Checking role for:", role); // Debugging line

  console.log("Checking role for:", role); // Debugging line

  const store = useAuthStore();
  if (!store.roles.length) {
    return false;
  }
  return store.roles.includes(role);
}
