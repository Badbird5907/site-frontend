import React from 'react';
import {Button} from "@mui/material";
//import {Button, Stack} from "@mui/material";
import styles from './home.module.css'

const Home = () => {
    return (
        <>
            <div className={`${styles.appWrapper}`}>
                <div className={`line-height-1_1 ${styles.app}`}>
                    <h2>Hi I'm</h2>
                    <h1>Badbird5907👋</h1>
                    <h3>But people call me Bad. <i>sometimes</i></h3>
                    <h3>I'm a:</h3>
                    <h3>
                        {/*
     <Typewriter
                            options={{
                                strings: ['Full Stack Developer', 'Freelancer', 'Student', 'Video Editor'],
                                autoStart: true,
                                loop: true,
                                delay: 70,
                            }}
                        />
                        */}
                    </h3>
                    {/*
  <div className={"centered"}>
                <Stack spacing={2} direction={"row"}>
                    <Button variant={"solid"} component="a" href={"#experience"}>Experience</Button>
                    <Button variant={"soft"} component="a" href={"/blog"}>Blog</Button>
                </Stack>
                    <Button variant={"contained"} color={"softBlue"} href={"/blog"} sx={{
                    }}>Blog</Button>
                </div>
                  */}
                    <Button variant={"contained"} color={"softBlue"} href={"/blog"} sx={{}}>Blog</Button>
                </div>
            </div>
        </>
    );
};
export default Home;
