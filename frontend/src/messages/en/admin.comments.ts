// English translation file for comment management in admin panel
export default {
  // Page titles and descriptions
  title: 'Comment Management',
  description: 'Manage user comments in the system',
  
  // Filters and statuses
  filter: {
    title: 'Filter',
    all: 'All Comments',
    approved: 'Approved',
    pending: 'Pending',
    spam: 'Spam',
    trash: 'Trash',
    search: 'Search comments'
  },
  
  // Statistics
  stats: {
    total: 'Total Comments',
    approved: 'Approved',
    pending: 'Pending',
    spam: 'Spam',
    trash: 'Trash'
  },
  
  // Comment table
  table: {
    author: 'Author',
    comment: 'Comment',
    inResponseTo: 'In Response To',
    submitted: 'Submitted',
    status: 'Status',
    actions: 'Actions'
  },
  
  // Comment status
  status: {
    approved: 'Approved',
    pending: 'Pending',
    spam: 'Spam',
    trash: 'Trash'
  },
  
  // Actions
  actions: {
    approve: 'Approve',
    unapprove: 'Unapprove',
    reply: 'Reply',
    edit: 'Edit',
    spam: 'Mark as Spam',
    trash: 'Move to Trash',
    delete: 'Delete Permanently',
    restore: 'Restore',
    viewPost: 'View Post',
    viewThread: 'View Thread'
  },
  
  // Edit comment form
  editForm: {
    title: 'Edit Comment',
    content: 'Content',
    author: 'Author',
    email: 'Email',
    website: 'Website',
    status: 'Status',
    update: 'Update',
    cancel: 'Cancel'
  },
  
  // Reply to comment form
  replyForm: {
    title: 'Reply to Comment',
    content: 'Reply Content',
    submit: 'Submit Reply',
    cancel: 'Cancel'
  },
  
  // Confirmation messages
  confirmations: {
    delete: 'Are you sure you want to permanently delete this comment?',
    trash: 'Are you sure you want to move this comment to trash?',
    spam: 'Are you sure you want to mark this comment as spam?',
    emptyTrash: 'Are you sure you want to empty the trash? This action cannot be undone.',
    deleteAll: 'Are you sure you want to delete all selected comments? This action cannot be undone.',
    approve: 'Are you sure you want to approve this comment?',
    unapprove: 'Are you sure you want to unapprove this comment?'
  },
  
  // Notifications
  notifications: {
    approved: 'Comment approved',
    unapproved: 'Comment unapproved',
    markedAsSpam: 'Comment marked as spam',
    movedToTrash: 'Comment moved to trash',
    deleted: 'Comment permanently deleted',
    restored: 'Comment restored',
    updated: 'Comment updated',
    replied: 'Replied to comment',
    bulkUpdated: '{count} comments updated'
  },
    // UI and interaction
  ui: {
    loading: 'Loading comments...',
    noComments: 'No comments available',
    noCommentsFound: 'No comments found matching your filters',
    selectAll: 'Select All',
    bulkActions: 'Bulk Actions',
    apply: 'Apply',
    showMore: 'Show More',
    emptyTrash: 'Empty Trash'
  },
  
  // Errors
  errors: {
    fetchFailed: 'Failed to fetch comments. Please try again.',
    updateFailed: 'Failed to update comment. Please try again.',
    deleteFailed: 'Failed to delete comment. Please try again.',
    replyFailed: 'Failed to post reply. Please try again.',
    contentRequired: 'Comment content is required',
    contentTooLong: 'Comment cannot exceed 1000 characters',
    authorRequired: 'Author name is required',
    emailInvalid: 'Invalid email format',
    permissionDenied: 'You do not have permission to perform this action'
  }
};
