import React from 'react';
import Home from "../components/pages/main/Home";
import Head from "next/head";

const Index = () => {

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div>
                <section style={{
                    // center in page
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }} id={"main"}>
                    <Home/>
                </section>
            </div>
        </>
    );
};

export default Index;
