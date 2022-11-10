import '../styles/Error.css'
import {Button, Stack} from "@mui/material";
export default function ErrorPage(props: { message: string }) {
    return (
        <div className={"err"}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{props.message}</i>
            </p>
            <div className={"centered"}>
                <Stack spacing={2} direction={"row"}>
                    <Button variant={"contained"} onClick={() => {
                        if (typeof window !== 'undefined')
                            window.history.back();
                    }}>Back</Button>
                    <Button variant={"outlined"} onClick={() => {
                        if (typeof window !== 'undefined')
                            window.location.href = "/"
                    }}>Home</Button>
                </Stack>
            </div>
        </div>
    );
}
