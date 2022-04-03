export const regex = Object.freeze({
    email: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
    phone: /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/,
});

export function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }

    return color;
}

export function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name)
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    };
}

export function getCurrentTimezoneDate(date: Date) {
   return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000)
}

export function getBeginningOfWeek(date: string | Date) {
    date = new Date(date);
    let day = date.getDay();
    let diff = date.getDate() - day;
    return new Date(date.setDate(diff));
}

export function toLocalDateString(date: Date) {
    return date.toLocaleDateString('en-CA', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
}
