class EnterpriseAuth {
  constructor() {
    this.currentUser = null;
    this.currentTenant = null;
  }

  async login(email, password, tenantId) {
    try {
      // Simulate enterprise authentication
      const user = {
        id: Date.now(),
        email,
        tenantId,
        role: email.includes('admin') ? 'admin' : 'teacher',
        permissions: this.getPermissions(email.includes('admin') ? 'admin' : 'teacher')
      };
      
      this.currentUser = user;
      this.currentTenant = tenantId;
      localStorage.setItem('enterpriseUser', JSON.stringify(user));
      return user;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async loginWithSSO(provider, tenantId) {
    // Simulate SSO login
    return this.login(`user@${provider}.com`, 'sso', tenantId);
  }

  getPermissions(role) {
    const permissions = {
      admin: ['create', 'read', 'update', 'delete', 'manage_users', 'view_analytics'],
      teacher: ['create', 'read', 'update', 'delete'],
      student: ['read']
    };
    return permissions[role] || permissions.student;
  }

  hasPermission(permission) {
    return this.currentUser?.permissions?.includes(permission) || false;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCurrentTenant() {
    return this.currentTenant;
  }

  logout() {
    this.currentUser = null;
    this.currentTenant = null;
    localStorage.removeItem('enterpriseUser');
  }
}

export default new EnterpriseAuth();