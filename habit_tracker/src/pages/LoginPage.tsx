import React from 'react'

import { styled } from '@mui/material/styles';

import Button from '@mui/material/Button'
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const StyledForm = styled('form')(({ theme }) => ({
    border: '2px solid #ccc', // Bordo grigio
    borderRadius: 10, // Bordi arrotondati
    padding: theme.spacing(5),
  }));

export default function LoginPage() {
  return (
    <div className="page-sm">
        <h1 className="title">LOGIN</h1>
        <div className="flex justify-center items-center h-screen">
            <StyledForm>

                <Typography variant="h4">Benvenuto su Habit Tracker</Typography>

                <TextField
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />

                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ marginY: "20px"}}
                >
                    Accedi
                </Button>

                <Link color="primary" underline="hover" sx={{cursor: 'pointer'}}>Password dimenticata?</Link>

            </StyledForm>
        </div>
    </div>
  )
}
