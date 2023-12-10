
class model {
    constructor(
        id,
        password,
        last_login_date,
        is_superuser,
        email,
        first_name,
        last_name,
        active_from,
        active_to,
        is_active,
        created_at
    ) {
        this.id = id;
        this.password = password;
        this.last_login_date = last_login_date;
        this.is_superuser = is_superuser;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
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
        key: "email",
        type: "text",
        label: "Email",
        info: "Email che coincide con username",
        required: true,
        updatable: false,
        defaultValue: null
    },
    {
        key: "password",
        type: "password",
        label: "Password",
        info: "Identificativo client id dell'applicazione",
        required: true,
        updatable: true,
        defaultValue: null
    },
    {
        key: "is_superuser",
        type: "bool",
        label: "Utente ADMIN",
        info: "Se abilitato l'utente sarà un'amministratore di sistema",
        required: false,
        updatable: true,
        defaultValue: false
    },
    {
        key: "first_name",
        type: "text",
        label: "Nome",
        info: "Nome utente",
        required: true,
        updatable: true,
        defaultValue: null
    },
    {
        key: "last_name",
        type: "text",
        label: "Cognome",
        info: "Cognome utente",
        required: false,
        updatable: true,
        defaultValue: null
    },
    {
        key: "active_from",
        type: "datetime",
        label: "Valido da",
        info: "Inizio validità utente",
        required: true,
        updatable: true,
        defaultValue: null
    },
    {
        key: "active_to",
        type: "datetime",
        label: "Valido a",
        info: "Fine validità utente",
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
        defaultValue: true
    },
];



module.exports = {
    model: model,
    validate: validate,
    form: form,
};