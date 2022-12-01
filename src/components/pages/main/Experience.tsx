import React from 'react';
import styles from './main.module.css'

export interface Experience {
    title: string;
    description: string;
    dateStart: number;
    dateEnd: number;
}

const Experience = (props: any) => {
    const experience = [
        {

        }
    ]
    return (
        <>
            <div className={`${styles.appWrapper}`}>
                <h1>Experience</h1>
            </div>
        </>
    );
};

export default Experience;
