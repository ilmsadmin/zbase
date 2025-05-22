// English messages for product management module
export default {
  title: 'Product Management',
  list: {
    title: 'Product List',
    search: 'Search products...',
    filter: 'Filter by',
    allCategories: 'All Categories',
    new: 'Add New Product',
    import: 'Import from Excel',
    export: 'Export to Excel'
  },
  table: {
    id: 'ID',
    sku: 'SKU',
    image: 'Image',
    name: 'Product Name',
    category: 'Category',
    price: 'Price',
    stock: 'Stock',
    status: 'Status',
    actions: 'Actions'
  },
  status: {
    active: 'Active',
    inactive: 'Inactive',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    discontinued: 'Discontinued'
  },
  detail: {
    title: 'Product Details',
    basicInfo: 'Basic Information',
    pricing: 'Pricing Information',
    inventory: 'Inventory Information',
    attributes: 'Product Attributes',
    media: 'Images & Media',
    related: 'Related Products'
  },
  form: {
    basicInfo: {
      name: 'Product Name',
      namePlaceholder: 'Enter product name',
      sku: 'SKU',
      skuPlaceholder: 'Enter SKU',
      barcode: 'Barcode',
      barcodePlaceholder: 'Enter barcode',
      category: 'Category',
      categoryPlaceholder: 'Select category',
      description: 'Description',
      descriptionPlaceholder: 'Enter product description',
      shortDescription: 'Short Description',
      shortDescriptionPlaceholder: 'Enter short description',
      brand: 'Brand',
      brandPlaceholder: 'Select brand',
      status: 'Status',
      statusPlaceholder: 'Select status'
    },
    pricing: {
      retailPrice: 'Retail Price',
      retailPricePlaceholder: 'Enter retail price',
      wholesalePrice: 'Wholesale Price',
      wholesalePricePlaceholder: 'Enter wholesale price',
      costPrice: 'Cost Price',
      costPricePlaceholder: 'Enter cost price',
      tax: 'Tax (%)',
      taxPlaceholder: 'Enter tax percentage',
      priceList: 'Price List',
      priceListPlaceholder: 'Select price list'
    },
    inventory: {
      trackInventory: 'Track Inventory',
      initialStock: 'Initial Stock',
      initialStockPlaceholder: 'Enter quantity',
      lowStockThreshold: 'Low Stock Threshold',
      lowStockThresholdPlaceholder: 'Enter threshold value',
      warehouse: 'Warehouse',
      warehousePlaceholder: 'Select warehouse',
      location: 'Warehouse Location',
      locationPlaceholder: 'Select location'
    },
    attributes: {
      add: 'Add Attribute',
      name: 'Attribute Name',
      namePlaceholder: 'Enter attribute name',
      value: 'Value',
      valuePlaceholder: 'Enter value',
      remove: 'Remove'
    },
    media: {
      mainImage: 'Main Image',
      additionalImages: 'Additional Images',
      dragAndDrop: 'Drag and drop files or',
      browse: 'Browse',
      uploadRequirements: 'PNG, JPG or GIF (max. 5MB)',
      remove: 'Remove'
    },
    related: {
      add: 'Add Related Products',
      search: 'Search Products',
      selected: 'Selected:',
      remove: 'Remove'
    },
    buttons: {
      save: 'Save Product',
      saveAndNew: 'Save and Add Another',
      cancel: 'Cancel',
      delete: 'Delete Product'
    }
  },  messages: {
    created: 'Product has been created successfully.',
    updated: 'Product has been updated successfully.',
    deleted: 'Product has been deleted successfully.',
    error: 'An error occurred. Please try again later.'
  },
  loading: 'Loading product data...',
  refresh: 'Refresh',
  searchPlaceholder: 'Search by product name or code',
  filterByCategory: 'Filter by category',
  code: 'Code',
  name: 'Product Name',
  category: 'Category',
  basePrice: 'Base Price',
  inventory: 'Inventory',
  actions: 'Actions',
  noProducts: 'No products found',
  addProduct: 'Add New Product',
  barcode: 'Barcode',
  taxRate: 'Tax Rate',
  units: 'units',
  showing: 'Showing',
  to: 'to',
  of: 'of',
  results: 'results',
  previous: 'Previous',
  next: 'Next',
  uncategorized: 'Uncategorized',
  confirmDelete: 'Are you sure you want to delete this product?',
  errors: {
    fetchFailed: 'Failed to load product data. Please try again later.',
    deleteFailed: 'Failed to delete product. Please try again later.'
  },
  allCategories: 'All Categories',
  categories: {
    title: 'Product Categories',
    new: 'Add New Category',
    edit: 'Edit Category',
    form: {
      name: 'Category Name',
      namePlaceholder: 'Enter category name',
      parent: 'Parent Category',
      parentPlaceholder: 'Select parent category (if any)',
      description: 'Description',
      descriptionPlaceholder: 'Enter category description',
      save: 'Save Category',
      cancel: 'Cancel'
    },
    messages: {
      created: 'Category has been created successfully.',
      updated: 'Category has been updated successfully.',
      deleted: 'Category has been deleted successfully.',
      error: 'An error occurred. Please try again later.'
    }
  },
  attributes: {
    title: 'Product Attributes',
    new: 'Add New Attribute',
    edit: 'Edit Attribute',
    form: {
      name: 'Attribute Name',
      namePlaceholder: 'Enter attribute name (e.g., Color, Size)',
      type: 'Attribute Type',
      typePlaceholder: 'Select attribute type',
      values: 'Attribute Values',
      valuesPlaceholder: 'Enter values and press Enter (e.g., Red, Blue, Yellow)',
      isFilterable: 'Allow filtering products by this attribute',
      isRequired: 'This attribute is required when creating products',
      save: 'Save Attribute',
      cancel: 'Cancel'
    },
    types: {
      text: 'Text',
      number: 'Number',
      boolean: 'Yes/No',
      select: 'Select (single)',
      multiSelect: 'Select (multiple)',
      color: 'Color',
      date: 'Date'
    },
    messages: {
      created: 'Attribute has been created successfully.',
      updated: 'Attribute has been updated successfully.',
      deleted: 'Attribute has been deleted successfully.',
      error: 'An error occurred. Please try again later.'
    }
  }
};
