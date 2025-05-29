import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { MbscEventcalendar, MbscEventcalendarOptions, MbscResource } from '@mobiscroll/angular';
import { CalendarConfigs } from '../../utils/calendar.utils';
// import { NoteCreateDialogComponent } from '../note-create-dialog/note-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { CalendarDayObjModel } from '../../models/CalendarDayObjModel';
import { CalendarEventsModel } from '../../models/CalendarEventsModel';
import { CalendarNotesModel } from '../../models/CalendarNotesModel';
import { MatDrawer } from '@angular/material/sidenav';
import { EMPTY, Observable, Subject, catchError, map, of, startWith, takeUntil, tap } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { FormControl, FormsModule } from '@angular/forms';
import { WalletsService } from '../../services/wallets.service';
import DateFormat from '../../enums/riskProfitLoss.enum';
import { CommonModule } from '@angular/common';
import { MbscModule } from '@mobiscroll/angular';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { getCalendarDataByDate } from '../../dashboard-data/calendar-data';
import { DashboardTableViewComponent } from '../dashboard-table-view/dashboard-table-view.component';
import { TableMenuComponent } from '../table-menu/table-menu.component';

const calendarResources: MbscResource[] = [
  {
    id: 0,
    name: 'Rate Alert',
    color: '#F04853',
  },
  {
    id: 1,
    name: 'Payment',
    color: '#2947F2',
  },
  {
    id: 2,
    name: 'Exchange',
    color: '#01031C',
  },
  {
    id: 3,
    name: 'Hedge',
    color: '#FF6805',
  },
];

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule, 
    MatMenuModule, 
    MatSelectModule, 
    FormsModule, 
    MatIconModule,
    MbscModule,
    TableMenuComponent,
    DashboardTableViewComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input() showTable = false;
  @Output() tableVisibilityChange = new EventEmitter<boolean>();
  @Input() resourceId = 0;
  startDate: any = new Date();
  endDate: any = new Date();
  eventData: any;
  flagData: any;
  data: any;
  selectedTab: any;
  selectedCalendarDate!: string | null;
  calendarMenu!: string;
  isMenu!: boolean;
  oldDate!: boolean;
  unSubScribe$ = new Subject<void>();
  affiliateCountry: any;

  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.classList.contains('mbsc-timeline-column')) {
      document.querySelectorAll('#createEventCustMenu').forEach((item) => {
        item?.remove();
      });
      if (document.querySelector('.driver-popover.onboarding-popup') == null) {
        document.querySelector('body')!.style.overflowY = 'auto';
      }
    }
  }

  @ViewChild('eventCalendar') eventCalendar!: MbscEventcalendar;
  @ViewChild('alertDrawer')
  alertDrawer!: MatDrawer;
  calendarData: CalendarDayObjModel[] = [];
  selectedCurrency: any;
  dayNotes: string | undefined;
  tempDayObj = <CalendarDayObjModel>{};
  tempEventObj = <CalendarEventsModel>{};
  tempNotesObj!: CalendarNotesModel;
  popupHeader!: string;
  isEdit = false;
  popupButtons: any = [];
  calendarOptions!: MbscEventcalendarOptions;
  resources = calendarResources;
  calendarConfigs = new CalendarConfigs();
  calendarView = 'week';
  view: any = {
    timeline: {
      type: this.calendarView,
      eventList: true,
    },
  };
  currencyData$!: Observable<any[]>;
  selectedCurrencies: any[] = ['all'];
  filteredCurrency$!: Observable<any[]>;
  walletCurrencies!: any[];
  filterControl = new FormControl('');
  activeCurrency: any;
  holidays: any[] = [
    {
      recurring: {
        repeat: 'weekly',
        weekDays: 'SA,SU',
      },
    },
  ];
  calendarLoad = false;
  showLoader = false;
  userRoleType!: number;
  user:any;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private _walletService: WalletsService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.activeCurrency = JSON.parse(localStorage.getItem('activeWallet')!);
    this.loadCalendarDataOnChange(new Date());

    this.calendarOptions = this.getCalendarOptions();
    this.currencyData$ = this._walletService.getAllBalanceList().pipe(
      tap((res) => {
        this.walletCurrencies = res;
        this.changeSearch();
      })
    );
    localStorage.setItem('calendarSelectedDate', moment().format('YYYY-MM-DD'));
  }

  ngDoCheck(){
    this.cdr?.detectChanges();
  }

  ngOnChanges(changes: any): void {
    if (changes?.resourceId) {
      this.tabSelect(changes?.resourceId?.currentValue);
    }
  }

  getCalendarOptions(): MbscEventcalendarOptions {
    if(this.user?.afiiliate?.currency == 'EUR'){
     let index =  this.resources?.findIndex((x:any)=> x.id === 3);
      if(index > -1){
        this.resources.splice(index,1);
      }
     }
    let calendarOptions = this.calendarConfigs.getCalendarOptions(this.calendarData, this.resources, this.view, this.holidays);
    let otherOptions: MbscEventcalendarOptions = {
      clickToCreate: 'single',
      eventDelete: false,
      onEventClick: (args: any) => { },
      onEventCreate: (args: any) => {
        return false;
      },
      onCellClick: (args: any, inst: any) => {
        if (this.calendarView !== 'month') {
          this.generateCellMenu(args);
        }
      },
      onPageLoaded: () => {
        this.setTimelineColumnsId();
      }
    };
    return { ...calendarOptions, ...otherOptions };
  }

  changeView(ev: any): void {
    this.showLoader = true;
    setTimeout(() => {
      switch (this.calendarView) {
        case 'day':
          this.view = {
            timeline: {
              type: 'day',
              eventList: true,
            },
          };
          break;
        case 'week':
          this.view = {
            timeline: {
              type: 'week',
              eventList: true,
            },
          };
          break;
        case 'month':
          this.view = {
            calendar: {
              type: 'month',
              eventList: true,
              labels: 'all',
              outerDays: false,
              // popover: true
            },
          };
          break;
      }
      this.calendarOptions = this.getCalendarOptions();
      localStorage.setItem('calendarSelectedDate', moment().format('YYYY-MM-DD'));
    });
  }

  createNote(date: string, resource: number) {
  }


  loadPopupForm(startDate: any, resource: number): void {
    this.tempEventObj = <CalendarEventsModel>{};
    // this.tempDayObj = {
    //   id: 1,
    //   start: moment(startDate).format('YYYY-MM-DD'),
    //   resource: resource,
    //   title: this.resources[resource]?.name,
    // };
  }

  generateCellMenu(args: any, event?: any) {
    document.querySelectorAll('#createEventCustMenu').forEach((item) => {
      item?.remove();
    });
    const cell = event?.target ? event.target : args.target;
    const customMenu = this.renderer.createElement('div');
    const currentDate = moment();
    this.oldDate = moment(args.date).isBefore(currentDate, 'day');
    customMenu.classList.add('custom-cell-menu');
    customMenu.id = 'createEventCustMenu';

    const eventButton = this.renderer.createElement('button');
    const noteButton = this.renderer.createElement('button');
    eventButton.setAttribute('data-date', moment(args.date).format('YYYY-MM-DD'));
    this.selectedCalendarDate = args.date;
    noteButton.setAttribute('data-date', moment(args.date).format('YYYY-MM-DD'));
    eventButton.setAttribute('data-resource', args.resource);
    noteButton.setAttribute('data-resource', args.resource);
    eventButton.setAttribute('id', `mbsc-add-event-cust-${args.resource}`);
    eventButton.classList.add('menu-btn-one');
    noteButton.classList.add('menu-btn-two');
    if (args.resource == 0) {
      eventButton.innerText = 'Add Alert';
    } else if (args.resource == 1) {
      eventButton.innerText = 'Add Payment';
    } else if (args.resource == 2) {
      eventButton.innerText = 'Add Exchange';
    } else if (args.resource == 3) {
      eventButton.innerText = 'Add Hedge';
    }
    noteButton.innerText = 'Add note';
    this.renderer.appendChild(customMenu, eventButton);
    this.renderer.listen(eventButton, 'click', (ev) => {
      if (args.resource == 0) {
        this.alertDrawerOpen(false, args?.date);
      } else if (args.resource == 1) {
        this.openPaymentDialog(false, args?.date);
      } else if (args.resource == 2) {
        this.openConvertDialog(false, args?.date);
      } else if (args.resource == 3) {
        this.openHedgeDialog(false, args?.date);
      }
    });
    this.renderer.listen(noteButton, 'click', (ev) => {
      const date = ev.currentTarget.getAttribute('data-date');
      const resource = ev.currentTarget.getAttribute('data-resource');
      this.createNote(date, resource);
    });
    if (!cell.querySelector('.custom-cell-menu') && !this.oldDate) {
      let body = document.querySelector('body');
      this.renderer.appendChild(body, customMenu);
      if (this.affiliateCountry !== 'il' && args.resource == 2 && moment(this.selectedCalendarDate, "YYYY-MM-DD").isAfter(currentDate)) {
        customMenu.style.display = 'none';  // Hides customMenu for future dates
      }
    }
    let rootPositionX = cell.getBoundingClientRect().x;
    let rootPositionY = cell.getBoundingClientRect().y;
    let menuWidth = customMenu.offsetWidth;
    let menuHeight = customMenu.offsetHeight;

    customMenu.style.left = `${rootPositionX - menuWidth / 2}px`;
    customMenu.style.top = `${rootPositionY - menuHeight / 2}px`;
    if(!this.oldDate) {
      document.querySelector('body')!.style.overflowY = 'hidden';
    }
    if(this.userRoleType !== 1 && (args.resource == 3 || args.resource == 2)){
      this.renderer.setProperty(eventButton, 'disabled', true);
    }
  }

  alertDrawerOpen(isMenu?: boolean, date?: any) {
    if (isMenu) {
      this.selectedCalendarDate = this.getSelectedDate();
    }
    if (date) {
      this.selectedCalendarDate = moment(date).format('YYYY-MM-DD');
    }
    this.alertDrawer?.open();
    this._walletService.setAlertData({ show: false, form: true });
    document.querySelector('body')!.style.overflowY = 'hidden';
  }
  alertDrawerClose() {
    this.alertDrawer?.close();
    document.querySelector('body')!.style.overflowY = 'auto';
    this.loadCalendarDataOnChange(new Date());
  }

  openPaymentDialog(isMenu?: boolean, date?: any) {
    let activeWallet: any = localStorage.getItem('activeWallet');
    let currency = JSON.parse(activeWallet);
    let currentDate = moment();
    if (isMenu) {
      this.selectedCalendarDate = this.getSelectedDate();
    }
    if (date) {
      this.selectedCalendarDate = moment(date).format('YYYY-MM-DD');
    }

  }

  openConvertDialog(isMenu?: boolean, date?: any) {
    if (isMenu) {
      this.selectedCalendarDate = this.getSelectedDate();
    }
    if (date) {
      this.selectedCalendarDate = moment(date).format('YYYY-MM-DD');
    }

  }

  openHedgeDialog(isMenu?: boolean, date?: any) {
  }

  confirmAlertDelete() {
  }

  onSelectionChange(ev: any) {
    if (ev?.options[0]?._value !== 'all') {
      this.selectedCurrencies = [...ev?.source?._value];
      if (this.selectedCurrencies.indexOf('all') !== -1) {
        this.selectedCurrencies.splice(this.selectedCurrencies.indexOf('all'), 1);
      }
    } else {
      this.selectedCurrencies = ['all'];
    }
  }

  private _filter(value: string): any[] {
    return this.walletCurrencies.filter((currency) => currency.wallet_Currency.code.toLowerCase().includes(value.toLowerCase()));
  }
  changeSearch() {
    this.filteredCurrency$ = this.filterControl.valueChanges.pipe(
      startWith(''),
      map((val) => {
        return this._filter(val || '');
      })
    );
  }

  tabSelect(id: number) {
    this.selectedTab = id;
  }

  getHolidays() {
    let FromDate = moment(new Date()).format(DateFormat?.dateInput);
    let ToDate = moment().add(1, 'year').format(DateFormat?.dateInput);
    let currency = this.activeCurrency?.wallet_Currency?.code;
    this.showLoader = true;
  }

  getSelectedDate() {
    return localStorage.getItem('calendarSelectedDate');
  }

  setTableVisibility(visible: boolean) {
    this.showTable = visible;
    this.tableVisibilityChange.emit(visible);
  }

  getCalendarData(fromDate: string, toDate: string) {
    this.showLoader = true;
    of(getCalendarDataByDate).pipe(takeUntil(this.unSubScribe$)).subscribe((result) => {
      if (result) {
        this.showLoader = false;
        // this.changeCalendarDataFormat(result);
        this.calendarData = result.map((item: any) => {
          let changedFormatDate = item.start.split('/').reverse().join('/');
          item.start = moment(changedFormatDate).format('YYYY-MM-DD');
          item.events = item.events.filter((event: any) => event.status !== 'Deleted');
          return item;
        }).filter((item: any) => item?.events?.length);
        this.calendarData.sort(this.sortByDate);
        this.getHolidays();
      }
    });
  }

  sortByDate(aDate: any, bDate: any) {
    const dateA: any = new Date(aDate.start);
    const dateB: any = new Date(bDate.start);
    return dateA - dateB;
  }

  calendarPageChanged(ev: any) {
    this.loadCalendarDataOnChange(ev.firstDay);
    setTimeout(() => {
      document.querySelectorAll('.mbsc-timeline-header .mbsc-timeline-header-bg .mbsc-timeline-day').forEach((dayItem) => {
        dayItem.addEventListener('click', (ev) => {
          let currentTarget = ev?.currentTarget as HTMLElement;
          let dateElement = currentTarget.querySelector('.mbsc-hidden-content');
          let selectedDate = moment(dateElement?.innerHTML).format('YYYY-MM-DD');
          let holidays = JSON.parse(localStorage.getItem('holidays')!);
          const isWeekend = moment(selectedDate).day() === 0 || moment(selectedDate).day() === 6;
          if (!holidays.includes(selectedDate) && !isWeekend && this.isDayDisabled(dateElement?.innerHTML)) {
            localStorage.setItem('calendarSelectedDate', selectedDate);
            document.querySelectorAll('.mbsc-timeline-header .mbsc-timeline-header-bg .mbsc-timeline-day .mbsc-timeline-header-date .date-label').forEach((item) => {
              item.classList.remove('today');
              currentTarget.querySelector('.date-label')!.classList.add('today');
            });
          }
        });
      });
    }, 500);
  }

  calendarDateChanged(ev: any) {
    let selectedDate = moment(ev?.date).format('YYYY-MM-DD');
    localStorage.setItem('calendarSelectedDate', selectedDate);
  }

  loadCalendarDataOnChange(date: any) {
    let timeUnit: 'month' | 'week' = this.calendarView == 'month' ? 'month' : 'week';
    const currentDate = date ? moment(date) : moment();
    const startDate = currentDate.clone().startOf(timeUnit).format('DD/MM/YYYY');
    const endDate = currentDate.clone().endOf(timeUnit).format('DD/MM/YYYY');
    this.getCalendarData(startDate, endDate);
  }

  getData(data: any) {
    this.flagData = data?.events ? data?.events[0] : '';
  }

  GetAlertData(data: any) {
    this.flagData = data;
  }

  DeleteAlert(id: any) {

  }

  checkHoliday(date: any) {
    const currentDate = moment(); // Get the current date
    const isWeekend = moment(date).day() === 0 || moment(date).day() === 6;
    const convertedDate = moment(date).format('YYYY-MM-DD');
    const isPastDate = moment(date).isBefore(currentDate, 'day');
    this.oldDate = isPastDate;
    return !this.holidays.includes(convertedDate) && !isWeekend && !isPastDate;
  }

  hasEvent(date: any) {
    return this.calendarData.some((obj) => obj['start'] === moment(date).format('YYYY-MM-DD'));
    // console.log(date);
  }

  isDayDisabled(date: any) {
    const isWeekend = moment(date).day() === 0 || moment(date).day() === 6;
    const convertedDate = moment(date).format('YYYY-MM-DD');
    const currentDate = moment().format('YYYY-MM-DD');
    const isPastDate = currentDate < convertedDate;
    this.oldDate = isPastDate;
    return !this.holidays.includes(convertedDate) && !isWeekend && isPastDate;
  }

  setTimelineColumnsId() {
    document.querySelectorAll('.cust-event-calendar .cust-event-calendar .mbsc-timeline-column').forEach((element, index) => {
      element.setAttribute('id', `event-add-area-${index}`);
    });
  }

  ngOnDestroy() {
    document.querySelectorAll('#createEventCustMenu').forEach((item) => {
      item?.remove();
    });
    this.unSubScribe$.next();
    this.unSubScribe$.complete();
  }
}