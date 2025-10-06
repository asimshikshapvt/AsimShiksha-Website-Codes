import { Component, AfterViewInit, ElementRef, Renderer2, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ServiceCategory {
  title: string;
  icon?: string;
  description?: string;
  points?: string[];
  highlight?: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  private scrollListener?: () => void;
  private isBrowser: boolean;

  hero = {
    kicker: 'Key Services',
    title: 'What We Provide',
    tagline: 'MSME Registered • Multi-domain Expertise • Outcome Focused',
    blurb: 'We deliver an integrated portfolio spanning education, technology, engineering, people operations, compliance, logistics, trading and more — designed to accelerate growth and operational excellence.'
  };

  services: ServiceCategory[] = [
    {
      title: 'Education & Training',
      icon: '🎓',
      description: 'Educational support services, coaching, and skill development initiatives.'
    },
    {
      title: 'IT & Digital Solutions',
      icon: '💻',
      points: [
        'Computer programming & software development',
        'IT consultancy & solution architecture',
        'Web portals & platform engineering',
        'Software deployment & installation',
        'Practical training in penetration testing and bug bounty hunting'
      ],
      highlight: true
    },
    {
      title: 'Engineering & Consultancy',
      icon: '🧪',
      points: [
        'Architectural & engineering services',
        'Technical testing & analysis'
      ]
    },
    {
      title: 'Employment & HR Solutions',
      icon: '👥',
      points: [
        'Recruitment & talent acquisition',
        'Temporary staffing solutions',
        'HR management & advisory'
      ]
    },
    {
      title: 'Travel & Tourism',
      icon: '✈️',
      description: 'Travel agency operations, tour planning, and reservation management.'
    },
    {
      title: 'Repair & Support Services',
      icon: '🛠️',
      description: 'Repair & maintenance of computers and peripheral equipment.'
    },
    {
      title: 'Veterinary Services',
      icon: '🐾',
      description: 'Animal healthcare and veterinary consultancy.'
    },
    {
      title: 'Trading Activities',
      icon: '🛒',
      points: [
        'Retail sale of hardware, paints & DIY materials',
        'Carpets, rugs, curtains & furnishings',
        'Household appliances, furniture & security systems',
        'Stationery, office supplies & books'
      ]
    },
    {
      title: 'Courier & Logistics',
      icon: '🚚',
      description: 'Postal and courier services ensuring smooth business connectivity.'
    },
    {
      title: 'Registration & Compliance',
      icon: '📜',
      description: 'Regulatory filings, certifications & compliance enablement.'
    }
  ];

  constructor(private el: ElementRef, private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    this.initScrollAnimation();
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private initScrollAnimation() {
    if (!this.isBrowser) return;
    
    const servicesGrid = this.el.nativeElement.querySelector('.services-grid');
    
    if (!servicesGrid) return;

    // Start with sleep state
    this.renderer.addClass(servicesGrid, 'scroll-sleep');

    // Create intersection observer for better performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Grid is visible, wake up cards
          this.renderer.removeClass(servicesGrid, 'scroll-sleep');
          this.renderer.addClass(servicesGrid, 'scroll-awake');
          
          // Disconnect observer after first trigger
          observer.disconnect();
        }
      });
    }, {
      threshold: 0.3, // Trigger when 30% of the grid is visible
      rootMargin: '0px 0px -100px 0px' // Trigger 100px before the grid comes into view
    });

    observer.observe(servicesGrid);
  }

  trackByTitle(_: number, item: ServiceCategory) {
    return item.title;
  }
}