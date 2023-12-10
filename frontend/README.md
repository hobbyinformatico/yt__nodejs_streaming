# Nuovo progetto
## Dipendenze
```
// creazione componente react
    nvm use 18 && npx create-react-app frontend

// REST utility
    npm install axios
// Page routing
    npm install react-router-dom
// MUI Material
    npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## Codice base
Creiamo una base con:
- contesto globale
- routing pagine
- menu
- wrapper contenuto pagine
- manager sessione login

### App.js
```

```

## Avvio
```
cd frontend
nvm use 18 && npm start
```

### Build (produzione)
```
cd frontend
nvm use 18 && npm run build
```

# Navigazione pagine
Bisogna incapsulare il componente CMP_A che richiederà la navigazione

```
import { createBrowserRouter, RouterProvider } from "react-router-dom";

return <RouterProvider router={
    createBrowserRouter({/*

        // componente interno CMP_A
            import { useNavigate } from "react-router-dom";

            const navigate = useNavigate();

            navigate("/login");

    */})
} />
```
