import React from 'react';
import styles from './main.module.css'
import {DiJava} from "react-icons/di";
export interface Skills {
    title: string;
    description: string;
    icon: any;
}

export interface SkillGroup {
    title: string;
    skills: Skills[];
}

const Skill = (props: any) => {
    const skills: SkillGroup[] = [
        {
            title: "Languages",
            skills: [
                {
                    title: "Java",
                    description: "I have over 4 years of experience with java development, and have worked on hundreds of projects using it.",
                    icon: <DiJava/>
                }
            ]
        }
    ]
    return (
        <>
            <div className={`${styles.appWrapper}`}>
                <h1>Experience</h1>

                <div>
                    {skills.map((skillGroup: SkillGroup) => {
                        return (
                            <div>
                                <h2>{skillGroup.title}</h2>
                                {skillGroup.skills.map((skill: Skills) => {
                                    return (
                                        <div>
                                            <h3>{skill.title}</h3>
                                            <p>{skill.description}</p>
                                            {skill.icon}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
};

export default Skill;
