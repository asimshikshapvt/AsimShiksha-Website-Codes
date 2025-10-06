import { Component, ElementRef, HostListener, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule], // Added CommonModule for *ngFor
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private sections: Element[] = [];
  private indicators: Element[] = [];
  private typewriterInterval: any;
  
  // Services for typewriter animation
  private services = [
    'Educational Programs',
    'Social Development',
    'Community Outreach',
    'Skill Development',
    'Digital Literacy',
    'Healthcare Initiatives',
    'Environmental Projects',
    'Youth Empowerment',
    'Women Empowerment',
    'Rural Development'
  ];
  
  private currentServiceIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;
  private typewriterElement: HTMLElement | null = null;

  // For particle generation
  particleArray = Array(50).fill(0).map((_, i) => i);

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.sections = Array.from(this.elementRef.nativeElement.querySelectorAll('.section'));
      this.indicators = Array.from(this.elementRef.nativeElement.querySelectorAll('.section-indicator a'));
      
      // Set first indicator as active by default
      if (this.indicators.length > 0) {
        this.indicators[0].classList.add('active');
      }
      
      this.checkScroll();
      this.initTypewriter();
      this.initAnimatedText();
    }
  }

  ngOnDestroy() {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }
  }

  private initTypewriter() {
    this.typewriterElement = this.elementRef.nativeElement.querySelector('.typewriter-text');
    if (this.typewriterElement) {
      this.typewriterInterval = setInterval(() => {
        this.updateTypewriter();
      }, 100);
    }
  }

  private updateTypewriter() {
    if (!this.typewriterElement) return;

    const currentService = this.services[this.currentServiceIndex];
    
    if (this.isDeleting) {
      // Delete characters
      this.currentCharIndex--;
      this.typewriterElement.textContent = currentService.substring(0, this.currentCharIndex);
      
      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentServiceIndex = (this.currentServiceIndex + 1) % this.services.length;
      }
    } else {
      // Add characters
      this.currentCharIndex++;
      this.typewriterElement.textContent = currentService.substring(0, this.currentCharIndex);
      
      if (this.currentCharIndex === currentService.length) {
        // Wait before starting to delete
        setTimeout(() => {
          this.isDeleting = true;
        }, 2000);
      }
    }
  }

  private initAnimatedText() {
    // Initialize animated span text effects
    const animatedTexts = this.elementRef.nativeElement.querySelectorAll('.animate-text');
    animatedTexts.forEach((text: HTMLElement, index: number) => {
      setTimeout(() => {
        text.classList.add('animate');
      }, index * 200);
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScroll();
    }
  }

  private checkScroll() {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') {
      return;
    }
    
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const footerThreshold = documentHeight - windowHeight - 100;
    
    if (scrollPosition >= footerThreshold) {
      this.indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === this.indicators.length - 1) {
          indicator.classList.add('active');
        }
      });
      return;
    }
    
    let currentSection = 0;

    this.sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      
      if (rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3) {
        currentSection = index;
      }
    });

    this.indicators.forEach((indicator, index) => {
      indicator.classList.remove('active');
      if (index === currentSection) {
        indicator.classList.add('active');
      }
    });
  }
}