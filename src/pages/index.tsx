import React from 'react';
import Home from "../components/pages/main/Home";

const Index = () => {

    return (
        <>
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
