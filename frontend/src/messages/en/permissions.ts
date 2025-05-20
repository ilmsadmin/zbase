export default {
  title: 'Test Permissions',
  userInfo: {
    title: 'User Information',
    subtitle: 'Current user details',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    notUpdated: 'Not updated'
  },
  abilities: {
    title: 'Permissions',
    subtitle: 'Check current permissions',
    manageUsers: {
      name: 'Manage Users',
      description: 'View, add, edit, and delete users'
    },
    readPosts: {
      name: 'View All Posts',
      description: 'View all posts in the system'
    },
    createPosts: {
      name: 'Create Posts',
      description: 'Create new posts'
    },
    managePosts: {
      name: 'Manage All Posts',
      description: 'Edit and delete any posts'
    },
    manageComments: {
      name: 'Manage Comments',
      description: 'Manage comments in the system'
    },
    manageAll: {
      name: 'Manage System',
      description: 'Access to all features'
    }
  },
  allowed: 'Allowed',
  denied: 'Denied',
  
  // Permissions Management - CRUD
  management: {
    title: 'Permissions Management',
    backToPermissions: 'Back to permissions list',
    createNewPermission: 'Create New Permission',
    editPermission: 'Edit Permission',
    viewPermission: 'View Permission',
    
    // Labels and placeholders
    permissionName: 'Permission Name',
    permissionNamePlaceholder: 'Enter permission name (e.g., create:posts)',
    permissionDescription: 'Permission Description',
    permissionDescriptionPlaceholder: 'Describe the purpose of this permission',
    permissionCategory: 'Category',
    permissionCategoryPlaceholder: 'Select category',
    action: 'Action',
    actionPlaceholder: 'Select action (view, create, update, delete, manage)',
    resource: 'Resource',
    resourcePlaceholder: 'Enter resource name (e.g., users, posts)',
    
    // List
    permissionsList: 'Permissions List',
    searchPlaceholder: 'Search permissions...',
    noPermissionsFound: 'No permissions found',
    
    // Table headers
    tableHeaders: {
      name: 'Permission Name',
      description: 'Description',
      category: 'Category',
      rolesCount: 'Roles Count',
      actions: 'Actions'
    },
    
    // Error messages
    errors: {
      nameRequired: 'Permission name is required',
      nameInvalid: 'Invalid permission name. Use the format "action:resource"',
      createFailed: 'Failed to create permission, please try again',
      updateFailed: 'Failed to update permission, please try again',
      deleteFailed: 'Failed to delete permission, please try again',
      fetchFailed: 'Failed to fetch permission, please try again'
    },
    
    // Actions
    createPermission: 'Create Permission',
    updatePermission: 'Update Permission',
    deletePermission: 'Delete Permission',
    confirm: 'Confirm',
    cancel: 'Cancel',
    saving: 'Saving...'
  }
}
