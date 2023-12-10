
class model {
    constructor(
        id,
        application_id,
        application_client_id,
        application_expir_date,
        user_id,
        access_token,
        access_token_expir_date,
        refresh_token,
        refresh_token_expir_date,
        created_at,
        last_refresh_date
    ) {
        this.id = id;
        this.application_id = application_id;
        this.application_client_id = application_client_id;
        this.application_expir_date = application_expir_date;
        this.user_id = user_id;
        this.access_token = access_token;
        this.access_token_expir_date = access_token_expir_date;
        this.refresh_token = refresh_token;
        this.refresh_token_expir_date = refresh_token_expir_date;
        this.created_at = created_at;
        this.last_refresh_date = last_refresh_date;
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



module.exports = {
    model: model,
};