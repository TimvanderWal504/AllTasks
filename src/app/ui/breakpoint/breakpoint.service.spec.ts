import { TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointService } from './breakpoint.service';

describe('BreakpointService', () => {
  let service: BreakpointService;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(() => {
    breakpointObserverSpy = jasmine.createSpyObj<BreakpointObserver>(
      'BreakpointObserver',
      ['observe', 'isMatched']
    );

    TestBed.configureTestingModule({
      providers: [
        BreakpointService,
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
      ],
    });
  });

  describe('isMobile', () => {
    it('should return true when viewport is below md breakpoint', () => {
      breakpointObserverSpy.isMatched.and.returnValue(false);
      service = TestBed.inject(BreakpointService);
      expect(service.isMobile()).toBeTrue();
    });

    it('should return false when viewport is at md breakpoint or above', () => {
      breakpointObserverSpy.isMatched.and.returnValue(true);
      service = TestBed.inject(BreakpointService);
      expect(service.isMobile()).toBeFalse();
    });
  });

  describe('isTablet', () => {
    it('should return true when viewport matches tablet breakpoint range', () => {
      breakpointObserverSpy.isMatched.and.callFake((query: string | string[]) => {
        const queryStr = Array.isArray(query) ? query[0] : query;
        return queryStr.includes('768') && !queryStr.includes('1024');
      });
      service = TestBed.inject(BreakpointService);
      expect(service.isTablet()).toBeTrue();
    });
  });

  describe('isDesktop', () => {
    it('should return true when viewport is at lg breakpoint or above', () => {
      breakpointObserverSpy.isMatched.and.callFake((query: string | string[]) => {
        const queryStr = Array.isArray(query) ? query[0] : query;
        return queryStr.includes('1024');
      });
      service = TestBed.inject(BreakpointService);
      expect(service.isDesktop()).toBeTrue();
    });

    it('should return false when viewport is below lg breakpoint', () => {
      breakpointObserverSpy.isMatched.and.returnValue(false);
      service = TestBed.inject(BreakpointService);
      expect(service.isDesktop()).toBeFalse();
    });
  });
});
