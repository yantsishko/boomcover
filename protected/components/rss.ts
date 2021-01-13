import config from '@config';
import { readFileSync } from 'graceful-fs';
import { join } from 'path';
import { parseURL } from 'rss-parser';

export interface RSSEntry {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    contentSnippet: string;
    guid: string;
    isoDate: Date;
};

export interface ParsedRSS {
    feed: {
        entries: RSSEntry[];
        title: string;
        description: string;
        link: string;
    };
}

export class RSS {
    static parseURL(url: string, ignoreTest: boolean = false): Promise<ParsedRSS> {
        return new Promise<ParsedRSS>((resolve, reject) => {
            if (config.isTest && !ignoreTest) {
                resolve(
                    JSON.parse(
                        readFileSync(
                            join(__dirname, '..', '..', 'test', 'resources', 'json', 'parsed_rss.json')
                        ).toString()
                    ) as ParsedRSS
                );
            } else {
                parseURL(url, (err, parsed) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(parsed);
                    }
                });
            }
        });
    }
}
