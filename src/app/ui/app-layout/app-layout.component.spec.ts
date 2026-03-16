import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { AppLayoutComponent } from './app-layout.component';
import { BreakpointService } from '../breakpoint/breakpoint.service';
import { ListService } from '../../lists/services/list.service';

describe('AppLayoutComponent', () => {
  let fixture: ComponentFixture<AppLayoutComponent>;

  function setupComponent(isMobile: boolean, isDesktop: boolean): void {
    const breakpointServiceStub: Pick<BreakpointService, 'isMobile' | 'isDesktop'> = {
      isMobile: () => isMobile,
      isDesktop: () => isDesktop,
    };

    const listServiceStub = jasmine.createSpyObj(
      'ListService',
      ['createList', 'renameList', 'deleteList', 'setActiveList'],
      { lists: signal([]), activeList: signal(null) }
    );

    TestBed.configureTestingModule({
      imports: [AppLayoutComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BreakpointService, useValue: breakpointServiceStub },
        { provide: ListService, useValue: listServiceStub },
      ],
    });

    fixture = TestBed.createComponent(AppLayoutComponent);
    fixture.detectChanges();
  }

  describe('mobile navigation', () => {
    beforeEach(() => setupComponent(true, false));

    it('should display bottom navigation when viewport is mobile', () => {
      const bottomNav = fixture.debugElement.query(By.css('[data-testid="bottom-nav"]'));
      expect(bottomNav).not.toBeNull();
    });

    it('should not display sidebar when viewport is mobile', () => {
      const sidebar = fixture.debugElement.query(By.css('[data-testid="sidebar"]'));
      expect(sidebar).toBeNull();
    });
  });

  describe('desktop navigation', () => {
    beforeEach(() => setupComponent(false, true));

    it('should display sidebar when viewport is desktop', () => {
      const sidebar = fixture.debugElement.query(By.css('[data-testid="sidebar"]'));
      expect(sidebar).not.toBeNull();
    });

    it('should not display bottom navigation when viewport is desktop', () => {
      const bottomNav = fixture.debugElement.query(By.css('[data-testid="bottom-nav"]'));
      expect(bottomNav).toBeNull();
    });
  });

  describe('layout structure', () => {
    beforeEach(() => setupComponent(false, false));

    it('should always render a router-outlet', () => {
      const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
      expect(routerOutlet).not.toBeNull();
    });
  });
});
