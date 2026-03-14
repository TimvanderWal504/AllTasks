import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: string }>;
  userChoice: Promise<{ outcome: string; platform: string }>;
}

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './install-prompt.component.html',
})
export class InstallPromptComponent implements OnInit, OnDestroy {
  readonly isPromptAvailable = signal(false);

  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private readonly isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;

  private readonly onBeforeInstallPrompt = (event: Event): void => {
    event.preventDefault();
    this.deferredPrompt = event as BeforeInstallPromptEvent;
    this.isPromptAvailable.set(true);
  };

  ngOnInit(): void {
    if (this.isStandaloneMode) return;

    window.addEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);
  }

  async installApp(): Promise<void> {
    if (!this.deferredPrompt) return;

    await this.deferredPrompt.prompt();
    this.deferredPrompt = null;
    this.isPromptAvailable.set(false);
  }
}
