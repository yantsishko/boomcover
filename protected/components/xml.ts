import * as rp from 'request-promise';
import * as xml2js from 'xml2js';

export class XMLParser {

    static async parseFromUrl(url: string) {
        return await this.parse(await rp.get(url));
    }

    static async parse(xmlData: string) {
        return await new Promise<any>((resolve, reject) => {
            xml2js.parseString(xmlData, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

}
