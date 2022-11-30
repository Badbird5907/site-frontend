// noinspection HtmlRequiredTitleElement

import Document, {Head, Html, Main, NextScript} from "next/document";
import React from "react";

class MyDocument extends Document {
    render() {
        return (
            <Html lang={'en'}>
                <Head>
                    <link rel="icon" type="image/gif" href="https://cdn.badbird.dev/assets/profile.gif"/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
