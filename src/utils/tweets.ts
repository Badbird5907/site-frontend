/*
The MIT License (MIT)

Copyright (c) 2015 gatsbyjs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
import qs from 'qs';
import axios from "axios";

export const getTweets = async (ids: string[]) => {
    if (!process.env.TWITTER_API_KEY) {
        return {};
    }
    const queryParams = qs.stringify({
        ids: ids.join(','),
        expansions:
            'author_id,attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id',
        'tweet.fields':
            'attachments,author_id,public_metrics,created_at,id,in_reply_to_user_id,referenced_tweets,text',
        'user.fields': 'id,name,profile_image_url,protected,url,username,verified',
        'media.fields':
            'duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics',
    });

    console.log('Twitter API: ', process.env.TWITTER_API_KEY)

    /*
    const response = await fetch(
        `https://api.twitter.com/2/tweets?${queryParams}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_API_KEY}`,
            },
        }
    );
     */
    const res = await axios.get(`https://api.twitter.com/2/tweets?${queryParams}`, {
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_API_KEY}`,
        }
    })

    const tweets = (await res.data) as RawTweetType;
    if (!tweets) {
        throw new Error('No tweets found');
    }

    const getAuthorInfo = (author_id: string) => {
        return tweets.includes.users.find((user) => user.id === author_id)!;
    };

    const getReferencedTweets = (mainTweet: TweetData) => {
        return (
            mainTweet?.referenced_tweets?.map((referencedTweet) => {
                const fullReferencedTweet = tweets.includes.tweets.find(
                    (tweet) => tweet.id === referencedTweet.id
                )!;

                return {
                    ...fullReferencedTweet,
                    type: referencedTweet.type,
                    author: getAuthorInfo(fullReferencedTweet.author_id),
                };
            }) || []
        );
    };

    return tweets.data.reduce(
        (allTweets: Record<string, TransformedTweet>, tweet: TweetData) => {
            const tweetWithAuthor = {
                ...tweet,
                media:
                    tweet?.attachments?.media_keys.map((key) =>
                        tweets.includes.media.find((media) => media.media_key === key)
                    ) || [],
                referenced_tweets: getReferencedTweets(tweet),
                author: getAuthorInfo(tweet.author_id),
            };

            // @ts-ignore @MaximeHeckel: somehow media types are conflicting
            allTweets[tweet.id] = tweetWithAuthor;

            return allTweets;
        },
        {} as Record<string, TransformedTweet>
    );
};
type TweetMedia = {
    media_key: string;
    type: string;
    url: string;
    height: number;
    width: number;
};

export type RawTweetType = {
    includes: {
        media: TweetMedia[];
        users: Array<{
            verified: boolean;
            url: string;
            profile_image_url: string;
            protected: boolean;
            username: string;
            name: string;
            id: string;
        }>;
        tweets: TweetData[];
    };
    data: TweetData[];
};

export interface TweetData {
    text: string;
    type: string;
    referenced_tweets: TweetData[];
    public_metrics: {
        retweet_count?: number;
        reply_count: number;
        like_count: number;
        quote_count: number;
    };
    created_at: string;
    attachments: {
        media_keys: string[];
    };
    id: string;
    author_id: string;
}

export interface TransformedTweet extends TweetData {
    author: {
        verified: boolean;
        url: string;
        profile_image_url: string;
        protected: boolean;
        username: string;
        name: string;
        id: string;
    };
    media: TweetMedia[];
    referenced_tweets: TransformedTweet[];
}
