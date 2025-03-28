/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// Portions of the code in this file are based on code from ICU.
// Original licensing can be found in the NOTICE file in the root directory of this source tree.

import {AnyCalendarDate, Calendar, CalendarIdentifier} from '../types';
import {CalendarDate} from '../CalendarDate';

const CIVIL_EPOC = 1948440; // CE 622 July 16 Friday (Julian calendar) / CE 622 July 19 (Gregorian calendar)
const ASTRONOMICAL_EPOC = 1948439; // CE 622 July 15 Thursday (Julian calendar)
const UMALQURA_YEAR_START = 1300;
const UMALQURA_YEAR_END = 1600;
const UMALQURA_START_DAYS = 460322;

function islamicToJulianDay(epoch: number, year: number, month: number, day: number): number {
  return day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    epoch - 1;
}

function julianDayToIslamic(calendar: Calendar, epoch: number, jd: number) {
  let year = Math.floor((30 * (jd - epoch) + 10646) / 10631);
  let month = Math.min(12, Math.ceil((jd - (29 + islamicToJulianDay(epoch, year, 1, 1))) / 29.5) + 1);
  let day = jd - islamicToJulianDay(epoch, year, month, 1) + 1;

  return new CalendarDate(calendar, year, month, day);
}

function isLeapYear(year: number): boolean {
  return (14 + 11 * year) % 30 < 11;
}

/**
 * The Islamic calendar, also known as the "Hijri" calendar, is used throughout much of the Arab world.
 * The civil variant uses simple arithmetic rules rather than astronomical calculations to approximate
 * the traditional calendar, which is based on sighting of the crescent moon. It uses Friday, July 16 622 CE (Julian) as the epoch.
 * Each year has 12 months, with either 354 or 355 days depending on whether it is a leap year.
 * Learn more about the available Islamic calendars [here](https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types).
 */
export class IslamicCivilCalendar implements Calendar {
  identifier: CalendarIdentifier = 'islamic-civil';

  fromJulianDay(jd: number): CalendarDate {
    return julianDayToIslamic(this, CIVIL_EPOC, jd);
  }

  toJulianDay(date: AnyCalendarDate): number {
    return islamicToJulianDay(CIVIL_EPOC, date.year, date.month, date.day);
  }

  getDaysInMonth(date: AnyCalendarDate): number {
    let length = 29 + date.month % 2;
    if (date.month === 12 && isLeapYear(date.year)) {
      length++;
    }

    return length;
  }

  getMonthsInYear(): number {
    return 12;
  }

  getDaysInYear(date: AnyCalendarDate): number {
    return isLeapYear(date.year) ? 355 : 354;
  }

  getYearsInEra(): number {
    // 9999 gregorian
    return 9665;
  }

  getEras(): string[] {
    return ['AH'];
  }
}

/**
 * The Islamic calendar, also known as the "Hijri" calendar, is used throughout much of the Arab world.
 * The tabular variant uses simple arithmetic rules rather than astronomical calculations to approximate
 * the traditional calendar, which is based on sighting of the crescent moon. It uses Thursday, July 15 622 CE (Julian) as the epoch.
 * Each year has 12 months, with either 354 or 355 days depending on whether it is a leap year.
 * Learn more about the available Islamic calendars [here](https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types).
 */
export class IslamicTabularCalendar extends IslamicCivilCalendar {
  identifier: CalendarIdentifier = 'islamic-tbla';

  fromJulianDay(jd: number): CalendarDate {
    return julianDayToIslamic(this, ASTRONOMICAL_EPOC, jd);
  }

  toJulianDay(date: AnyCalendarDate): number {
    return islamicToJulianDay(ASTRONOMICAL_EPOC, date.year, date.month, date.day);
  }
}

// Generated by scripts/generate-umalqura.js
const UMALQURA_DATA = 'qgpUDckO1AbqBmwDrQpVBakGkgepC9QF2gpcBS0NlQZKB1QLagutBa4ETwoXBYsGpQbVCtYCWwmdBE0KJg2VDawFtgm6AlsKKwWVCsoG6Qr0AnYJtgJWCcoKpAvSC9kF3AJtCU0FpQpSC6ULtAW2CVcFlwJLBaMGUgdlC2oFqworBZUMSg2lDcoF1gpXCasESwmlClILagt1BXYCtwhbBFUFqQW0BdoJ3QRuAjYJqgpUDbIN1QXaAlsJqwRVCkkLZAtxC7QFtQpVCiUNkg7JDtQG6QprCasEkwpJDaQNsg25CroEWworBZUKKgtVC1wFvQQ9Ah0JlQpKC1oLbQW2AjsJmwRVBqkGVAdqC2wFrQpVBSkLkgupC9QF2gpaBasKlQVJB2QHqgu1BbYCVgpNDiULUgtqC60FrgIvCZcESwalBqwG1gpdBZ0ETQoWDZUNqgW1BdoCWwmtBJUFygbkBuoK9QS2AlYJqgpUC9IL2QXqAm0JrQSVCkoLpQuyBbUJ1gSXCkcFkwZJB1ULagVrCisFiwpGDaMNygXWCtsEawJLCaUKUgtpC3UFdgG3CFsCKwVlBbQF2gntBG0BtgimClINqQ3UBdoKWwmrBFMGKQdiB6kLsgW1ClUFJQuSDckO0gbpCmsFqwRVCikNVA2qDbUJugQ7CpsETQqqCtUK2gJdCV4ELgqaDFUNsga5BroEXQotBZUKUguoC7QLuQXaAloJSgukDdEO6AZqC20FNQWVBkoNqA3UDdoGWwWdAisGFQtKC5ULqgWuCi4JjwwnBZUGqgbWCl0FnQI=';
let UMALQURA_MONTHLENGTH: Uint16Array;
let UMALQURA_YEAR_START_TABLE: Uint32Array;

function umalquraYearStart(year: number): number {
  return UMALQURA_START_DAYS + UMALQURA_YEAR_START_TABLE[year - UMALQURA_YEAR_START];
}

function umalquraMonthLength(year: number, month: number): number {
  let idx = (year - UMALQURA_YEAR_START);
  let mask = (0x01 << (11 - (month - 1)));
  if ((UMALQURA_MONTHLENGTH[idx] & mask) === 0) {
    return 29;
  } else {
    return 30;
  }
}

function umalquraMonthStart(year: number, month: number): number {
  let day = umalquraYearStart(year);
  for (let i = 1; i < month; i++) {
    day += umalquraMonthLength(year, i);
  }
  return day;
}

function umalquraYearLength(year: number): number {
  return UMALQURA_YEAR_START_TABLE[year + 1 - UMALQURA_YEAR_START] - UMALQURA_YEAR_START_TABLE[year - UMALQURA_YEAR_START];
}

/**
 * The Islamic calendar, also known as the "Hijri" calendar, is used throughout much of the Arab world.
 * The Umalqura variant is primarily used in Saudi Arabia. It is a lunar calendar, based on astronomical
 * calculations that predict the sighting of a crescent moon. Month and year lengths vary between years
 * depending on these calculations.
 * Learn more about the available Islamic calendars [here](https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types).
 */
export class IslamicUmalquraCalendar extends IslamicCivilCalendar {
  identifier: CalendarIdentifier = 'islamic-umalqura';

  constructor() {
    super();
    if (!UMALQURA_MONTHLENGTH) {
      UMALQURA_MONTHLENGTH = new Uint16Array(Uint8Array.from(atob(UMALQURA_DATA), c => c.charCodeAt(0)).buffer);
    }

    if (!UMALQURA_YEAR_START_TABLE) {
      UMALQURA_YEAR_START_TABLE = new Uint32Array(UMALQURA_YEAR_END - UMALQURA_YEAR_START + 1);

      let yearStart = 0;
      for (let year = UMALQURA_YEAR_START; year <= UMALQURA_YEAR_END; year++) {
        UMALQURA_YEAR_START_TABLE[year - UMALQURA_YEAR_START] = yearStart;
        for (let i = 1; i <= 12; i++) {
          yearStart += umalquraMonthLength(year, i);
        }
      }
    }
  }

  fromJulianDay(jd: number): CalendarDate {
    let days = jd - CIVIL_EPOC;
    let startDays = umalquraYearStart(UMALQURA_YEAR_START);
    let endDays = umalquraYearStart(UMALQURA_YEAR_END);
    if (days < startDays || days > endDays) {
      return super.fromJulianDay(jd);
    } else {
      let y = UMALQURA_YEAR_START - 1;
      let m = 1;
      let d = 1;
      while (d > 0) {
        y++;
        d = days - umalquraYearStart(y) + 1;
        let yearLength = umalquraYearLength(y);
        if (d === yearLength) {
          m = 12;
          break;
        } else if (d < yearLength) {
          let monthLength = umalquraMonthLength(y, m);
          m = 1;
          while (d > monthLength) {
            d -= monthLength;
            m++;
            monthLength = umalquraMonthLength(y, m);
          }
          break;
        }
      }

      return new CalendarDate(this, y, m, (days - umalquraMonthStart(y, m) + 1));
    }
  }

  toJulianDay(date: AnyCalendarDate): number {
    if (date.year < UMALQURA_YEAR_START || date.year > UMALQURA_YEAR_END) {
      return super.toJulianDay(date);
    }

    return CIVIL_EPOC + umalquraMonthStart(date.year, date.month) + (date.day - 1);
  }

  getDaysInMonth(date: AnyCalendarDate): number {
    if (date.year < UMALQURA_YEAR_START || date.year > UMALQURA_YEAR_END) {
      return super.getDaysInMonth(date);
    }

    return umalquraMonthLength(date.year, date.month);
  }

  getDaysInYear(date: AnyCalendarDate): number {
    if (date.year < UMALQURA_YEAR_START || date.year > UMALQURA_YEAR_END) {
      return super.getDaysInYear(date);
    }

    return umalquraYearLength(date.year);
  }
}
