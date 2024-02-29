import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {

  allPages: any[] = [
    { _id: 1, name: 'Disclaimer', slug: 'disclaimer' },
    { _id: 2, name: 'About Us', slug: 'about-us' },
    { _id: 3, name: 'Return Policy', slug: 'return-policy' },
    { _id: 4, name: 'Privacy Policy', slug: 'privacy-policy' },
    { _id: 5, name: 'Terms and Conditions', slug: 'terms-and-conditions' },
    { _id: 6, name: 'Warranty Details', slug: 'warranty-details' },
    { _id: 7, name: 'FAQ', slug: 'faq' }
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
