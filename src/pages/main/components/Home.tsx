import React from 'react';
import Typewriter from "typewriter-effect";
import {Button, Stack} from "@mui/material";

const Home = () => {
    return (
        <div className="app">
            <h2>Hi I'm</h2>
            <h1>Badbird5907👋</h1>
            <h3>But people call me Bad. <i>sometimes</i></h3>
            <h3>I'm a: <Typewriter
                options={{
                    strings: ['Full Stack Developer', 'Freelancer', 'Student', 'Video Editor'],
                    autoStart: true,
                    loop: true,
                    delay: 70,
                }}
            /></h3>
            <div>
                <Stack spacing={2} direction={"row"}>
                    <Button variant={"contained"} href={"#experience"}>Experience</Button>
                    <Button variant={"outlined"} href={"/blog"}>Blog</Button>
                </Stack>
            </div>
        </div>
    );
};

export default Home;
