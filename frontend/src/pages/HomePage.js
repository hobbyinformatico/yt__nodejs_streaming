import { useEffect, useState } from "react";
import Api from "../api/Api";
import RestManager from "../providers/RestManager";
import { Card, Box } from "@mui/material";


export default function Home() {

    const [applications, setApplications] = useState([])
    const [users, setUsers] = useState([])

    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '160px',
                marginLeft: 'calc(50% - 80px)',
                padding: '20px'
            }}
        >
            <Box
                sx={{
                    paddingBottom: '20px'
                }}
            >
                {`Applications: ${applications.length}`}
            </Box>
            <Box>
                {`Users: ${users.length}`}
            </Box>
        </Card>
    );
}