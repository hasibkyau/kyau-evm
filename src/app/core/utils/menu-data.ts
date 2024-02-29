import {AdminMenu} from '../../interfaces/core/admin-menu.interface';

export const SUPER_ADMIN_MENU: AdminMenu[] = [
  {
    id: 0,
    name: 'Dashboard',
    hasSubMenu: false,
    routerLink: 'dashboard',
    icon: 'space_dashboard',
    subMenus: [],
  },
  {
    id: 1,
    name: 'Customization',
    hasSubMenu: true,
    routerLink: null,
    icon: 'auto_fix_off',
    subMenus: [
      {
        id: 1,
        name: 'Carousel',
        hasSubMenu: true,
        routerLink: 'customization/all-carousels',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Banner',
        hasSubMenu: true,
        routerLink: 'customization/all-banner',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Popup',
        hasSubMenu: true,
        routerLink: 'customization/all-popup',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Shop Information',
        hasSubMenu: true,
        routerLink: 'customization/shop-information',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Order Guide',
        hasSubMenu: true,
        routerLink: 'customization/all-order-guide',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 2,
    name: 'Launch Setup',
    hasSubMenu: true,
    routerLink: null,
    icon: 'category',
    subMenus: [
      {
        id: 1,
        name: 'Counters',
        hasSubMenu: true,
        routerLink: 'catalog/all-counter',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: ' Terminals',
        hasSubMenu: true,
        routerLink: 'catalog/all-terminal',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Schedules',
        hasSubMenu: true,
        routerLink: 'catalog/all-schedule',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Routes',
        hasSubMenu: true,
        routerLink: 'catalog/all-route',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Route Relations',
        hasSubMenu: true,
        routerLink: 'catalog/all-route-relation',
        icon: 'arrow_right',
      },
      {
        id: 6,
        name: 'Launch',
        hasSubMenu: true,
        routerLink: 'catalog/all-bus',
        icon: 'arrow_right',
      },

      {
        id: 8,
        name: 'Launch Config',
        hasSubMenu: true,
        routerLink: 'catalog/all-bus-config',
        icon: 'arrow_right',
      },
      {
        id: 7,
        name: 'Trips',
        hasSubMenu: true,
        routerLink: 'catalog/all-trip',
        icon: 'arrow_right',
      },


    ],
  },

  {
    id: 3,
    name: 'Launch Booking',
    hasSubMenu: true,
    routerLink: null,
    icon: 'inventory',
    subMenus: [
      {
        id: 1,
        name: 'Add New Booking',
        hasSubMenu: true,
        routerLink: 'bus-booking/add-booking',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Ticket List',
        hasSubMenu: true,
        routerLink: 'bus-booking/all-tickets',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 12,
    name: 'SEO Page',
    hasSubMenu: true,
    routerLink: null,
    icon: 'inventory',
    subMenus: [
      {
        id: 1,
        name: 'Add SEO Page',
        hasSubMenu: true,
        routerLink: 'seo/add-seo-page',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'All SEO Page',
        hasSubMenu: true,
        routerLink: 'seo/all-seo-page',
        icon: 'arrow_right',
      }
    ],

  },

  {
    id: 126,
    name: 'Launch Gallery',
    hasSubMenu: true,
    routerLink: null,
    icon: 'photo_library',
    subMenus: [
      {
        id: 1,
        name: 'Add Launch Gallery',
        hasSubMenu: true,
        routerLink: 'bus-gallery/add-bus-gallery',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'All Launch Gallery',
        hasSubMenu: true,
        routerLink: 'bus-gallery/all-bus-gallery',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 4,
    name: 'Gallery',
    hasSubMenu: true,
    routerLink: null,
    icon: 'collections',
    subMenus: [
      {
        id: 1,
        name: 'Images',
        hasSubMenu: true,
        routerLink: 'gallery/all-images',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Folders',
        hasSubMenu: true,
        routerLink: 'gallery/all-folders',
        icon: 'arrow_right',
      }
    ],
  },

  // {
  //   id: 5,
  //   name: 'Sales',
  //   hasSubMenu: true,
  //   routerLink: null,
  //   icon: 'real_estate_agent',
  //   subMenus: [
  //     {
  //       id: 1,
  //       name: 'Orders List',
  //       hasSubMenu: true,
  //       routerLink: 'sales/all-orders',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 2,
  //       name: 'Transaction',
  //       hasSubMenu: true,
  //       routerLink: 'sales/transaction',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 3,
  //       name: 'Shipping Charge',
  //       hasSubMenu: true,
  //       routerLink: 'sales/shipping-charge',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 4,
  //       name: 'Prescription Orders',
  //       hasSubMenu: true,
  //       routerLink: 'sales/all-prescription-orders',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 5,
  //       name: ' Request Medicine ',
  //       hasSubMenu: true,
  //       routerLink: 'sales/all-request-orders',
  //       icon: 'arrow_right',
  //     },
  //   ],
  // },

  // {
  //   id: 120,
  //   name: 'Address',
  //   hasSubMenu: true,
  //   routerLink: null,
  //   icon: 'local_offer',
  //   subMenus: [
  //     {
  //       id: 1,
  //       name: 'All Division',
  //       hasSubMenu: true,
  //       routerLink: 'address/all-divisions',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 2,
  //       name: 'Area',
  //       hasSubMenu: true,
  //       routerLink: 'address/all-area',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 3,
  //       name: 'Zone',
  //       hasSubMenu: true,
  //       routerLink: 'address/all-zone',
  //       icon: 'arrow_right',
  //     }
  //   ],
  // },

  {
    id: 6,
    name: 'Offer',
    hasSubMenu: true,
    routerLink: null,
    icon: 'local_offer',
    subMenus: [
      // {
      //   id: 1,
      //   name: 'Promo Offer',
      //   hasSubMenu: true,
      //   routerLink: 'offer/all-promo-offer',
      //   icon: 'arrow_right',
      // },
      {
        id: 2,
        name: 'Coupon List',
        hasSubMenu: true,
        routerLink: 'offer/all-coupon',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 7,
    name: 'User',
    hasSubMenu: true,
    routerLink: null,
    icon: 'person_3',
    subMenus: [
      {
        id: 1,
        name: 'All User',
        hasSubMenu: true,
        routerLink: 'user/user-list',
        icon: 'arrow_right',
      }
    ],
  },
  {
    id: 8,
    name: 'Admin Control',
    hasSubMenu: true,
    routerLink: null,
    icon: 'admin_panel_settings',
    subMenus: [
      {
        id: 1,
        name: 'All Admin',
        hasSubMenu: true,
        routerLink: 'admin-control/all-admins',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 9,
    name: 'Blog Area',
    hasSubMenu: true,
    routerLink: null,
    icon: 'rss_feed',
    subMenus: [
      {
        id: 1,
        name: 'Blog',
        hasSubMenu: true,
        routerLink: 'blog/all-blog',
        icon: 'arrow_right',
      }
    ],
  },
  {
    id: 10,
    name: 'Contact',
    hasSubMenu: true,
    routerLink: null,
    icon: 'contacts',
    subMenus: [
      {
        id: 1,
        name: 'Contact',
        hasSubMenu: true,
        routerLink: 'contact/all-contact',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Newsletter',
        hasSubMenu: true,
        routerLink: 'contact/all-newsletter',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 11,
    name: 'Review',
    hasSubMenu: true,
    routerLink: null,
    icon: 'rate_review',
    subMenus: [
      {
        id: 1,
        name: 'All Review',
        hasSubMenu: true,
        routerLink: 'review',
        icon: 'arrow_right',
      }

    ],
  },

  {
    id: 12,
    name: 'Additional Page',
    hasSubMenu: true,
    routerLink: null,
    icon: 'note_add',
    subMenus: [
      {
        id: 1,
        name: 'Page List',
        hasSubMenu: true,
        routerLink: 'additionl-page/page-list',
        icon: 'arrow_right',
      }

    ],
  },


  {
    id: 13,
    name: 'Profile',
    hasSubMenu: false,
    routerLink: 'profile',
    icon: 'person',

    subMenus: [],
  },


]


export const EDITOR_MENU: AdminMenu[] = [
  {
    id: 0,
    name: 'Dashboard',
    hasSubMenu: false,
    routerLink: 'dashboard',
    icon: 'space_dashboard',
    subMenus: [],
  },
  {
    id: 2,
    name: 'Configuration',
    hasSubMenu: true,
    routerLink: null,
    icon: 'category',
    subMenus: [
      {
        id: 1,
        name: 'Counters',
        hasSubMenu: true,
        routerLink: 'catalog/all-counter',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: ' Terminals',
        hasSubMenu: true,
        routerLink: 'catalog/all-terminal',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Schedules',
        hasSubMenu: true,
        routerLink: 'catalog/all-schedule',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Routes',
        hasSubMenu: true,
        routerLink: 'catalog/all-route',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Route Relations',
        hasSubMenu: true,
        routerLink: 'catalog/all-route-relation',
        icon: 'arrow_right',
      },
      {
        id: 6,
        name: 'Launch',
        hasSubMenu: true,
        routerLink: 'catalog/all-bus',
        icon: 'arrow_right',
      },

      {
        id: 8,
        name: 'Launch Config',
        hasSubMenu: true,
        routerLink: 'catalog/all-bus-config',
        icon: 'arrow_right',
      },
      {
        id: 7,
        name: 'Trips',
        hasSubMenu: true,
        routerLink: 'catalog/all-trip',
        icon: 'arrow_right',
      },


    ],
  },

  {
    id: 3,
    name: 'Launch Booking',
    hasSubMenu: true,
    routerLink: null,
    icon: 'inventory',
    subMenus: [
      {
        id: 1,
        name: 'Add New Booking',
        hasSubMenu: true,
        routerLink: 'bus-booking/add-booking',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Ticket List',
        hasSubMenu: true,
        routerLink: 'bus-booking/all-tickets',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 13,
    name: 'Profile',
    hasSubMenu: false,
    routerLink: 'profile',
    icon: 'person',

    subMenus: [],
  },


]
