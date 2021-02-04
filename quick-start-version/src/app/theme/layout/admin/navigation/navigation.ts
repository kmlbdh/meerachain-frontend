import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: any;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: any[];
}

export interface Navigation extends NavigationItem {
  children?: any[];

}

@Injectable()
export class NavigationItem {
  allNavigationMenu = [
    {
      id: 'Dashboard',
      title: 'Dashboard',
      type: 'item',
      url: `/impostorcompany`,
      classes: 'nav-item',
      icon: 'fas fa-id-card',
      showAll: true,
      first:true
    },
    {
      id: 'Contacts',
      title: 'Contacts',
      type: 'item',
      url: `/impostorcompany/contacts`,
      classes: 'nav-item',
      icon: 'fas fa-id-card'
    },
    {
      id: 'usersaccessmanager',
      title: 'Access Manager',
      type: 'item',
      url: `/impostorcompany/usersaccessmanager`,
      classes: 'nav-item',
      icon: 'fas fa-key'
    },
    {
      id: 'Settings',
      title: 'Settings',
      type: 'item',
      url: `/impostorcompany/settings`,
      classes: 'nav-item',
      icon: 'fas fa-cogs',
      showAll: true
    },
    {
      id: 'Warehouses',
      title: 'Warehouses',
      type: 'item',
      url: `/impostorcompany/warehouses`,
      classes: 'nav-item',
      icon: "fas fa-warehouse"
    },
    {
      id: 'Categories',
      title: 'Categories',
      type: 'item',
      url: `/impostorcompany/categories`,
      classes: 'nav-item',
      icon: 'fas fa-sitemap'
    },
    {
      id: 'items',
      title: 'Items',
      type: 'item',
      url: `/impostorcompany/items`,
      classes: 'nav-item',
      icon: 'feather icon-sidebar'
    },
    {
      id: 'orders',
      title: 'Orders',
      type: 'item',
      url: `/impostorcompany/orders`,
      classes: 'nav-item',
      icon: "feather icon-file-minus",
    },
    {
      id: 'performas',
      title: 'Proformas',
      type: 'item',
      url: `/impostorcompany/performas`,
      classes: 'nav-item',
      icon: "feather icon-file-minus",
    },
    {
      id: 'customprocess',
      title: 'Custom Process',
      type: 'item',
      url: `/impostorcompany/customprocess`,
      classes: 'nav-item',
      icon: "feather icon-file-minus",
    },
    {
      id: 'shippingprocess',
      title: 'Shipping Process',
      type: 'item',
      url: `/impostorcompany/shippingprocess`,
      classes: 'nav-item',
      icon: "fas fa-dolly",
    },
    {
      id: 'containerprocess',
      title: 'Container Process',
      type: 'item',
      url: `/impostorcompany/containerprocess`,
      classes: 'nav-item',
      icon: "fas fa-box-open",
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: `/impostorcompany/reports`,
      classes: 'nav-item',
      icon: "far fa-file-pdf",
    },
    {
      id: 'mytasks',
      title: 'My Tasks',
      type: 'item',
      url: `/impostorcompany/mytasks`,
      classes: 'nav-item',
      icon: "far fa-box-open",
      showAll: true
    },

  ]

  NavigationItems = [];


  changeNavigation = new Subject();
  constructor(router: Router) {
    console.log("NavigationItem - router.url", router.url.search("impostorcompany"));
    var impostorcompany = 'impostorcompany';
    if (router.url.search(impostorcompany) == 1) {
      // NavigationItems = [
      //   {
      //     id: 'Contacts',
      //     title: 'Contacts',
      //     type: 'item',
      //     url: `/impostorcompany/contacts`,
      //     classes: 'nav-item',
      //     icon: 'fas fa-id-card'
      //   },
      //   {
      //     id: 'Settings',
      //     title: 'Settings',
      //     type: 'item',
      //     url: `/impostorcompany/settings`,
      //     classes: 'nav-item',
      //     icon: 'fas fa-cogs'
      //   },
      //   {
      //     id: 'Warehouses',
      //     title: 'Warehouses',
      //     type: 'item',
      //     url: `/impostorcompany/warehouses`,
      //     classes: 'nav-item',
      //     icon: "fas fa-warehouse"
      //   },
      //   {
      //     id: 'Categories',
      //     title: 'Categories',
      //     type: 'item',
      //     url: `/impostorcompany/categories`,
      //     classes: 'nav-item',
      //     icon: 'fas fa-sitemap'
      //   },
      //   {
      //     id: 'Items',
      //     title: 'Items',
      //     type: 'item',
      //     url: `/impostorcompany/items`,
      //     classes: 'nav-item',
      //     icon: 'feather icon-sidebar'
      //   },
      //   {
      //     id: 'Orders',
      //     title: 'Orders',
      //     type: 'item',
      //     url: `/impostorcompany/orders`,
      //     classes: 'nav-item',
      //     icon: "feather icon-file-minus",
      //   },
      //   {
      //     id: 'CustomProcess',
      //     title: 'Custom Process',
      //     type: 'item',
      //     url: `/impostorcompany/customprocess`,
      //     classes: 'nav-item',
      //     icon: "feather icon-file-minus",
      //   },
      //   {
      //     id: 'shippingProcess',
      //     title: 'Shipping Process',
      //     type: 'item',
      //     url: `/impostorcompany/shippingprocess`,
      //     classes: 'nav-item',
      //     icon: "feather icon-file-minus",
      //   },
      //   {
      //     id: 'containerProcess',
      //     title: 'Container Process',
      //     type: 'item',
      //     url: `/impostorcompany/containerprocess`,
      //     classes: 'nav-item',
      //     icon: "feather icon-file-minus",
      //   },
      //   {
      //     id: 'Performas',
      //     title: 'Performas',
      //     type: 'item',
      //     url: `/impostorcompany/performas`,
      //     classes: 'nav-item',
      //     icon: "feather icon-file-minus",
      //   },
      //   {
      //     id: 'reports',
      //     title: 'Reports',
      //     type: 'item',
      //     url: `/impostorcompany/reports`,
      //     classes: 'nav-item',
      //     icon: "far fa-file-pdf",
      //   }
      // ]
    }
  }
  get() {
    return this.NavigationItems;
  }
}
