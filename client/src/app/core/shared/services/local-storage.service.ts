import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() {
  }

  public getCurrentUser() {
    if (localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser'));
    } else {
      return null;
    }
  }

  public checkUserRole() {
    let user = this.getCurrentUser();
    let userRole = '';
    if (user) {
      switch (user.roleId) {
        case 1:
          userRole = 'ApplicationAdmin';
          break;
        case 2:
          userRole = 'SuperAdmin';
          break;
        case 3:
          userRole = 'LabAdmin';
          break;
        case 4:
          userRole = 'LabUser';
          break;
        case 5:
          userRole = 'SuperUser';
          break;
        default:
          break;
      }
    }
    return userRole;
  }


  public getUserDetail() {
    let user = this.getCurrentUser();
    if (user) {
      return user.User;
    }
    return null;
  }

  public setLabLogo(data) {
    localStorage.setItem('labLogo', JSON.stringify(data));
  }

  public getLabLogo() {
    return localStorage.getItem('labLogo');
  }

  public setQCDashboard(data) {
    localStorage.setItem('QCDashboard', JSON.stringify(data));
  }

  public getQCDashboard() {
    return localStorage.getItem('QCDashboard');
  }

  public setSMDashboard(data) {
    localStorage.setItem('SMDashboard', JSON.stringify(data));
  }

  public getSMDashboard() {
    return localStorage.getItem('SMDashboard');
  }


  public setUserIcon(data) {
    localStorage.setItem('userIcon', JSON.stringify(data));
  }

  public getUserIcon() {
    return localStorage.getItem('userIcon');
  }

  public getAccessToken(): string {
    let currentUser = this.getCurrentUser();
    if (currentUser) {
      return 'Bearer ' + currentUser.access_token;
    }
    return '';
  }


  public setCurrentUser(token) {
    localStorage.removeItem('currentUser');
    localStorage.setItem('currentUser', JSON.stringify(token));
  }

  public getModuleName() {
    return localStorage.getItem('moduleName');
  }

  public setModuleName(moduleName: string) {
    localStorage.setItem('moduleName', moduleName);
  }

  public getTopMenu() {
    if (localStorage.getItem('selectedTopMenu')) {
      return localStorage.getItem('selectedTopMenu');
    } else {
      return '';
    }
  }

  public setTopMenu(selectedTopMenu: string) {
    localStorage.setItem('selectedTopMenu', selectedTopMenu);
  }

  public setBreadcrumbsValue(breadcrumbs: string) {
    localStorage.setItem('selectedBreadcrumbs', breadcrumbs);
  }

  public getBreadcrumbsValue() {
    return localStorage.getItem('selectedBreadcrumbs');
  }

  public setLoggedUser() {
    let user = this.getCurrentUser();
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  public getLoggedUser() {
    return JSON.parse(localStorage.getItem('loggedUser'));
  }

  public removeLoggedUser() {
    localStorage.removeItem('loggedUser');
  }

  public removeLogin() {
    // remove user from local storage to log user out    
    localStorage.removeItem('SMDashboard');
    localStorage.removeItem('QCDashboard');
    localStorage.removeItem('userIcon');
    localStorage.removeItem('labLogo');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('moduleName');
    localStorage.removeItem('selectedTopMenu');
  }
}
