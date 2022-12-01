import React from 'react';
import Home from "../components/pages/main/Home";
import Head from "next/head";
import About from "../components/pages/main/About";
import {getContributions, getTotalRepos} from "../utils/GithubUtil";
import Skill from "../components/pages/main/Skills";
import Skills from "../components/pages/main/Skills";

const Index = (props: any) => {
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <section style={{
                // center in page
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }} id={"main"}>
                <Home/>
            </section>
            <section id={"about"}>
                <About ghRepos={props.ghRepos} contribThisYear={props.contribThisYear}/>
            </section>
            <section id={"skills"}>
                <Skills/>
            </section>
        </>
    );
};

export default Index;
export async function getStaticProps(context: any) {
    const ghRepos = await getTotalRepos("Badbird5907");
    const contribThisYear = await getContributions("Badbird5907");
    return {
        props: {
            revalidate: 120,
            contribThisYear,
            ghRepos
        }
    }
}
