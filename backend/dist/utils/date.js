"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateOnlyToStart = parseDateOnlyToStart;
exports.parseDateOnlyToEnd = parseDateOnlyToEnd;
function parseDateOnlyToStart(dateStr) {
    // dateStr no formato YYYY-MM-DD
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}
function parseDateOnlyToEnd(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
}
