
class model {
    constructor(
        id,
        client_id,
        accesstokens_expir_hours,
        refreshtokens_expir_hours,
        max_active_sessions,
        active_from,
        active_to,
        is_active,
        created_at
    ) {
        this.id = id;
        this.client_id = client_id;
        this.accesstokens_expir_hours = accesstokens_expir_hours;
        this.refreshtokens_expir_hours = refreshtokens_expir_hours;
        this.max_active_sessions = max_active_sessions;
        this.active_from = active_from;
        this.active_to = active_to;
        this.is_active = is_active;
        this.created_at = created_at;
    }
}

/// Verifico che i campi ricevuti siano quelli attesi (ne più ne meno)
function validate(dataModel) {
    const fieldsList = form.map((f) => ({
        key: f.key,
        required: f.required,
    }));

    for (const key in dataModel) {
        // check esistenza campo
        const res = fieldsList.filter((f) => f.key === key);
        if (res.length > 0) {
            // check valorizzazione se "required = true"
            if (res[0].required == true && ([null, ''].includes(dataModel[key])) == false) {
                // ok => passo a controllare il prossimo
                continue;
            }
        }
        return false;
    }
    return true;
}

/// Lista campi form con info di validità
const form = [
    {
        key: "id",
        type: "hidden",
        label: "",
        info: "",
        required: false,
        updatable: false,
        defaultValue: null
    },
    {
        key: "client_id",
        type: "text",
        label: "Client ID",
        info: "Identificativo client id dell'applicazione",
        required: true,
        updatable: false,
        defaultValue: "prova2" //null
    },
    {
        key: "accesstokens_expir_hours",
        type: "number",
        label: "Durata access token",
        info: "Durata access token (ore)",
        required: true,
        updatable: true,
        defaultValue: 1 //null
    },
    {
        key: "refreshtokens_expir_hours",
        type: "number",
        label: "Durata refresh token",
        info: "Durata refresh token (ore)",
        required: true,
        updatable: true,
        defaultValue: 48 //null
    },
    {
        key: "max_active_sessions",
        type: "number",
        label: "Max sessioni attive",
        info: "Numero massimo di sessioni attive per utente",
        required: true,
        updatable: true,
        defaultValue: 2 //null
    },
    {
        key: "active_from",
        type: "datetime",
        label: "Valido da",
        info: "Inizio validità applicazione",
        required: true,
        updatable: true,
        defaultValue: null
    },
    {
        key: "active_to",
        type: "datetime",
        label: "Valido a",
        info: "Fine validità applicazione",
        required: true,
        updatable: true,
        defaultValue: null
    },
    {
        key: "is_active",
        type: "bool",
        label: "Attivo",
        info: "Attivare o disattivare l'applicazione",
        required: false,
        updatable: true,
        defaultValue: true //null
    },
];



module.exports = {
    model: model,
    validate: validate,
    form: form,
};