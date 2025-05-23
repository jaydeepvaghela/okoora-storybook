import { MbscCalendarEvent, MbscEventcalendarOptions, MbscResource } from "@mobiscroll/angular";
import moment from "moment";

export class CalendarConfigs {

  constructor() {
  }

  getCalendarOptions(data: MbscCalendarEvent[], resources: MbscResource[], view: any, holidays: any[]): MbscEventcalendarOptions {
    if (!data) return {};
    const currentDate = new Date();
    return {
      view: view,
      resources: resources,
      data: data,
      showEventTooltip: false,
      colors: [
        {
          date: currentDate,
          // background: '#f5f7fa'
        }
      ],
      invalid: holidays,
      min: moment().subtract(3, 'months').endOf('month'),
      max:moment().add(1, 'year').endOf('month')
    }
  }


}
