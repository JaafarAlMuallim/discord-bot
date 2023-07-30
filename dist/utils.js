"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatString = exports.sortByDateAndTime = exports.convertTimeTo24HourFormat = void 0;
const convertTimeTo24HourFormat = (time) => {
    if (time.endsWith("PM") && !time.startsWith("12")) {
        const hour = parseInt(time.slice(0, 2)) + 12;
        return `${hour}:${time.slice(2, 4)}`;
    }
    else {
        return time.slice(0, -2);
    }
};
exports.convertTimeTo24HourFormat = convertTimeTo24HourFormat;
const sortByDateAndTime = (data) => {
    const sortedByName = data.sort((a, b) => a.courseName.localeCompare(b.courseName));
    const sortedByTime = sortedByName.sort((a, b) => {
        const timeA = (0, exports.convertTimeTo24HourFormat)(a.time);
        const timeB = (0, exports.convertTimeTo24HourFormat)(b.time);
        return timeA > timeB ? -1 : timeB > timeA ? 1 : 0;
    });
    const sortedByDate = sortedByTime.sort((a, b) => a.date.localeCompare(b.date));
    return sortedByDate;
};
exports.sortByDateAndTime = sortByDateAndTime;
const formatString = (id) => {
    if (id.split(" ").length === 2) {
        return id;
    }
    else {
        const index = id.search(/[0-9]/);
        return `${id.slice(0, index)} ${id.slice(index)}`;
    }
};
exports.formatString = formatString;
