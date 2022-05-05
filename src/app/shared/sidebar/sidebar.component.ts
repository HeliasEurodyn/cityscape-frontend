import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {CommandNavigatorService} from '../../services/system/sofia/command-navigator.service';
import {MenuService} from '../../services/crud/sofia/menu.service';
import {MenuDTO} from '../../dtos/sofia/menu/menuDTO';
import {LanguageService} from '../../services/system/sofia/language.service';


export interface RouteInfo {
  id: string;
  path: string;
  title: string;
  icon: string;
  class: string;
  type: string;
  children: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
  // {path: '/dashboard', title: 'Dashboard', icon: 'nc-bank', cssClass: '', children: null},
  // {path: '#', title: 'Other Menus', icon: 'nc-layout-11', cssClass: 'parent-menu', children: null},
  // {path: '/listDto-designer-list', title: 'TableDTO Designer', icon: 'nc-settings', cssClass: '', children: null},
  // {path: '/menu-designer-list', title: 'MenuDTO Designer', icon: 'nc-tile-56', cssClass: '', children: null},
];

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {

  title = 'appBootstrap';

  public selectedMenuItems: any[];
  public defaultMenuItems: any[];
  public menuHeaders: any[];
  public sidebarMenu: MenuDTO;
  public languageSelectionSubject;

  constructor(private navigatorService: CommandNavigatorService,
              private languageService: LanguageService,
              private menuService: MenuService) {

    navigatorService.sidebarMenuEmmiter.subscribe(id => {

      this.getMenuFromBackend(id);
    });
  }

  ngOnInit() {
    if (sessionStorage.getItem('sidebarMenu') != null) {
      this.sidebarMenu = JSON.parse(sessionStorage.getItem('sidebarMenu'));
    } else {
      const user = JSON.parse(localStorage.getItem('loggedin_user'));
      this.sidebarMenu = user['sidebarMenu'];
    }

    this.selectedMenuItems = this.sidebarMenu.menuFieldList;
    this.defaultMenuItems = this.sidebarMenu.menuFieldList;
  }

  ngAfterViewInit() {
    this.applyLanguageSelection();
  }

  ngOnDestroy() {
    this.languageSelectionSubject.unsubscribe();
  }

  applyLanguageSelection() {
    this.languageSelectionSubject = this.languageService.languageSelectionEmmiter.subscribe((languageCode: string) => {
      this.getMenuFromBackend(this.sidebarMenu.id);
    });
  }

  getMenuFromBackend(id) {
    const language = JSON.parse(localStorage.getItem('loggedin_user')).currentLanguage;
    const languageId = language == null ? 0 : language.id;

    this.menuService.getMenuFromBackend(id, languageId).subscribe(data => {
      this.menuHeaders = [];
      this.selectedMenuItems = data['menuFieldList'];
      this.defaultMenuItems = data['menuFieldList'];
      sessionStorage.setItem('sidebarMenu', JSON.stringify(data));
    });
  }

  parentMenuSelection(id: string) {
    this.menuHeaders = [];
    this.selectedMenuItems = this.defaultMenuItems;
    this.parentMenuSelectionRecursive(this.selectedMenuItems, id);
    this.menuHeaders.reverse();
  }

  parentMenuSelectionRecursive(menuItems: any[], id: string) {
    for (const menuItem of menuItems) {
      if (menuItem.id === id) {
        this.menuHeaders.push(menuItem);
        this.selectedMenuItems = menuItem.menuFieldList;
        return true;
      } else if (menuItem.command === '#parent-menu#') {
        const foundInBranch = this.parentMenuSelectionRecursive(menuItem.menuFieldList, id);
        if (foundInBranch) {
          this.menuHeaders.push(menuItem);
          return true;
        }
      }
    }
    return false;
  }

  parentMenuUnselection(id: string) {
    this.menuHeaders = [];
    this.selectedMenuItems = this.defaultMenuItems;
    this.parentMenuUnselectionRecursive(this.selectedMenuItems, id);
    this.menuHeaders.reverse();
  }

  parentMenuUnselectionRecursive(menuItems: any[], id: string) {
    for (const menuItem of menuItems) {
      if (menuItem.id === id) {
        this.selectedMenuItems = menuItems;
        return true;
      }
      if (menuItem.command === '#parent-menu#') {
        const foundInBranch = this.parentMenuUnselectionRecursive(menuItem.menuFieldList, id);
        if (foundInBranch) {
          this.menuHeaders.push(menuItem);
          return true;
        }
      }
    }
    return false;
  }

  navigate(menuItem) {
    this.navigatorService.navigate(menuItem.command);
    // this.internalMessageService.publishMessage('openTabEvent', {path: menuItem.path, title: menuItem.title});
  }

}