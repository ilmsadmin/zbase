import auth from './auth';
import common from './common';
import dashboard from './dashboard';
import admin from './admin';
import profile from './profile';
import permissions from './permissions';
import roles from './roles';
import users from './users';
import posts from './posts';
import comments from './comments';
import adminPermissions from './admin.permissions';
import adminUsers from './admin.users';
import adminRoles from './admin.roles';
import adminComments from './admin.comments';
import adminPosts from './admin.posts';
import adminReports from './admin.reports';
import adminEmployees from './admin.employees';
import adminProducts from './admin.products';
import adminWarehouses from './admin.warehouses';

export default {
  common,
  auth,
  dashboard,  admin: {
    ...admin,
    permissions: adminPermissions,
    users: adminUsers,
    roles: adminRoles,
    comments: adminComments,
    posts: adminPosts,
    reports: adminReports,
    employees: adminEmployees,
    products: adminProducts,
    warehouses: adminWarehouses
  },
  profile,
  permissions,
  roles,
  users,
  posts,
  comments
};
