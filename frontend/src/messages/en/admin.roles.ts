// English translation file for role management in admin panel
export default {
  // Page titles and descriptions
  title: 'Role Management',
  description: 'Manage and assign permissions to users in the system',
  createRoleBtn: 'Create New Role',
  backToRoles: 'Back to roles list',
  backToRole: 'Back to role',
  roleInfoTitle: 'Role Information',
  rolePermissionsTitle: 'Role Permissions',
  
  // Create and edit role forms
  createForm: {
    title: 'Create New Role',
    description: 'Add a new role and configure permissions',
    submit: 'Create Role',
    cancel: 'Cancel',
    nameLabel: 'Role Name',
    namePlaceholder: 'Enter role name (e.g., Admin, Editor, User)',
    descriptionLabel: 'Role Description',
    descriptionPlaceholder: 'Describe the function and permissions of this role',
    nameRequired: 'Role name is required',
    nameTooShort: 'Role name must be at least 2 characters long'
  },
  
  editForm: {
    title: 'Edit Role',
    description: 'Update information and permissions for this role',
    submit: 'Update Role',
    cancel: 'Cancel',
    nameLabel: 'Role Name',
    namePlaceholder: 'Enter role name',
    descriptionLabel: 'Role Description',
    descriptionPlaceholder: 'Describe the function and permissions of this role',
    saveChanges: 'Save Changes'
  },
  
  // Role details
  roleDetails: {
    title: 'Role Details',
    description: 'View detailed information about this role',
    usersWithRole: 'Users with this role',
    assignedPermissions: 'Assigned Permissions',
    noPermissionsAssigned: 'No permissions assigned to this role',
    noUsersWithRole: 'No users assigned to this role',
    id: 'Role ID',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    editRole: 'Edit Role',
    deleteRole: 'Delete Role',
    assignUsers: 'Assign Users',
    viewAllUsers: 'View All Users'
  },
  
  // Role table
  table: {
    name: 'Role Name',
    description: 'Description',
    permissionsCount: 'Permissions Count',
    usersCount: 'Users Count',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    viewDetails: 'View Details',
    noRoles: 'No roles found',
    loadingRoles: 'Loading roles...'
  },
  
  // Delete role confirmation
  deleteConfirmation: {
    title: 'Delete Role',
    message: 'Are you sure you want to delete this role? This action cannot be undone.',
    confirmButton: 'Delete Role',
    cancelButton: 'Cancel',
    warningWithUsers: 'Note: This role is currently assigned to {count} users. If deleted, these users will lose their corresponding permissions.'
  },
  
  // Notifications
  notifications: {
    created: 'Role created successfully',
    updated: 'Role updated successfully',
    deleted: 'Role deleted successfully',
    error: 'An error occurred. Please try again.',
    permissionsUpdated: 'Role permissions updated successfully',
    roleNotFound: 'Role not found',
    cannotDeleteDefaultRole: 'Cannot delete default role',
    noPermissionsAvailable: 'No permissions available in the system'
  },
  
  // Permissions
  permissions: {
    title: 'Permissions',
    searchPlaceholder: 'Search permissions...',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    savePermissions: 'Save Permissions',
    noPermissionsAvailable: 'No permissions available',
    filterByCategory: 'Filter by Category',
    allCategories: 'All Categories',
    permissionNameHeader: 'Permission Name',
    descriptionHeader: 'Description',
    categoryHeader: 'Category',
    categories: {
      users: 'Users',
      posts: 'Posts',
      comments: 'Comments',
      roles: 'Roles',
      system: 'System',
      media: 'Media',
      settings: 'Settings'
    },
    actions: {
      view: 'View',
      create: 'Create',
      update: 'Update',
      delete: 'Delete',
      manage: 'Manage',
      publish: 'Publish',
      unpublish: 'Unpublish',
      approve: 'Approve',
      reject: 'Reject'
    }
  },
  
  // Pagination and sorting
  pagination: {
    previous: 'Previous',
    next: 'Next',
    page: 'Page {page} / {total}',
    perPage: 'Show:',
    showing: 'Showing {start}-{end} of {total} roles'
  },
    // UI
  ui: {
    searchPlaceholder: 'Search roles...',
    refresh: 'Refresh',
    loading: 'Loading...',
    filter: 'Filter',
    sortBy: 'Sort by',
    sortOrder: 'Order',
    ascending: 'Ascending',
    descending: 'Descending',
    import: 'Import Roles',
    export: 'Export Roles',
    emptyState: 'No roles created yet',
    emptyStateDescription: 'Create your first role to manage permissions in the system',
    nameAlreadyExists: 'This role name already exists'
  },

  // Error messages
  errors: {
    fetchFailed: 'Failed to fetch roles. Please try again.',
    createFailed: 'Failed to create role. Please try again.',
    updateFailed: 'Failed to update role. Please try again.',
    deleteFailed: 'Failed to delete role. Please try again.',
    permissionUpdateFailed: 'Failed to update role permissions. Please try again.',
    nameRequired: 'Role name is required',
    nameTooShort: 'Role name must be at least 2 characters long',
    descriptionRequired: 'Role description is required',
    invalidData: 'The provided data is invalid'
  },
  
  // Confirmation dialog messages
  confirmDelete: 'Are you sure you want to delete this role? This action cannot be undone.',  confirmCancelEdit: 'Are you sure you want to cancel? All unsaved changes will be lost.',

  // Permission management
  managePermissionsFor: 'Manage Permissions for {roleName}',
  permissionsAssigned: 'permissions assigned',
  assignedPermissions: 'Assigned Permissions',
  assignedPermissionsDesc: 'Permissions currently assigned to this role',
  noPermissionsAssigned: 'No permissions assigned to this role yet',
  allPermissions: 'All Permissions',
  allPermissionsDesc: 'All available permissions in the system',
  searchPermissions: 'Search permissions...',
  noPermissionsFound: 'No permissions found matching your search',
  noPermissionsInSystem: 'No permissions defined in the system',
  clearSearch: 'Clear search',  permission: 'Permission',
  description: 'Description',
  actions: 'Actions',
  remove: 'Remove',
  assign: 'Assign',
  refresh: 'Refresh',
  noDescription: 'No description',
  roleNotFound: 'Role Not Found',
  roleNotFoundDesc: 'The role you are looking for could not be found.',
  
  // User management
  addUser: 'Add User',
  manageUsersFor: 'Manage Users for {roleName}',
  searchUsers: 'Search users...',
  usersWithRole: 'Users with {roleName} Role',
  usersWithRoleDesc: 'List of users assigned to this role',
  user: 'User',
  email: 'Email',
  addUserToRole: 'Add User to {roleName} Role',
  searchUsersToAdd: 'Search users to add...',
  noUsersToAdd: 'No users available to add to this role',
  noUsersFound: 'No users found matching your search',
  noUsersAssigned: 'No users assigned to this role yet',
  add: 'Add',
  close: 'Close'
};
