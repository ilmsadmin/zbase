// English translations for admin user management
export default {
  // Page titles
  title: 'User Management',
  createUser: 'Create New User',
  editUser: 'Edit User',
  userDetails: 'User Details',
  createUserDescription: 'Create a new user account with role-based permissions',
  editUserDescription: 'Modify user information and permissions',
  userDetailsDescription: 'Detailed information about user account',
  
  // Navigation
  backToUsers: 'Back to Users',
  
  // Form labels
  form: {
    id: 'ID',
    email: 'Email Address',
    password: 'Password',
    newPassword: 'New Password',
    name: 'Full Name',
    roles: 'Assigned Roles',
    rolesHint: 'Hold Ctrl/Cmd to select multiple roles',
    changePassword: 'Change Password'
  },
  
  // Table headers
  table: {
    name: 'Name',
    email: 'Email',
    roles: 'Roles',
    createdAt: 'Created',
    updatedAt: 'Last Updated',
    actions: 'Actions'
  },
  
  // Button labels
  addUser: 'Add User',
  save: 'Save User',
  update: 'Update User',
  edit: 'Edit',
  delete: 'Delete',
  view: 'View',
  cancel: 'Cancel',
  saving: 'Saving...',
  refresh: 'Refresh',
  clearSearch: 'Clear Search',
  
  // Messages
  confirmDelete: 'Are you sure you want to delete this user? This action cannot be undone.',
  noUsers: 'No users found',
  noResultsFound: 'No users match your search criteria',
  getStarted: 'Get started by creating a new user',
  userNotFound: 'User not found',
  
  // Search
  searchPlaceholder: 'Search by name or email',
  
  // Pagination
  pagination: {
    showing: 'Showing',
    to: 'to',
    of: 'of',
    results: 'results',
    previous: 'Previous',
    next: 'Next'
  },
  
  // Errors
  errors: {
    emailRequired: 'Email is required',
    invalidEmail: 'Invalid email format',
    passwordRequired: 'Password is required',
    passwordTooShort: 'Password must be at least 6 characters',
    nameRequired: 'Name is required',
    createFailed: 'Failed to create user. Please try again.',
    updateFailed: 'Failed to update user. Please try again.',
    deleteFailed: 'Failed to delete user. Please try again.',
    fetchFailed: 'Failed to load user information. Please try again.'
  }
};
