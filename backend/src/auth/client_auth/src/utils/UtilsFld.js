
export default class UtilsFld {

    /// Conversione stringa in numero (se fallisce => reset a 0)
    static fixNum(v) {
        try {
            const res = parseFloat(v);
            if (res.toString() !== v.toString()) {
                // valore non corretto => reset a 0
                return 0;
            }
            return res;
        }
        catch (e) { }
        // default => 0
        return 0;
    }

    /// Controllo obbligatorietà valore
    static checkRequired(item, v) {
        if (item.required === true) {
            if (v === null || v.toString().trim() === "") {
                return false;
            }
        }
        return true;
    }

    /// Controllo obbligatorietà della data o parte di essa
    static checkRequiredDatetime(item, v) {
        if (item.required === true) {
            // Se nel picker (date o datetime):
            //  1. si seleziona tutto e si cancella
            //      - diventa: v == NULL
            //  2. si seleziona uno o più elementi della data\ora e si cancellano (es. giorno o minuti)
            //      - diventa: v == NaN
            if (v === null || isNaN(v.$y)) {
                return false;
            }
        }
        return true;
    }

    /// Check obbligatorietà campi del form
    static validateForm(fields, values, errors) {
        let errorFields = [];

        for (let f of fields) {
            if (f.required === true && errors[f.key] === true) {
                errorFields.push(f.label);
            }
        }

        if (errorFields.length > 0) {
            return {
                type: 'E',
                msg: `Verificare i valori di: ${errorFields.join(', ')}`
            };
        }
        else {
            return {
                type: 'S',
                msg: "Campi correttamente validati"
            };
        }
    }
}