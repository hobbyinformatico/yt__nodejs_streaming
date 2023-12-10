const moment = require('moment');


export default class UtilsDate {

    static fix(v) {
        return (v < 10) ? `0${v}` : v;
    }

    /// Calcolo data, TODAY (formato 'YYYY-MM-DD')
    static todayDate() {
        return (new Date()).toISOString().slice(0, 19).split('T')[0];
    }

    /// Converto il value (data) recuperato dal DatePicker di MUI nel formato compatibile con backend
    static setDate(value) {
        return `${UtilsDate.fix(value.$y)}-${UtilsDate.fix(value.$M + 1)}-${UtilsDate.fix(value.$D)} 12:00:00`;
    }

    /// Calcolo data e ora, TODAY (formato 'YYYY-MM-DD HH:mm:ss')
    static todayDatetime() {
        return (new Date()).toISOString().slice(0, 19).replace('T', ' ');
    }

    /// Converto il value (data e ora) recuperato dal DateTimePicker di MUI nel formato compatibile con backend
    static setDatetime(value) {
        return `${UtilsDate.fix(value.$y)}-${UtilsDate.fix(value.$M + 1)}-${UtilsDate.fix(value.$D)} ${UtilsDate.fix(value.$H)}:${UtilsDate.fix(value.$m)}:00`;
    }

    /// Converto la stringa datetime (formato 'YYYY-MM-DD HH:mm:ss') da UTC a Local
    static strUtcToLocal(strDatetimeUTC) {
        return (moment.utc(strDatetimeUTC).local()).format('YYYY-MM-DD HH:mm:ss');
    }

    /// Converto la stringa datetime (formato 'YYYY-MM-DD HH:mm:ss') da Local a UTC
    static strLocalToUtc(strDatetimeLocal) {
        return (moment(strDatetimeLocal).utc()).format('YYYY-MM-DD HH:mm:ss');
    }

    /// Converto le date da Local a UTC prima di inviarle al backend
    static convertDatesBeforeSave(fields, values) {
        let newValues = {};
        for (const f of fields) {
            newValues[f.key] = values[f.key];
            if (['date', 'datetime'].includes(f.type)) {
                newValues[f.key] = UtilsDate.strLocalToUtc(values[f.key]);
            }
        }
        return newValues;
    }

    /// Converto le date da UTC a Local prima di mostrarle nelle tabelle sul client
    static convertDatesBeforeShow(fields, listValues) {
        let newListValues = [];

        for (const lv of listValues) {
            let newValues = {};
            for (const f of fields) {
                newValues[f.key] = lv[f.key];
                if (['date', 'datetime'].includes(f.type)) {
                    newValues[f.key] = UtilsDate.strUtcToLocal(lv[f.key]);
                }
            }
            newListValues.push(newValues);
        }
        return newListValues;
    }
}