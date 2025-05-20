// English translations for permissions in admin panel
export default {
  title: 'Permission Management',
  description: 'Manage system permissions and access control',
  discoverPermissions: 'Discover Permissions',
  normalizePermissions: 'Normalize Permissions',
  discovering: 'Discovering...',
  refresh: 'Refresh',
  searchPlaceholder: 'Search permissions...',
  clearSearch: 'Clear search',
  noResultsFound: 'No results found',
  noPermissions: 'No permissions found',
  noPermissionsInSystem: 'No permissions in the system',
  permission: 'Permission',
  description: 'Description',
  usedBy: 'Used by',
  noDescription: 'No description',
  permissionCount: '{count} permissions',
  roles: 'roles',
  
  // Permission details
  permissionDetails: {
    title: 'Permission Details',
    id: 'ID',
    action: 'Action',
    resource: 'Resource',
    description: 'Description',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    usedByRoles: 'Used by Roles',
    noRolesAssigned: 'No roles use this permission'
  },
  
  // Permission form
  form: {
    createTitle: 'Create Permission',
    editTitle: 'Edit Permission',
    actionLabel: 'Action',
    actionPlaceholder: 'Enter action (e.g., create, read, update, delete)',
    resourceLabel: 'Resource',
    resourcePlaceholder: 'Enter resource (e.g., users, posts, comments)',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Describe what this permission allows',
    submit: 'Save Permission',
    cancel: 'Cancel'
  },
  
  // Permission categories
  categories: {
    all: 'All Categories',
    users: 'Users',
    posts: 'Posts',
    comments: 'Comments',
    roles: 'Roles',
    system: 'System',
    media: 'Media',
    settings: 'Settings'
  },
  
  aboutPermissions: {
    title: 'About Permission Management',
    description: 'Permissions control what users can do in the system.',
    point1: 'Permissions are defined in the format "action:resource".',
    point2: 'Actions include: view, create, update, delete, manage, etc.',
    point3: 'Permissions are assigned to roles, and users are assigned roles.'
  },
  
  // Table columns
  table: {
    permission: 'Permission',
    description: 'Description', 
    rolesCount: 'Roles Count',
    createdAt: 'Created At'
  },
  
  // Actions
  actions: {
    edit: 'Edit',
    delete: 'Delete',
    view: 'View Details',
    assign: 'Assign to Role'
  },
  
  // Confirmation dialogs
  confirmation: {
    deleteTitle: 'Delete Permission',
    deleteMessage: 'Are you sure you want to delete this permission? This may affect users with roles that use this permission.',
    confirmButton: 'Delete',
    cancelButton: 'Cancel'
  },
  
  // Notifications
  notifications: {
    created: 'Permission created successfully',
    updated: 'Permission updated successfully',
    deleted: 'Permission deleted successfully',
    discovered: 'New permissions discovered successfully',
    normalized: 'Permissions normalized successfully'
  },
  
  errors: {
    fetchFailed: 'Failed to load permissions, please try again',
    discoverFailed: 'Failed to discover new permissions, please try again',
    normalizeFailed: 'Failed to normalize permissions, please try again',
    createFailed: 'Failed to create permission, please try again',
    updateFailed: 'Failed to update permission, please try again',
    deleteFailed: 'Failed to delete permission, please try again',
    invalidFormat: 'Invalid permission format. Must be "action:resource"'
  }
};
