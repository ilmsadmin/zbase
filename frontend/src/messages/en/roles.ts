// English translation file for role management
export default {
  // Title and navigation
  title: 'Role Management',
  backToRoles: 'Back to roles',
  backToRole: 'Back to role',
  createNewRole: 'Create New Role',
  editRole: 'Edit Role',
  
  // Role information
  roleName: 'Role Name',
  roleNamePlaceholder: 'Enter role name (e.g., Admin, Editor, User)',
  roleDescription: 'Role Description',
  roleDescriptionPlaceholder: 'Describe the purpose and permissions of this role',
  roleDescriptionHelp: 'A detailed description helps administrators understand what this role is authorized to do.',
  
  // Permissions management
  managePermissionsFor: 'Manage Permissions for {roleName}',
  rolePermissions: 'Permissions',
  permissionsAssigned: 'permissions assigned',
  assignedPermissions: 'Assigned Permissions',
  assignedPermissionsDesc: 'Permissions currently assigned to this role',
  noPermissionsAssigned: 'No permissions assigned to this role yet',
  allPermissions: 'All Permissions',
  allPermissionsDesc: 'All available permissions in the system',
  searchPermissions: 'Search permissions...',
  noPermissionsFound: 'No permissions found matching your search',
  noPermissionsInSystem: 'No permissions defined in the system',
  selectPermissions: 'Select permissions',
  
  // UI elements
  permission: 'Permission',
  description: 'Description',
  actions: 'Actions',
  remove: 'Remove',
  assign: 'Assign',
  refresh: 'Refresh',
  clearSearch: 'Clear search',
  noDescription: 'No description',
  
  // Error states
  roleNotFound: 'Role Not Found',
  roleNotFoundDesc: 'The role you are looking for could not be found.',
  
  // Error messages
  errors: {
    nameRequired: 'Role name is required',
    nameTooShort: 'Role name must be at least 2 characters long',
    createFailed: 'Failed to create role, please try again',
    updateFailed: 'Failed to update role, please try again',
    deleteFailed: 'Failed to delete role, please try again',
    fetchFailed: 'Failed to load role information, please try again',
    addPermissionFailed: 'Failed to add permission to role',
    removePermissionFailed: 'Failed to remove permission from role'
  },
  
  // Actions
  createRole: 'Create Role',
  updateRole: 'Update Role', 
  deleteRole: 'Delete Role',
  confirm: 'Confirm',
  cancel: 'Cancel',
  saving: 'Saving...',
  
  // Roles list
  rolesList: 'Roles List',
  searchPlaceholder: 'Search roles...',
  noRolesFound: 'No roles found',
  loadingRoles: 'Loading roles...',
  refreshRoles: 'Refresh list',
  
  // Table headers
  tableHeaders: {
    name: 'Role Name',
    description: 'Description',
    permissions: 'Permissions Count',
    users: 'Users Count',
    actions: 'Actions'
  },
  
  // Role details page
  roleDetails: 'Role Details',
  usersWithRole: 'Users with this role',
  noUsersWithRole: 'No users have this role',
  
  // Role tips
  roleTips: {
    title: 'Role Management Tips',
    tip1: 'Roles define what users can access in the system.',
    tip2: 'Create roles with limited scope to apply the principle of least privilege.',
    tip3: 'Write clear descriptions so other administrators understand the role\'s purpose.',
    tip4: 'Regularly review and update role permissions to ensure security.'
  }
};