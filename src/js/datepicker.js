function onChangeMonth(id) {
  const mon = monthObj(typeCalendar);
  const find = mon.find((item) => item.id === id);
  return find;
}
function division(a, b) {
  return parseInt(a / b);
}
class date_picker {
  constructor(options) {
    this.options = options;
    this.calendar = new calendar(this.options);
    this.view = new view(this.options);
    this.view.render(this.calendar.create_calendar());
  }
}

class calendar {
  constructor(options) {
    this.options = options;
    this.list = {};
  }
  static JalaliDate = {
    curDateTime: "",

    persianMonths: [
      "فروردین",
      "ارديبهشت",
      "خرداد",
      "تير",
      "مرداد",
      "شهريور",
      "مهر",
      "آبان",
      "آذر",
      "دي",
      "بهمن",
      "اسفند",
    ],
    hijriMonths: [
      "Muharram",
      "Safar",
      "Rabi al-Awwal",
      "Rabi al-Thani",
      "Jumada al-Awwal",
      "Jumada al-Thani",
      "Rajab",
      "Sha'ban",
      "Ramadan",
      "Shawwal",
      "Dhul-Qa'dah",
      "Dhul-Hijjah",
    ],
    hijriMonthsPersian: [
      "محرم",
      "صفر",
      "ربیع الاول",
      "ربیع الثانی",
      "جمادی الاول",
      "جمادی الثانی",
      "رجب",
      "شعبان",
      "ذیقعده",
      "ذیحجه",
      "ذیحجه",
      "ذیحجه",
    ],

    persianWeekDays: [
      "شنبه",
      "يکشنبه",
      "دوشنبه",
      "سه شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه",
    ],
    minPersianWeekDays: ["ش", "ی", "د", "س", "چ", "پ", "ج"],

    gregorianMonths: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],

    gregorianWeekDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],

    hijriWeekDays: [
      "Al-Sabt",
      "Al-Ahad",
      "Al-Ithnayn",
      "Al-Thalatha",
      "Al-Arbaa",
      "Al-Khamis",
      "Al-Jumu'ah",
    ],

    g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
    hijriDaysInMonth: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
    GregToJalaliDisplay: function (date) {
      const regexp = /([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/;
      if (!regexp.test(date)) return "";

      const tmp = date.split("-");
      const y1 = tmp[0];
      const m1 = tmp[1];
      const d1 = tmp[2];
      const jalaliDate = calendar.JalaliDate.gregorian_to_jalali(y1, m1, d1);
      const y2 = jalaliDate[0];
      const m2 = jalaliDate[1];
      const d2 = jalaliDate[2];

      let md = m2 + "";
      let dd = d2 + "";

      md = (m2 < 10 ? "0" : "") + md;
      dd = (d2 < 10 ? "0" : "") + dd;

      return y2 + "/" + md + "/" + dd;
    },

    isValid: function (date) {
      if (date[1] > 12 || date[1] < 1) return false;
      if (
        (calendar.JalaliDate.j_days_in_month[date[1] - 1] < date[2] ||
          date[2] < 1) &&
        date[1] !== 12
      )
        return false;
      if (
        (calendar.JalaliDate.j_days_in_month[date[1] - 1] < date[2] ||
          date[2] < 1) &&
        date[1] === 12
      ) {
        if (calendar.JalaliDate.isLeapYear(date[0]) && date[2] !== 30)
          return false;
        else if (!calendar.JalaliDate.isLeapYear(date[0])) return false;
      }
      return true;
    },

    GregToJalali: function (date) {
      const regexp = /([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/;
      if (!regexp.test(date)) return "";

      const tmp = date.split("-");
      const y1 = tmp[0];
      const m1 = tmp[1];
      const d1 = tmp[2];
      const jalaliDate = calendar.JalaliDate.gregorian_to_jalali(y1, m1, d1);
      const y2 = jalaliDate[0];
      const m2 = jalaliDate[1];
      const d2 = jalaliDate[2];

      let md = m2 + "";
      let dd = d2 + "";

      md = (m2 < 10 ? "0" : "") + md;
      dd = (d2 < 10 ? "0" : "") + dd;

      return y2 + "/" + md + "/" + dd;
    },

    JalaliToGreg: function (date) {
      const regexp = /([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})/;
      if (!regexp.test(date)) return "";

      const tmp = date.split("-");
      let y1 = tmp[0];
      const m1 = tmp[1];
      const d1 = tmp[2];
      if (y1.length == 2) y1 = "13" + y1;
      const gregorianDate = calendar.JalaliDate.jalali_to_gregorian(y1, m1, d1);
      const y2 = gregorianDate[0];
      const m2 = gregorianDate[1];
      const d2 = gregorianDate[2];

      return y2 + "-" + m2 + "-" + d2;
    },

    gregorian_to_jalali: function (g_y, g_m, g_d) {
      let gy = g_y - 1600;
      let gm = g_m - 1;
      let gd = g_d - 1;

      let g_day_no =
        365 * gy +
        division(gy + 3, 4) -
        division(gy + 99, 100) +
        division(gy + 399, 400);

      for (let i = 0; i < gm; i++)
        g_day_no += calendar.JalaliDate.g_days_in_month[i];
      if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0))
        g_day_no++;
      g_day_no += gd;

      let j_day_no = g_day_no - 79;

      const j_np = division(j_day_no, 12053); /* 12053 = 365*33 + 32/4 */
      j_day_no = j_day_no % 12053;

      let jy =
        979 + 33 * j_np + 4 * division(j_day_no, 1461); /* 1461 = 365*4 + 4/4 */

      j_day_no %= 1461;

      if (j_day_no >= 366) {
        jy += division(j_day_no - 1, 365);
        j_day_no = (j_day_no - 1) % 365;
      }

      let i = 0;
      for (
        i = 0;
        i < 11 && j_day_no >= calendar.JalaliDate.j_days_in_month[i];
        ++i
      )
        j_day_no -= calendar.JalaliDate.j_days_in_month[i];
      const jm = i + 1;
      const jd = j_day_no + 1;

      return [jy, jm, jd];
    },

    jalali_to_gregorian: function (j_y, j_m, j_d) {
      let jy = j_y - 979;
      let jm = j_m - 1;
      let jd = j_d - 1;

      let j_day_no =
        365 * jy + division(jy, 33) * 8 + division((jy % 33) + 3, 4);
      for (let i = 0; i < jm; ++i)
        j_day_no += calendar.JalaliDate.j_days_in_month[i];

      j_day_no += jd;

      let g_day_no = j_day_no + 79;

      let gy =
        1600 +
        400 *
          division(
            g_day_no,
            146097
          ); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
      g_day_no = g_day_no % 146097;

      let leap = true;
      if (g_day_no >= 36525) {
        /* 36525 = 365*100 + 100/4 */
        g_day_no--;
        gy +=
          100 *
          division(g_day_no, 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
        g_day_no = g_day_no % 36524;

        if (g_day_no >= 365) g_day_no++;
        else leap = false;
      }

      gy += 4 * division(g_day_no, 1461); /* 1461 = 365*4 + 4/4 */
      g_day_no %= 1461;

      if (g_day_no >= 366) {
        leap = false;

        g_day_no--;
        gy += division(g_day_no, 365);
        g_day_no = g_day_no % 365;
      }

      let i = 0;
      for (
        i = 0;
        g_day_no >= calendar.JalaliDate.g_days_in_month[i] + (i === 1 && leap);
        i++
      )
        g_day_no -= calendar.JalaliDate.g_days_in_month[i] + (i === 1 && leap);
      const gm = i + 1;
      const gd = g_day_no + 1;

      return [gy, gm, gd];
    },

    isLeapYear: function (year) {
      if (!year) {
        year = new Date().getFullYear();
      }
      if (year > 0)
        return ((((year - 474) % 2820) + 474 + 38) * 682) % 2816 < 682;
      else return ((((year - 473) % 2820) + 474 + 38) * 682) % 2816 < 682;
    },

    toGregorian: function (year, month, day) {
      return calendar.JalaliDate.jalali_to_gregorian(year, month, day);
    },

    toJalali: function (year, month, day) {
      return calendar.JalaliDate.gregorian_to_jalali(year, month, day);
    },

    today: function () {
      return calendar.JalaliDate.GregToJalaliDisplay(
        calendar.JalaliDate.currentDateTime("gregorian")
      );
    },

    weekDay: function (y, m, d, type) {
      let gyear, gmonth, gday;
      if (type === "en") {
        gyear = y;
        gmonth = m;
        gday = d;
      } else if (type === "fa") {
        const tmp = calendar.JalaliDate.jalali_to_gregorian(y, m, d);
        gyear = tmp[0];
        gmonth = tmp[1];
        gday = tmp[2];
      } else if (type === "ar") {
        // const tmp = JalaliDate.gregorianToHijri(y, m, d);
        gyear = y;
        gmonth = m;
        gday = d;
      }

      const tmp = new Date(gyear, gmonth - 1, gday, 0, 0, 0);
      let dayofweek = tmp.getDay();

      dayofweek += 2;
      if (dayofweek > 7) dayofweek -= 7;

      return dayofweek;
    },

    currentDateTime: function (type) {
      const currentDate = new Date();

      const [year, month, day] = [
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate(),
      ];

      if (type === "jalali") {
        return this.toJalali(year, month, day);
      } else if (type === "gregorian") {
        // return (calendar.JalaliDate.curDateTime = `${year}-${month}-${day}`);
        return [year, month, day];
      } else if (type === "hijri") {
        const gregorianDate = new Date(year, month, day);
        return this.gregorianToHijri(gregorianDate);
      }
    }, // new****************
    // convert gregorian date to hijri date
    gregorianToHijri(gregorianDate) {
      // Helper functions to convert Gregorian to Julian Day Number and then to Hijri
      function gregorianToJulian(year, month, day) {
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        const jd =
          day +
          Math.floor((153 * m + 2) / 5) +
          365 * y +
          Math.floor(y / 4) -
          Math.floor(y / 100) +
          Math.floor(y / 400) -
          32045;
        return jd;
      }

      function julianToHijri(jd) {
        const JD_HIJRI_EPOCH = 1948439.5;
        const DAYS_IN_HIJRI_CYCLE = 10631;
        const DAYS_IN_HIJRI_YEAR = 354.367;
        const DAYS_IN_HIJRI_MONTH = 29.5306;

        const daysSinceHijriEpoch = jd - JD_HIJRI_EPOCH;
        const hijriCycle = Math.floor(
          daysSinceHijriEpoch / DAYS_IN_HIJRI_CYCLE
        );
        const daysInCycle = daysSinceHijriEpoch % DAYS_IN_HIJRI_CYCLE;
        const hijriYear = Math.floor(daysInCycle / DAYS_IN_HIJRI_YEAR);
        const daysInCurrentYear = daysInCycle % DAYS_IN_HIJRI_YEAR;
        const hijriMonth = Math.floor(daysInCurrentYear / DAYS_IN_HIJRI_MONTH);
        const hijriDay =
          Math.floor(daysInCurrentYear % DAYS_IN_HIJRI_MONTH) + 1;

        return {
          year: hijriYear + 1 + hijriCycle * 30,
          month: hijriMonth,
          day: hijriDay,
        };
      }

      const gregorianDateString = gregorianDate.toISOString().split("T")[0];
      const [year, month, day] = gregorianDateString.split("-").map(Number);

      const jd = gregorianToJulian(year, month, day);
      return julianToHijri(jd);
    }, // convert hijri date to gregorian date
    hijriToGregorian(hijriYear, hijriMonth, hijriDay) {
      // Helper functions to convert Hijri to Julian Day Number and then to Gregorian
      function hijriToJulian(year, month, day) {
        const JD_HIJRI_EPOCH = 1948439.5;
        const days =
          (year - 1) * 354 +
          Math.floor((year - 1) / 30) * 11 +
          (month - 1) * 29.5306 +
          day;
        return JD_HIJRI_EPOCH + days;
      }

      function gregorianToJulian(year, month, day) {
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        const jd =
          day +
          Math.floor((153 * m + 2) / 5) +
          365 * y +
          Math.floor(y / 4) -
          Math.floor(y / 100) +
          Math.floor(y / 400) -
          32045;
        return jd;
      }

      function julianToGregorian(jd) {
        const JD_GREGORIAN_EPOCH = 1721425.5;
        let wjd = Math.floor(jd - 0.5) + 0.5;
        let depoch = wjd - JD_GREGORIAN_EPOCH;
        let quadricent = Math.floor(depoch / 146097);
        let dqc = depoch % 146097;
        let cent = Math.floor(dqc / 36524);
        let dcent = dqc % 36524;
        let quad = Math.floor(dcent / 1461);
        let dquad = dcent % 1461;
        let yindex = Math.floor(dquad / 365);
        let year = quadricent * 400 + cent * 100 + quad * 4 + yindex;

        if (cent !== 4 && yindex !== 4) {
          year++;
        }

        let yearday = wjd - gregorianToJulian(year, 1, 1);
        let leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 == 0);
        let monthDay = leap
          ? [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
          : [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

        let month = 1;
        for (let i = 0; i < 12; i++) {
          if (yearday < monthDay[i + 1]) {
            month = i + 1;
            break;
          }
        }

        let day = Math.floor(yearday - monthDay[month - 1] + 1);

        return {
          year: year,
          month: month,
          day: day,
        };
      }

      // Convert Hijri date to Julian Day
      const jd = hijriToJulian(hijriYear, hijriMonth, hijriDay);

      // Convert Julian Day to Gregorian date
      return julianToGregorian(jd);
    },
  };

  monthObj(type) {
    const calendars = {
      jalali: {
        months: [
          "فروردین",
          "اردیبهشت",
          "خرداد",
          "تیر",
          "مرداد",
          "شهریور",
          "مهر",
          "آبان",
          "آذر",
          "دی",
          "بهمن",
          "اسفند",
        ],
        days: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
      },
      gregorian: {
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      },
      hijri: {
        months: [
          "محرم",
          "صفر",
          "ربیع الاول",
          "ربیع الثانی",
          "جمادی الاول",
          "جمادی الثانی",
          "رجب",
          "شعبان",
          "رمضان",
          "شوال",
          "ذیقعده",
          "ذیحجه",
        ],
        days: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
      },
    };

    const calendar = calendars[type];
    if (!calendar) return [];

    return calendar.months.map((name, index) => ({
      id: index + 1,
      name,
      days_in_month: calendar.days[index],
    }));
  }

  weekObj(type, style) {
    const calendars = {
      jalali: {
        WeekDays: [
          "شنبه",
          "يکشنبه",
          "دوشنبه",
          "سه شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
        ],
        minWeekDays: ["ش", "ی", "د", "س", "چ", "پ", "ج"],
      },
      gregorian: {
        WeekDays: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        minWeekDays: ["Sat", "Sun", "Mon", "Tues", "Wed", "Thurs", "Fri"],
      },
      hijri: {
        WeekDays: [
          "Al-Sabt",
          "Al-Ahad",
          "Al-Ithnayn",
          "Al-Thalatha",
          "Al-Arbaa",
          "Al-Khamis",
          "Al-Jumu'ah",
        ],
        minWeekDays: ["Sabt", "Ahad", "Ithn", "Thal", "Arb", "Kham", "Jum"],
      },
    };
    const calendar = calendars[type];
    return calendar[style];
  }

  get_current_month(id) {
    const monAll = this.monthObj(options.CalendarType);
    const findmon = monAll.find((item) => item.id === id);
    return findmon;
  }

  the_weekend(day, firstDayOfMonth) {
    const isLastCell = (firstDayOfMonth + day - 1) % 7 === 0;
    return isLastCell;
  }

  getMonDay() {
    // current day
    const currentDay = calendar.JalaliDate.currentDateTime(
      options.CalendarType
    );
    const currentMonth = this.get_current_month(currentDay[1]);

    this.list["current_month"] = currentMonth;
    this.list["current_year"] = currentDay[0];
    this.list["current_day"] = currentDay[2];

    // started day in weeks
    const week = calendar.JalaliDate.weekDay(
      currentDay[0],
      currentDay[1],
      1,
      options.CalendarType === "jalali" ? "fa" : "en"
    );

    this.list["start_day_week"] = week - 1;

    // days
    const days = [];
    for (let day = 1; day <= currentMonth.days_in_month; day++) {
      days.push({
        day: day,
        isToDay: currentDay[2] === day ? true : false,
        is_current_month: true,
        the_weekend: this.the_weekend(day, week),
      });
    }
    return days;
  }

  create_calendar() {
    // week
    if (options.shortNameWeek) {
      this.list["weekDay"] = this.weekObj(options.CalendarType, "minWeekDays");
    } else {
      this.list["weekDay"] = this.weekObj(options.CalendarType, "WeekDays");
    }

    // month
    this.list["month"] = this.monthObj(options.CalendarType);

    // days
    this.list["days"] = this.getMonDay();

    return this.list;
  }
}

class view {
  constructor() {}
  render_week(weeks) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < weeks.length; i++) {
      const dayEl = document.createElement("div");
      dayEl.textContent = weeks[i];
      dayEl.className = "week-cell";
      fragment.appendChild(dayEl);
    }
    return fragment;
  }

  render_day(days, start_day_week) {
    const fragment = document.createDocumentFragment();
    let offset = start_day_week;
    if (offset < 0) offset = 0;

    for (let i = 0; i < days.length; i++) {
      const dayitem = days[i];
      const dayEl = document.createElement("div");
      dayEl.textContent = dayitem?.day;
      dayEl.className = "day-cell";
      if (dayitem.isToDay) dayEl.classList.add("today");
      if (!dayitem.is_current_month) dayEl.classList.add("not-current");
      if (dayitem.the_weekend) dayEl.classList.add("weekend");
      if (i === 0 && offset > 0) {
        dayEl.style.gridColumnStart = String(offset + 1);
      }

      fragment.appendChild(dayEl);
    }

    return fragment;
  }

  render(options) {
    const container = document.querySelector(".main-container");
    container.innerHTML = "";

    // week
    const weekCalendar = document.createElement("div");
    weekCalendar.classList.add("week_calendar");
    weekCalendar.appendChild(this.render_week(options.weekDay));

    // days
    const dayCalendar = document.createElement("div");
    dayCalendar.classList.add("day_calendar");
    dayCalendar.appendChild(
      this.render_day(options.days, options.start_day_week)
    );

    container.append(weekCalendar, dayCalendar);
  }
}

const options = {
  CalendarType: "jalali", // type Calendar: قمری و میلادی و شمسی و ترکیبی jalali , hijri , gregorian
  persianNumber: false,
  defaultDate: {
    year: 1404,
    month: 2,
    day: "",
  },
  calendarMode: {
    mode: "range", // range ,normal
    normal: {
      designs: "simpleHeader", //inputHeader, simpleHeader
    },
    range: {
      designs: "single", // "double", "single"
      selection: "Drag", // Drag , click
    },
  }, //انتخاب حالت تقویم
  showHolidays: true, //نمایش تعطیلات
  showAdjacentDays: false, //نمایش روزهای ماه قبل و بعد
  shortNameWeek: true, // نمایش روزهای هفته به صورت کوتاه
  displayMode: "inputIcon", //button,inputIcon,calendar,icon
  icon: "../images/icon/calendar-2.png",
  hasModal: true,
  eventDisplay: {
    showEvents: false, //نمایش رویداد ها در روز های تقویم
    eventDateList: [
      { date: "1403/12/01", title: "جشن نوروز", color: "red" },
      { date: "1404/03/05", title: "روز درختکاری", color: "yellow" },
      { date: "1404/03/05", title: "روز درختکاری", color: "blue" },
    ], //لیست روزهایی که event دارند
  },
  themes: {
    //سبک تقویم:
    // minimal,modern,classic
    theme: "minimal",
    colors: {
      //رنگ اصلی
      primary: "#F07D13",
      //رنگ دوم
      secondary: "#f5deca",
      //رنگ متن
      textColor: "#fff",
    },
    //حالت تاریک
    darkMode: false,
  },
  backgroundColor: "black",
  inputOptions: {
    placeholder: "تاریخ خود را انتخاب کنید", // متن پیش‌فرض ورودی
    icon: "../images/icon/calendar-2.png", // آیکون
    buttonLabel: "انتخاب تاریخ",
    iconPosition: "right", //left , right
  }, // سفارسی سازی input icon , button
  showButtonGoToDay: true, // نمایش متن رفتن به روز جاری
  textCurrentDay: "روز جاری",
  highlightSpecificDates: "", // مثال :1403/07/02
};
const datePicker = new date_picker(options);
