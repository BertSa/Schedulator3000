import { dateFnsLocalizer } from 'react-big-calendar';
import { format, getDay, isAfter, isBefore, isSameDay, parse, startOfWeek } from 'date-fns';
import enCA from 'date-fns/locale/en-CA';

export const regex = Object.freeze({
    email: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
    phone: /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/,
    password: /.{5,}/,
    name: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
});

export const preferences = Object.freeze({
    calendar: {
        step: 30,
        timeslots: 2,
        scrollToTime: new Date(1970, 1, 1, 6),
        toolbar: true
    }
});

export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
        'en-CA': enCA
    }
});

//https://github.com/erming/stringcolor/blob/gh-pages/stringcolor.js
export function stringToColor(string: string) {
    let hash = 0;

    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }


    let color = ((hash >> 24) & 0xFF).toString(16) +
        ((hash >> 16) & 0xFF).toString(16) +
        ((hash >> 8) & 0xFF).toString(16) +
        (hash & 0xFF).toString(16);

    let num = parseInt(color, 16),
        amt = Math.round(2.55 * -10),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;

    const s: string = (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16)
        .slice(1);
    return '#' + s;
}

export function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name)
        },
        children: `${ name.split(' ')[0][0] }${ name.split(' ')[1][0] }`
    };
}

export function getCurrentTimezoneDate(date: Date) {
    return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000);
}

export function toLocalDateString(date: Date) {
    return date.toLocaleDateString('en-CA', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
}

export function isBetween(date: Date, start: Date, end: Date): boolean {
    date = new Date(date);
    start = new Date(start);
    end = new Date(end);

    return (isAfter(date, start) || isSameDay(date, start)) && (isBefore(date, end) || isSameDay(date, end));
}
