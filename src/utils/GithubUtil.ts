import GitHub from 'github-api';
import axios from 'axios';

export const getTotalRepos = async (username: string) => {
    const gh = new GitHub(process.env.SITE_GH_API);
    const user = gh.getUser(username);
    const repos = await user.listRepos(); // for some reason this is not listing private repos
    return repos.data.length;
}

export const getContributions = async (username: string) => {
    const endpoint = 'https://api.github.com/graphql';
    const query = `
    query($userName:String!) {
        user(login: $userName){
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            contributionCount
                            date
                        }
                    }
                }
            }
        }
    }
    `;
    const variables = {
        userName: username,
    }
    const res = await axios.post(endpoint, {
        query,
        variables
    }, {
        headers: {
            Authorization: `Bearer ${process.env.SITE_GH_API}`
        }
    });
    return res.data.data.user.contributionsCollection.contributionCalendar.totalContributions;
}
