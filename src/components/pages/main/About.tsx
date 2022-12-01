import React from 'react';
import styles from './main.module.css'

const About = (props: any) => {
    const {ghRepos, contribThisYear} = props;
    return (
        <>
            <div className={`${styles.appWrapper}`}>
                <h1>About</h1>
                <p>
                    Hey I'm Badbird5907 but people call me bad. I'm a full stack developer, content creator, and student.
                    <br/>
                    I do a lot of things, ranging from system administration and freelancing, to full-stack web development.
                </p>
                <h3>Github Stats</h3>
                <span>I currently have:</span>
                <span> - <strong>{ghRepos} public</strong> repositories on github.</span>
                <span> - <strong>{contribThisYear}</strong> contributions this year</span>
            </div>
        </>
    );
};

export default About;
