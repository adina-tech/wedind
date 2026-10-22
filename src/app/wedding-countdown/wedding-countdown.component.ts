import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';

interface ConfettiPiece {
  left: number;
  delay: number;
  duration: number;
  color: string;
  width: number;
  height: number;
  round: boolean;
}

@Component({
  selector: 'app-wedding-countdown',
  templateUrl: './wedding-countdown.component.html',
  styleUrl: './wedding-countdown.component.css',
})
export class WeddingCountdownComponent implements OnInit, OnDestroy {
  // Chuppah time, Israel time (winter clock, UTC+2)
  private readonly chuppahTime = new Date('2026-11-05T18:30:00+02:00').getTime();
  private intervalId?: ReturnType<typeof setInterval>;

  readonly event = {
    groom: 'מאיר',
    bride: 'ריקי ',
    hebrewDate: 'יום חמישי, כ"ה בחשוון תשפ"ז',
    gregorianDate: '05.11.2026',
    chuppah: '18:30',
    hall: 'אולם "בית ברכה"',
    address: 'רחוב רבי עקיבא 34, ביתר עילית',
    groomParents: 'יהונתן פנחס ליברמן ורעייתו',
    brideParents: 'נחמן קמינסקי ורעייתו',
    grandparents: [
      'הרב מרדכי דוד ליברמן ורעייתו',
      'הרב אלעזר פנחס שוורץ ורעייתו',
      'הגברת שרה גיגר תחי\'',
      'הרב אברהם ישראל דימרמן ורעייתו',
      'הרב ישראל אבא קמינסקי ורעייתו',
    ],
  };

  readonly wazeUrl =
    'https://waze.com/ul?q=' + encodeURIComponent('בית ברכה רבי עקיבא 34 ביתר עילית') + '&navigate=yes';
  readonly mapsUrl =
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('אולם בית ברכה, רבי עקיבא 34, ביתר עילית');
  readonly calendarUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('החתונה של מאיר ורבקה רייזל') +
    '&dates=20261105T163000Z/20261105T220000Z' +
    '&location=' + encodeURIComponent('אולם בית ברכה, רבי עקיבא 34, ביתר עילית');

  private readonly now = signal(Date.now());

  readonly isMarried = computed(() => this.now() >= this.chuppahTime);

  readonly isToday = computed(() => {
    const today = new Date(this.now()).toLocaleDateString('en-CA', { timeZone: 'Asia/Jerusalem' });
    return today === '2026-11-05' && !this.isMarried();
  });

  readonly timeUnits = computed(() => {
    const totalSeconds = Math.max(0, Math.floor((this.chuppahTime - this.now()) / 1000));
    return [
      { value: Math.floor(totalSeconds / 86400), label: 'ימים' },
      { value: Math.floor((totalSeconds % 86400) / 3600), label: 'שעות' },
      { value: Math.floor((totalSeconds % 3600) / 60), label: 'דקות' },
      { value: totalSeconds % 60, label: 'שניות' },
    ];
  });

  readonly confetti: ConfettiPiece[] = this.createConfetti();

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.now.set(Date.now());
      if (this.isMarried()) this.clearTimer();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private clearTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private createConfetti(): ConfettiPiece[] {
    // Palette taken from the invitation: copper, sand, blush and cream
    const colors = ['#a8692b', '#d4a373', '#e9c9a8', '#f6e3d3', '#c98c5a', '#ffffff', '#e8b4a0'];
    return Array.from({ length: 110 }, () => {
      const size = 6 + Math.random() * 8;
      const round = Math.random() < 0.3;
      return {
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: size,
        height: round ? size : size * 0.45,
        round,
      };
    });
  }
}
