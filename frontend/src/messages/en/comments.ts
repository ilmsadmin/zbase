// English translation file for comment management
export default {
  // Title and navigation
  title: 'Comment Management',
  backToComments: 'Back to comments',
  createNewComment: 'Create New Comment',
  editComment: 'Edit Comment',
  viewComment: 'View Comment',

  // Labels and placeholders
  commentContent: 'Comment Content',
  commentContentPlaceholder: 'Enter comment content',
  commentDate: 'Comment Date',
  commentAuthor: 'Author',
  commentStatus: 'Status',
  postTitle: 'Post Title',
  
  // Comment status
  status: {
    approved: 'Approved',
    pending: 'Pending',
    spam: 'Spam',
    trash: 'Trash'
  },

  // Filter and sort
  filter: 'Filter',
  filterByStatus: 'Filter by Status',
  filterAll: 'All Comments',
  filterApproved: 'Approved',
  filterPending: 'Pending',
  filterSpam: 'Spam',
  sortBy: 'Sort by',
  sortNewest: 'Newest',
  sortOldest: 'Oldest',

  // Error messages
  errors: {
    contentRequired: 'Comment content is required',
    contentTooShort: 'Comment content is too short',
    createFailed: 'Failed to create comment, please try again',
    updateFailed: 'Failed to update comment, please try again',
    deleteFailed: 'Failed to delete comment, please try again',
    fetchFailed: 'Failed to fetch comments, please try again'
  },

  // Actions
  createComment: 'Create Comment',
  updateComment: 'Update Comment', 
  deleteComment: 'Delete Comment',
  approveComment: 'Approve Comment',
  rejectComment: 'Reject Comment',
  markAsSpam: 'Mark as Spam',
  moveToTrash: 'Move to Trash',
  restore: 'Restore',
  reply: 'Reply',
  confirm: 'Confirm',
  cancel: 'Cancel',
  saving: 'Saving...',

  // Comments list
  commentsList: 'Comments List',
  searchPlaceholder: 'Search comments...',
  noCommentsFound: 'No comments found',
  loadingComments: 'Loading comments...',
  refreshComments: 'Refresh List',
  
  // Table headers
  tableHeaders: {
    content: 'Content',
    author: 'Author',
    post: 'Post',
    status: 'Status',
    date: 'Date',
    actions: 'Actions'
  },

  // Notifications and confirmations
  notifications: {
    created: 'Comment created successfully',
    updated: 'Comment updated successfully',
    deleted: 'Comment deleted successfully',
    approved: 'Comment approved',
    rejected: 'Comment rejected',
    markedAsSpam: 'Comment marked as spam',
    movedToTrash: 'Comment moved to trash',
    restored: 'Comment restored'
  },
  
  confirmDelete: {
    title: 'Delete Comment',
    message: 'Are you sure you want to delete this comment?',
    confirmButton: 'Delete Comment',
    cancelButton: 'Cancel'
  }
};
