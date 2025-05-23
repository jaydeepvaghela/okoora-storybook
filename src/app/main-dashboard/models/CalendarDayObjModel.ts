import { CalendarEventsModel } from "./CalendarEventsModel";
import { CalendarNotesModel } from "./CalendarNotesModel";

export interface CalendarDayObjModel {
  id?: number;
  start: string;
  resource: number;
  events?: CalendarEventsModel[];
  notes?: CalendarNotesModel[];
}
