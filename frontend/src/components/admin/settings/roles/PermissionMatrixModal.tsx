import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import { Save, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import permissionsService, { type Permission } from '@/lib/services/permissionsService';
import rolesService from '@/lib/services/rolesService';

interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

interface PermissionMatrixModalProps {
  open: boolean;
  onClose: () => void;
  role: {
    id: string;
    name: string;
    description: string;
  };
}

export function PermissionMatrixModal({ open, onClose, role }: PermissionMatrixModalProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Group permissions by module (extracted from action name)
  const groupPermissionsByModule = (permissions: Permission[]): PermissionGroup[] => {
    const grouped = permissions.reduce((acc, permission) => {
      // Extract module from action name (e.g., "products.read" -> "Products")
      const module = permission.action.split('.')[0];
      const moduleName = module.charAt(0).toUpperCase() + module.slice(1);
      
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }
      acc[moduleName].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);

    return Object.entries(grouped).map(([module, permissions]) => ({
      module,
      permissions: permissions.sort((a, b) => a.action.localeCompare(b.action))
    })).sort((a, b) => a.module.localeCompare(b.module));
  };

  // Load permissions data
  const loadPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [allPerms, rolePerms] = await Promise.all([
        permissionsService.getAll(),
        permissionsService.getByRoleId(parseInt(role.id))
      ]);
      
      setAllPermissions(allPerms);
      setRolePermissions(rolePerms);
      setSelectedPermissions(rolePerms.map(p => p.id));
    } catch (err) {
      console.error('Error loading permissions:', err);
      setError('Không thể tải danh sách quyền. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when modal opens or role changes
  useEffect(() => {
    if (open && role) {
      loadPermissions();
    }
  }, [open, role]);

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };
  const toggleModule = (module: string) => {
    setExpandedModules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module) 
        : [...prev, module]
    );
  };
  
  const toggleAllModulePermissions = (module: string, permissions: Permission[]) => {
    const permissionIds = permissions.map(p => p.id);
    const allSelected = permissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // Remove all module permissions
      setSelectedPermissions(prev => prev.filter(id => !permissionIds.includes(id)));
    } else {
      // Add all module permissions
      setSelectedPermissions(prev => {
        const newSelected = [...prev];
        permissionIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  const handleSavePermissions = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get current role permissions
      const currentPermissionIds = rolePermissions.map(p => p.id);
      
      // Determine permissions to add and remove
      const toAdd = selectedPermissions.filter(id => !currentPermissionIds.includes(id));
      const toRemove = currentPermissionIds.filter(id => !selectedPermissions.includes(id));
      
      // Execute permission updates
      const roleId = parseInt(role.id);
      const promises = [
        ...toAdd.map(permId => permissionsService.assignToRole(roleId, permId)),
        ...toRemove.map(permId => permissionsService.removeFromRole(roleId, permId))
      ];
      
      await Promise.all(promises);
      
      onClose();
    } catch (error) {
      console.error('Error saving permissions:', error);
      setError('Không thể lưu quyền. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group permissions for display
  const permissionGroups = groupPermissionsByModule(allPermissions);
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Shield className="mr-2 text-primary" size={20} />
          <h2 className="text-xl font-semibold">Quyền hạn: {role.name}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          &times;
        </Button>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
        Quản lý các hành động mà vai trò này có thể thực hiện trong hệ thống.
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-muted-foreground">Đang tải danh sách quyền...</div>
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto border border-border rounded-md">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left p-3 border-b border-border">Quyền</th>
                <th className="text-left p-3 border-b border-border w-32">Truy cập</th>
              </tr>
            </thead>
            <tbody>
              {permissionGroups.map((group) => (
                <React.Fragment key={group.module}>
                  <tr className="bg-muted/20 hover:bg-muted/30 cursor-pointer" onClick={() => toggleModule(group.module)}>
                    <td colSpan={2} className="p-3 border-b border-border">
                      <div className="flex items-center">
                        {expandedModules.includes(group.module) ? (
                          <ChevronDown size={16} className="mr-2" />
                        ) : (
                          <ChevronRight size={16} className="mr-2" />
                        )}
                        <span className="font-medium">{group.module}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAllModulePermissions(group.module, group.permissions);
                          }}
                        >
                          {group.permissions.every(p => selectedPermissions.includes(p.id)) 
                            ? 'Bỏ chọn tất cả' 
                            : 'Chọn tất cả'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedModules.includes(group.module) && group.permissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-muted/10">
                      <td className="p-3 pl-8 border-b border-border">
                        <div>
                          <div className="font-medium">{permission.description || permission.action}</div>
                          <div className="text-xs text-muted-foreground">{permission.action}</div>
                        </div>
                      </td>
                      <td className="p-3 border-b border-border">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                          />
                        </label>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting || isLoading}
        >
          Hủy
        </Button>
        <Button 
          onClick={handleSavePermissions}
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu quyền'}
        </Button>
      </div>
    </Modal>
  );
}
