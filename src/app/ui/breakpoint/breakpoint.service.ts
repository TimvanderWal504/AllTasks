import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

const BREAKPOINT_MD = '(min-width: 768px)';
const BREAKPOINT_LG = '(min-width: 1024px)';
const BREAKPOINT_TABLET = '(min-width: 768px) and (max-width: 1023px)';

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  isMobile(): boolean {
    return !this.breakpointObserver.isMatched(BREAKPOINT_MD);
  }

  isTablet(): boolean {
    return this.breakpointObserver.isMatched(BREAKPOINT_TABLET);
  }

  isDesktop(): boolean {
    return this.breakpointObserver.isMatched(BREAKPOINT_LG);
  }
}
