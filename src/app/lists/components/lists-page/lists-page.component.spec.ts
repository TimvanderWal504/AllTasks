import { TestBed } from '@angular/core/testing';
import { ListsPageComponent } from './lists-page.component';

describe('ListsPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsPageComponent],
    }).compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(ListsPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show a placeholder message', () => {
    const fixture = TestBed.createComponent(ListsPageComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Selecteer een lijst');
  });
});
