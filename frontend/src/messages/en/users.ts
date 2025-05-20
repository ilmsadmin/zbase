// English translation file for user management
export default {
  // Title and navigation
  title: 'User Management',
  backToUsers: 'Back to users',
  createNewUser: 'Create New User',
  editUser: 'Edit User',
  viewUser: 'View User',

  // Labels and placeholders
  userName: 'User Name',
  userNamePlaceholder: 'Enter user name',
  email: 'Email',
  emailPlaceholder: 'Enter email address',
  password: 'Password',
  passwordPlaceholder: 'Enter password',
  confirmPassword: 'Confirm Password',
  confirmPasswordPlaceholder: 'Re-enter password',
  roles: 'Roles',
  selectRoles: 'Select roles',
  status: 'Status',
  active: 'Active',
  inactive: 'Inactive',

  // Error messages
  errors: {
    nameRequired: 'User name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email format',
    passwordRequired: 'Password is required',
    passwordTooShort: 'Password must be at least 8 characters long',
    passwordsDontMatch: 'Passwords do not match',
    roleRequired: 'Please select at least one role',
    createFailed: 'Failed to create user, please try again',
    updateFailed: 'Failed to update user, please try again',
    deleteFailed: 'Failed to delete user, please try again',
    fetchFailed: 'Failed to load user information, please try again'
  },

  // Actions
  createUser: 'Create User',
  updateUser: 'Update User', 
  deleteUser: 'Delete User',
  resetPassword: 'Reset Password',
  confirm: 'Confirm',
  cancel: 'Cancel',
  saving: 'Saving...',

  // Users list
  usersList: 'Users List',
  searchPlaceholder: 'Search users...',
  noUsersFound: 'No users found',
  loadingUsers: 'Loading users...',
  refreshUsers: 'Refresh list',
  
  // Table headers
  tableHeaders: {
    name: 'Name',
    email: 'Email',
    roles: 'Roles',
    status: 'Status',
    created: 'Created Date',
    actions: 'Actions'
  },
  
  // User details page
  userDetails: 'User Details',
  userActivity: 'Recent Activity',
  noActivity: 'No recent activity',
  
  // Confirm actions
  confirmDelete: 'Are you sure you want to delete this user?',
  confirmResetPassword: 'Are you sure you want to reset password for this user?',
  deleteWarning: 'This action cannot be undone. All data associated with this user will be lost.'
};
