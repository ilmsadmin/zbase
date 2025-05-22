// English translation file for employee management in admin panel
export default {
  // Page titles and descriptions
  title: 'Employee Management',
  description: 'Manage employees and assign roles',
  createEmployeeBtn: 'Create New Employee',
  backToEmployees: 'Back to employees list',
  backToEmployee: 'Back to employee',
  employeeInfoTitle: 'Employee Information',
  employeeRolesTitle: 'Employee Roles',
  
  // Create and edit employee forms
  createForm: {
    title: 'Create New Employee',
    description: 'Add a new employee and configure roles',
    submit: 'Create Employee',
    cancel: 'Cancel',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter employee full name',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter email address',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    passwordConfirmLabel: 'Confirm Password',
    passwordConfirmPlaceholder: 'Confirm your password',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'Enter phone number',
    positionLabel: 'Position',
    positionPlaceholder: 'Enter employee position',
    statusLabel: 'Status',
    statusOptions: {
      active: 'Active',
      inactive: 'Inactive'
    },
    nameRequired: 'Employee name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email',
    passwordRequired: 'Password is required',
    passwordTooShort: 'Password must be at least 8 characters long',
    passwordNoMatch: 'Passwords do not match'
  },
  
  editForm: {
    title: 'Edit Employee',
    description: 'Update employee information and roles',
    submit: 'Update Employee',
    cancel: 'Cancel',
    saveChanges: 'Save Changes'
  },
  
  // Employee details
  employeeDetails: {
    title: 'Employee Details',
    description: 'View detailed information about this employee',
    assignedRoles: 'Assigned Roles',
    noRolesAssigned: 'No roles assigned to this employee',
    id: 'Employee ID',
    email: 'Email',
    phone: 'Phone Number',
    position: 'Position',
    status: 'Status',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    editEmployee: 'Edit Employee',
    deleteEmployee: 'Delete Employee',
    assignRoles: 'Assign Roles'
  },
  
  // Employee table
  table: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    position: 'Position',
    roles: 'Roles',
    status: 'Status',
    createdAt: 'Created At',
    actions: 'Actions'
  },
  
  // Search and filtering
  search: {
    placeholder: 'Search employees...',
    byName: 'By Name',
    byEmail: 'By Email',
    byRole: 'By Role',
    clearFilters: 'Clear Filters'
  },
  
  // Roles management
  roles: {
    title: 'Role Management',
    description: 'Assign and revoke roles for this employee',
    available: 'Available Roles',
    assigned: 'Assigned Roles',
    addRole: 'Add Role',
    removeRole: 'Remove Role',
    saveRoles: 'Save Roles'
  },
    // Status labels
  status: {
    active: 'Active',
    inactive: 'Inactive'
  },
  
  // Action messages
  saving: 'Saving...',
  saved: 'Saved',
  
  // Actions
  actions: {
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    assign: 'Assign Roles'
  },
  
  // Confirmation messages
  confirmDelete: 'Are you sure you want to delete this employee?',
  confirmRoleRemoval: 'Are you sure you want to remove this role?',
  
  // Success messages
  success: {
    created: 'Employee created successfully',
    updated: 'Employee updated successfully',
    deleted: 'Employee deleted successfully',
    rolesUpdated: 'Employee roles updated successfully'
  },
  
  // Error messages
  errors: {
    fetchFailed: 'Failed to fetch employees',
    employeeNotFound: 'Employee not found',
    createFailed: 'Failed to create employee',
    updateFailed: 'Failed to update employee',
    deleteFailed: 'Failed to delete employee',
    roleUpdateFailed: 'Failed to update employee roles'
  },
  
  // Empty states
  empty: {
    title: 'No employees found',
    description: 'Try adjusting your search or filter to find what you\'re looking for',
    noEmployeesYet: 'No employees added yet',
    getStarted: 'Get started by creating a new employee'
  }
};
