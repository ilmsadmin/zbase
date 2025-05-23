export default {
  title: 'Warehouses',
  subtitle: 'Manage your warehouses and locations',
  create: 'Create Warehouse',
  edit: 'Edit Warehouse',
  delete: 'Delete Warehouse',
  confirmDelete: 'Are you sure you want to delete this warehouse?',
  confirmDeleteLocation: 'Are you sure you want to delete this location?',
  fields: {
    name: 'Name',
    code: 'Code',
    address: 'Address',
    city: 'City',
    state: 'State/Province',
    zipCode: 'Zip/Postal Code',
    country: 'Country',
    phone: 'Phone',
    email: 'Email',
    manager: 'Manager',
    status: 'Status',
    createdAt: 'Created At',
    updatedAt: 'Updated At'
  },
  locations: {
    title: 'Locations',
    create: 'Create Location',
    edit: 'Edit Location',
    delete: 'Delete Location',
    fields: {
      name: 'Location Name',
      code: 'Location Code',
      type: 'Type',
      aisle: 'Aisle',
      shelf: 'Shelf',
      bin: 'Bin',
      status: 'Status',
      createdAt: 'Created At',
      updatedAt: 'Updated At'
    }
  },
  statuses: {
    active: 'Active',
    inactive: 'Inactive',
    maintenance: 'Under Maintenance',
    closed: 'Closed'
  },
  detail: {
    title: 'Warehouse Details',
    overview: 'Overview',
    locations: 'Locations',
    inventory: 'Inventory',
    backToList: 'Back to Warehouses',
    addLocation: 'Add Location'
  },  errors: {
    fetchFailed: 'Failed to fetch warehouse data',
    updateFailed: 'Failed to update warehouse',
    deleteFailed: 'Failed to delete warehouse',
    createFailed: 'Failed to create warehouse',
    locationFetchFailed: 'Failed to fetch location data',
    locationUpdateFailed: 'Failed to update location',
    locationDeleteFailed: 'Failed to delete location',
    locationCreateFailed: 'Failed to create location',
    invalidId: 'Invalid warehouse ID'
  },
  success: {
    created: 'Warehouse created successfully',
    updated: 'Warehouse updated successfully',
    deleted: 'Warehouse deleted successfully',
    locationCreated: 'Location created successfully',
    locationUpdated: 'Location updated successfully',
    locationDeleted: 'Location deleted successfully'
  }
};
