import { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import { Save, Shield, ChevronDown, ChevronRight } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

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

// Mock permissions data grouped by module
const mockPermissions: PermissionGroup[] = [
  {
    module: 'Products',
    permissions: [
      { id: 'p1', name: 'product:read', description: 'View products', module: 'Products' },
      { id: 'p2', name: 'product:create', description: 'Create products', module: 'Products' },
      { id: 'p3', name: 'product:update', description: 'Update products', module: 'Products' },
      { id: 'p4', name: 'product:delete', description: 'Delete products', module: 'Products' },
    ],
  },
  {
    module: 'Inventory',
    permissions: [
      { id: 'i1', name: 'inventory:read', description: 'View inventory', module: 'Inventory' },
      { id: 'i2', name: 'inventory:adjust', description: 'Adjust inventory', module: 'Inventory' },
      { id: 'i3', name: 'inventory:transfer', description: 'Transfer inventory', module: 'Inventory' },
    ],
  },
  {
    module: 'Customers',
    permissions: [
      { id: 'c1', name: 'customer:read', description: 'View customers', module: 'Customers' },
      { id: 'c2', name: 'customer:create', description: 'Create customers', module: 'Customers' },
      { id: 'c3', name: 'customer:update', description: 'Update customers', module: 'Customers' },
      { id: 'c4', name: 'customer:delete', description: 'Delete customers', module: 'Customers' },
    ],
  },
  {
    module: 'Reports',
    permissions: [
      { id: 'r1', name: 'reports:read', description: 'View reports', module: 'Reports' },
      { id: 'r2', name: 'reports:create', description: 'Create reports', module: 'Reports' },
      { id: 'r3', name: 'reports:export', description: 'Export reports', module: 'Reports' },
    ],
  },
  {
    module: 'Settings',
    permissions: [
      { id: 's1', name: 'users:manage', description: 'Manage users', module: 'Settings' },
      { id: 's2', name: 'roles:manage', description: 'Manage roles', module: 'Settings' },
      { id: 's3', name: 'company:manage', description: 'Manage company settings', module: 'Settings' },
      { id: 's4', name: 'system:manage', description: 'Manage system settings', module: 'Settings' },
    ],
  },
];

// Mock role permissions
const mockRolePermissions = ['p1', 'p2', 'i1', 'c1', 'r1'];

export function PermissionMatrixModal({ open, onClose, role }: PermissionMatrixModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch role permissions when modal opens
    if (open) {
      // In a real app, you would fetch the role's permissions from the API
      setSelectedPermissions(mockRolePermissions);
      // Expand all modules by default
      setExpandedModules(mockPermissions.map(group => group.module));
    }
  }, [open]);

  const togglePermission = (permissionId: string) => {
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
    try {
      // Make API call to save role permissions
      console.log(`Saving permissions for role ${role.id}:`, selectedPermissions);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onClose();
    } catch (error) {
      console.error('Error saving permissions:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Shield className="mr-2 text-primary" size={20} />
          <h2 className="text-xl font-semibold">Permissions: {role.name}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          &times;
        </Button>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
        Manage which actions this role can perform across the system.
      </div>
      
      <div className="max-h-[60vh] overflow-y-auto border border-border rounded-md">
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="text-left p-3 border-b border-border">Permission</th>
              <th className="text-left p-3 border-b border-border w-32">Access</th>
            </tr>
          </thead>
          <tbody>
            {mockPermissions.map((group) => (
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
                          ? 'Deselect All' 
                          : 'Select All'}
                      </Button>
                    </div>
                  </td>
                </tr>
                {expandedModules.includes(group.module) && group.permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-muted/10">
                    <td className="p-3 pl-8 border-b border-border">
                      <div>
                        <div className="font-medium">{permission.description}</div>
                        <div className="text-xs text-muted-foreground">{permission.name}</div>
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
      
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSavePermissions}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Permissions'}
        </Button>
      </div>
    </Modal>
  );
}
