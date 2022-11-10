import React, {useState} from "react";
import AuthService from "../../services/AuthService";
import Box from '@mui/material/Box';
import {FormControl, IconButton, InputAdornment, Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useSnackbar} from 'notistack';

const Index = () => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    function handleLogin(e: any) {
        //console.log('Logging in with: ', username, password);
        try {
            e.preventDefault();
        } catch (e) {

        }

        setLoading(true);

        AuthService.login(username, password).then(
            () => {
                enqueueSnackbar('Login successful', {
                    variant: 'success',
                    autoHideDuration: 2500,
                });
                setTimeout(() => {
                    if (typeof window !== 'undefined')
                        window.location.href = "/";
                }, 500);
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false)
                enqueueSnackbar(resMessage, {
                    variant: 'error',
                });
            }
        );
    }

    return (
        <>
            <Box component={"form"}
                 sx={{
                     mx: "auto",
                     width: "auto"
                 }}
                 noValidate
                 autoComplete="off"
                 className={"login-form centered"}
            >
                <h1 className={"centered"}>Login</h1>
                <br/>
                <FormControl>
                    <Stack spacing={2}>
                        <TextField id="outlined-basic"
                                   onChange={(e)=> {
                                       setUsername(e.target.value)
                                   }}
                                   label="Username"
                                   variant="outlined"
                                   aria-label={"Username Input Form"}
                                   disabled={loading}
                        />
                        <TextField id="outlined-basic" type={showPassword ? "text" : "password"}
                                   label="Password" variant="outlined"
                                   onChange={(e)=> {
                                       setPassword(e.target.value)
                                   }}
                                   aria-label={"Password Input Form"}
                                   disabled={loading}
                                   InputProps={{
                                       endAdornment: <>
                                           <InputAdornment position="end">
                                               <IconButton
                                                   aria-label="toggle password visibility"
                                                   onClick={()=> {
                                                       setShowPassword(!showPassword)
                                                   }}
                                               >
                                                   {showPassword ? <Visibility/> : <VisibilityOff/>}
                                               </IconButton>
                                           </InputAdornment>
                                       </>
                                   }}
                        />
                        <Button type={"submit"} color={"success"} variant="outlined" onClick={handleLogin}
                                disabled={loading}>Login</Button>
                    </Stack>
                </FormControl>
            </Box>
        </>
    );
};

export default Index;
