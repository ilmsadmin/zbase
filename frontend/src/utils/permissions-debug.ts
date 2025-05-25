/**
 * Permission debugging utilities
 * Provides helper functions for debugging permission-related issues
 */

export class PermissionsDebug {
  private static readonly STORAGE_KEY = 'permissions_debug';

  /**
   * Enable debug mode for permissions
   */
  static enable(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.STORAGE_KEY, 'true');
      console.log('🔧 Permissions debugging enabled');
    }
  }

  /**
   * Disable debug mode for permissions
   */
  static disable(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.STORAGE_KEY);
      console.log('🔧 Permissions debugging disabled');
    }
  }

  /**
   * Check if debug mode is enabled
   */
  static isEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  /**
   * Toggle debug mode
   */
  static toggle(): boolean {
    const isEnabled = this.isEnabled();
    if (isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return !isEnabled;
  }

  /**
   * Log permission check details
   */
  static logPermissionCheck(
    permission: string,
    hasPermission: boolean,
    context: {
      userId?: number | string;
      userRole?: string;
      userPermissions?: string[];
      component?: string;
    } = {}
  ): void {
    if (!this.isEnabled()) return;

    console.group(`🔐 Permission Check: "${permission}"`);
    console.log(`Result: ${hasPermission ? '✅ GRANTED' : '❌ DENIED'}`);
    
    if (context.userId) {
      console.log(`User ID: ${context.userId}`);
    }
    
    if (context.userRole) {
      console.log(`User Role: ${context.userRole}`);
    }
    
    if (context.userPermissions) {
      console.log(`User Permissions:`, context.userPermissions);
    }
    
    if (context.component) {
      console.log(`Component: ${context.component}`);
    }
    
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.groupEnd();
  }

  /**
   * Log access denial with detailed information
   */
  static logAccessDenial(
    requiredPermissions: string[],
    missingPermissions: string[],
    context: {
      userId?: number | string;
      userRole?: string;
      userPermissions?: string[];
      component?: string;
      showPopup?: boolean;
    } = {}
  ): void {
    if (!this.isEnabled()) return;

    console.group('🚫 Access Denied');
    console.warn(`Required permissions: ${requiredPermissions.join(', ')}`);
    console.warn(`Missing permissions: ${missingPermissions.join(', ')}`);
    
    if (context.userId) {
      console.log(`User ID: ${context.userId}`);
    }
    
    if (context.userRole) {
      console.log(`User Role: ${context.userRole}`);
    }
    
    if (context.userPermissions) {
      console.log(`User Permissions:`, context.userPermissions);
    }
    
    if (context.component) {
      console.log(`Component: ${context.component}`);
    }
    
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.groupEnd();

    // Show popup if requested and in browser environment
    if (context.showPopup && typeof window !== 'undefined') {
      const message = [
        'Access Denied',
        '',
        `Required permissions: ${requiredPermissions.join(', ')}`,
        `Missing permissions: ${missingPermissions.join(', ')}`,
        '',
        `User Role: ${context.userRole || 'Unknown'}`,
        `User Permissions: ${(context.userPermissions || []).join(', ') || 'None'}`
      ].join('\n');
      
      setTimeout(() => alert(message), 100);
    }
  }

  /**
   * Log component render decision
   */
  static logRenderDecision(
    component: string,
    shouldRender: boolean,
    reason: string,
    context: any = {}
  ): void {
    if (!this.isEnabled()) return;

    console.log(
      `🎯 ${component}: ${shouldRender ? '✅ RENDERING' : '❌ NOT RENDERING'} - ${reason}`,
      context
    );
  }
}

// Make debug functions available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).PermissionsDebug = PermissionsDebug;
  console.log('🔧 PermissionsDebug utilities available globally. Use PermissionsDebug.enable() to start debugging.');
}
