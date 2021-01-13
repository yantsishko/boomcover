import { RSS } from '@component/rss';
import DB from '@db';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { CoverService } from '@service/cover';
import { IWidgetRSS, RSSWidget } from '@widget/RSS';
import { expect } from 'chai';
import { getRepository } from 'typeorm';
import { getHashFromFile, saveCoverToTMP } from './helper';

describe('Cover', () => {
    const coverResultPath = `${__dirname}/../protected/covers/data/1/result.png`;
    it('Text widget', async function() {
        this.timeout(2000);
        const coverRepository = getRepository(Cover);
        const cover = await coverRepository.findOneById(1);
        cover.settings = [
            {
                name: 'text',
                title: 'Текст',
                size: 24,
                uppercase: false,
                fontWeight: 'none',
                italic: false,
                font: 'kramola',
                color: '#5be6b4',
                text: 'Тестовый текст',
                isShown: true,
                textX: 312,
                textY: 5,
                showTextTime: false,
                textStart: null,
                textEnd: null,
                gmt: '3'
            }
        ];
        await CoverService.generate(cover);
        saveCoverToTMP('text.png', coverResultPath);
        const resultCache = getHashFromFile(coverResultPath);
        expect(resultCache).to.be.eq('0DFFC41CBDCBA3A1AE9540F5A55449DEEEAE94C11024742A1B1143368888485E');
    });
    it('Subscriber widget', async function() {
        this.timeout(2000);
        const coverRepository = getRepository(Cover);
        const cover = await coverRepository.findOneById(1);
        cover.settings = [
            {
                name: 'subscriber',
                title: 'Подписчик',
                imageSize: 100,
                imageX: 356,
                imageY: 41,
                imageFigure: 'round',
                nameSize: 23,
                nameShow: true,
                nameUppercase: false,
                nameFontWeight: 'none',
                nameItalic: false,
                nameFont: 'a_antique_titul_gr',
                nameColor: '#1ae3f0',
                nameX: 474,
                nameY: 82,
                absoluteNameX: 117,
                absoluteNameY: 40,
                lnameSize: 22,
                lnameShow: true,
                lnameUppercase: false,
                lnameFontWeight: 'none',
                lnameItalic: false,
                lnameFont: 'impress_tl',
                lnameColor: '#99822f',
                isShown: true,
                borderSize: 3,
                borderColor: '#50b867',
                lnameX: 234,
                lnameY: 55,
                absoluteLNameX: -123,
                absoluteLNameY: 13
            }
        ];
        await CoverService.generate(cover);
        saveCoverToTMP('subscriber.png', coverResultPath);
        const resultCache = getHashFromFile(coverResultPath);
        expect(resultCache).to.be.eq('319839A6678B5047B6067B38538FF87572FEEC0CF4EA3D8F6063A9490AF1C176');
    });
    it('Subscriber widget name one line', async function() {
        this.timeout(2000);
        const coverRepository = getRepository(Cover);
        const cover = await coverRepository.findOneById(1);
        cover.settings = [
            {
                name: 'subscriber',
                title: 'Подписчик',
                namePosition: 'nameFirst',
                imageSize: 100,
                imageX: 356,
                imageY: 41,
                imageFigure: 'round',
                nameSize: 23,
                nameShow: true,
                nameUppercase: false,
                nameFontWeight: 'none',
                nameItalic: false,
                nameFont: 'a_antique_titul_gr',
                nameColor: '#1ae3f0',
                nameX: 474,
                nameY: 82,
                absoluteNameX: 117,
                absoluteNameY: 40,
                isShown: true,
                borderSize: 3,
                borderColor: '#50b867',
            }
        ];
        await CoverService.generate(cover);
        saveCoverToTMP('subscriber_name_one_line.png', coverResultPath);
        const resultCache = getHashFromFile(coverResultPath);
        expect(resultCache).to.be.eq('45E7A36AC04F7E4F6184F21294DB9DB103F54F5D91CCFF443D7764924C1F217E');
    });
    it('UrlText widget', async function() {
        this.timeout(2000);
        const coverRepository = getRepository(Cover);
        const cover = await coverRepository.findOneById(1);
        cover.settings = [
            {
                name: 'url',
                size: 24,
                uppercase: false,
                fontWeight: 'none',
                italic: false,
                font: 'kramola',
                color: '#5be6b4',
                url: 'http://app.boomcover.dev/test',
                isShown: true,
                textX: 312,
                textY: 5,
                showTextTime: false,
                textStart: null,
                textEnd: null,
                gmt: '3'
            }
        ];
        await CoverService.generate(cover);
        saveCoverToTMP('urlText.png', coverResultPath);
        const resultCache = getHashFromFile(coverResultPath);
        expect(resultCache).to.be.eq('183A7A3D83E3209A7830D36FA7D952E89C3FD30C3BED76C895DE631D88C2F44A');
    });
    it('Liker day widget', async function() {
        this.timeout(2000);
        const coverRepository = getRepository(Cover);
        const cover = await coverRepository.findOneById(1);
        cover.settings = [
            {
                name: 'likerDay',
                title: 'Лайкер Дня',
                imageSize: 100,
                imageX: 356,
                imageY: 41,
                imageFigure: 'round',
                nameSize: 23,
                nameShow: true,
                nameUppercase: false,
                nameFontWeight: 'none',
                nameItalic: false,
                nameFont: 'a_antique_titul_gr',
                nameColor: '#1ae3f0',
                nameX: 474,
                nameY: 82,
                absoluteNameX: 117,
                absoluteNameY: 40,
                lnameSize: 22,
                lnameShow: true,
                lnameUppercase: false,
                lnameFontWeight: 'none',
                lnameItalic: false,
                lnameFont: 'impress_tl',
                lnameColor: '#99822f',
                isShown: true,
                borderSize: 3,
                borderColor: '#50b867',
                lnameX: 234,
                lnameY: 55,
                absoluteLNameX: -123,
                absoluteLNameY: 13,

                minLikes: 0,
                likesCountX: 492,
                likesCountY: 130,
                likesCountShow: true,
                likerIconColor: 'blue',
            }
        ];
        await CoverService.generate(cover);
        saveCoverToTMP('likerDay.png', coverResultPath);
        const resultCache = getHashFromFile(coverResultPath);
        expect(resultCache).to.be.eq('6BFB5E89C09272F51DB3016BE216FC1711C3AC54A75230A296920349E48CBDAC');
    });
    it('Traffic widget', async function() {
        this.timeout(2000);
        const coverRepository = getRepository(Cover);
        const cover = await coverRepository.findOneById(1);
        cover.settings = [
            {
                isShown: true,
                name: 'traffic',
                size: 32,
                fontWeight: 'none',
                uppercase: false,
                italic: false,
                font: 'arial',
                color: '#fff',

                region: 157,

                iconHide: false,
                iconX: 100,
                iconY: 100,
                iconSize: '40',

                textHide: false,
                textX: 200,
                textY: 100,

                markHide: false,
                markX: 200,
                markY: 150,
                markHideCounter: false,
                counterSize: 24,
                counterUppercase: false,
                counterFontWeight: 'none',
                counterItalic: false,
                counterFont: 'arial',
                counterColor: '#ffffff',

                text1: 'Дороги свободны',
                text2: 'Дороги почти свободны',
                text3: 'Местами затруднения',
                text4: 'Местами затруднения',
                text5: 'Движение плотное',
                text6: 'Движение затрудненное',
                text7: 'Серьёзные пробки',
                text8: 'Многокилометровые пробки',
                text9: 'Город стоит',
                text10: 'Пешком быстрее',
            }
        ];
        await CoverService.generate(cover);
        saveCoverToTMP('traffic.png', coverResultPath);
        const resultCache = getHashFromFile(coverResultPath);
        expect(resultCache).to.be.eq('03B9147FCA0E04F566A9882BF46F249111877BD9D616D12CA2AEDDADEE605977');
    });

    describe('Image', () => {
        it('Predifined', async function() {
            this.timeout(2000);
            const coverRepository = getRepository(Cover);
            const cover = await coverRepository.findOneById(1);
            cover.settings = [
                {
                    isShown: true,
                    name: 'image',
                    size: 150,
                    imageX: 100,
                    imageY: 100,
                    predifined_file: 'boroda_moroz'
                }
            ];
            await CoverService.generate(cover);
            saveCoverToTMP('image.png', coverResultPath);
            const resultCache = getHashFromFile(coverResultPath);
            expect(resultCache).to.be.eq('2DF6815D2E036DBFD70F20BAE7C840128BB58AE12E73AF47867189C80091C09C');
        });
        it('URL', async function() {
            this.timeout(2000);
            const coverRepository = getRepository(Cover);
            const cover = await coverRepository.findOneById(1);
            cover.settings = [
                {
                    isShown: true,
                    name: 'image',
                    size: 150,
                    imageX: 50,
                    imageY: 50,
                    file_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Logo_google%2B_2015.png'
                }
            ];
            await CoverService.generate(cover);
            saveCoverToTMP('image_url.png', coverResultPath);
            const resultCache = getHashFromFile(coverResultPath);
            expect(resultCache).to.be.eq('C4FD53C9A8D6BD431F4F287EA1A1DFAD7FA1D9345EA85E9B90CB5695A77D7A7A');
        });
    });

    describe('RSS', () => {
        it('Component', async () => {
            const rssData = await RSS.parseURL('http://news.yandex.ru/football.rss', true);
            expect(rssData.feed.entries.length).gt(0);
            expect(rssData.feed.title).eq('Яндекс.Новости: Футбол');
        });
        it('Get data', async () => {
            const group = await getRepository(SocialGroup).findOne();
            const widget: IWidgetRSS = {
                name: 'rss',
                title: 'RSS',
                isShown: true,
                size: 16,
                uppercase: false,
                fontWeight: 'none',
                italic: false,
                font: 'arial',
                color: '#FFFFFF',
                textX: 100,
                textY: 10,

                rssLink: 'http://news.yandex.ru/football.rss',
                keywords: '',
                stopwords: '',
                newsCount: 4,
                symbolsCount: 70,
                indent: 10,

                showTextTime: false,
                textStart: '',
                textEnd: '',
                gmt: ''
            };
            let widget_data = await RSSWidget.getData(widget, group);
            expect(widget_data.needShow).eq(true);
            expect(widget_data.rssData.length).eq(15);

            widget.stopwords = 'авиабилет, Мутко, чемпионат, ЧМ-2018';
            widget_data = await RSSWidget.getData(widget, group);
            expect(widget_data).deep.eq({
                needShow: true,
                rssData: [
                  {
                    title: 'Количество команд в Евролиге будет увеличено',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=matchtv.ru%2Fbasketball%2Fmatchtvnews_NI812366_Kolichestvo_komand_v_Jevrolige_budet_uvelicheno&from=rss',
                    pubDate: '27 Dec 2017 14:47:20 +0300',
                    content: 'В сезоне-2018/19 в Евролиге дебютирует французский «Асвел Вийербан» и команда, которая станет второй в Кубке Европы.',
                    contentSnippet: 'В сезоне-2018/19 в Евролиге дебютирует французский «Асвел Вийербан» и команда, которая станет второй в Кубке Европы.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=matchtv.ru%2Fbasketball%2Fmatchtvnews_NI812366_Kolichestvo_komand_v_Jevrolige_budet_uvelicheno&from=rss',
                    isoDate: '2017-12-27T11:47:20.000Z'
                  },
                  {
                    title: 'Промес назвал тройку лучших, на свой взгляд, игроков РФПЛ',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=www.championat.com%2Ffootball%2Fnews-2989823-promes-nazval-trojku-luchshih-na-svoj-vzgljad-igrokov-rfpl.html&from=rss',
                    pubDate: '27 Dec 2017 14:55:24 +0300',
                    content: 'Полузащитник «Спартака» Квинси Промес рассказал, кого, исключая игроков своей команды, он считает лучшими в чемпионате России.',
                    contentSnippet: 'Полузащитник «Спартака» Квинси Промес рассказал, кого, исключая игроков своей команды, он считает лучшими в чемпионате России.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=www.championat.com%2Ffootball%2Fnews-2989823-promes-nazval-trojku-luchshih-na-svoj-vzgljad-igrokov-rfpl.html&from=rss',
                    isoDate: '2017-12-27T11:55:24.000Z'
                  },
                  {
                    title: 'Экс-футболист Веа стал президентом Либерии',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=russian.rt.com%2Fsport%2Fnews%2F465098-futbolist-vea-prezident-liberiya&from=rss',
                    pubDate: '27 Dec 2017 15:42:59 +0300',
                    content: 'Обладатель «Золотого мяча» 1995 года Джордж Веа победил на президентских выборах в Либерии.',
                    contentSnippet: 'Обладатель «Золотого мяча» 1995 года Джордж Веа победил на президентских выборах в Либерии.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=russian.rt.com%2Fsport%2Fnews%2F465098-futbolist-vea-prezident-liberiya&from=rss',
                    isoDate: '2017-12-27T12:42:59.000Z'
                  },
                  {
                    title: 'Фурсенко прокомментировал информацию об уходе тренера «Зенита» Манчини',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=www.gazeta.ru%2Fsport%2Fnews%2F2017%2F12%2F27%2Fn_10988228.shtml&from=rss',
                    pubDate: '27 Dec 2017 14:19:08 +0300',
                    content: 'Президент петербургского &quot;Зенита&quot; Сергей Фурсенко прокомментировал информацию итальянских СМИ о возможном уходе главного тренера команды Роберто Манчини в &quot;Милан&quot;.',
                    contentSnippet: 'Президент петербургского "Зенита" Сергей Фурсенко прокомментировал информацию итальянских СМИ о возможном уходе главного тренера команды Роберто Манчини в "Милан".',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=www.gazeta.ru%2Fsport%2Fnews%2F2017%2F12%2F27%2Fn_10988228.shtml&from=rss',
                    isoDate: '2017-12-27T11:19:08.000Z'
                  },
                  {
                    title: 'Матч Кубка России между «Амкаром» и курским «Авангардом» перенесли',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=www.perm.aif.ru%2Fsport%2Ffootball%2Fmatch_kubka_rossii_mezhdu_amkarom_i_kurskim_avangardom_perenesli&from=rss',
                    pubDate: '27 Dec 2017 15:41:00 +0300',
                    content: 'Комиссия РФС перенесла матч четвертьфинала Кубка России между пермским «Амкаром» и курским «Авангардом» на день раньше.',
                    contentSnippet: 'Комиссия РФС перенесла матч четвертьфинала Кубка России между пермским «Амкаром» и курским «Авангардом» на день раньше.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=www.perm.aif.ru%2Fsport%2Ffootball%2Fmatch_kubka_rossii_mezhdu_amkarom_i_kurskim_avangardom_perenesli&from=rss',
                    isoDate: '2017-12-27T12:41:00.000Z'
                  },
                  {
                    title: 'Главный тренер «Енисея» отправлен в отставку',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=www.sport-express.ru%2Fvolleyball%2Frussia%2Fnews%2Fglavnyy-trener-eniseya-otpravlen-v-otstavku-1353356%2F&from=rss',
                    pubDate: '27 Dec 2017 11:25:00 +0300',
                    content: 'Главный тренер мужской команды &quot;Енисея&quot; Юрий Чередник покинул свой пост по решению руководства, сообщает пресс-служба клуба.',
                    contentSnippet: 'Главный тренер мужской команды "Енисея" Юрий Чередник покинул свой пост по решению руководства, сообщает пресс-служба клуба.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=www.sport-express.ru%2Fvolleyball%2Frussia%2Fnews%2Fglavnyy-trener-eniseya-otpravlen-v-otstavku-1353356%2F&from=rss',
                    isoDate: '2017-12-27T08:25:00.000Z'
                  },
                  {
                    title: 'Головин хочет стать капитаном ЦСКА и в шутку начистил бутсы Акинфеева',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=www.championat.com%2Ffootball%2Fnews-2989585-golovin-hochet-stat-kapitanom-cska-i-v-shutku-nachistil-butsy-akinfeeva.html&from=rss',
                    pubDate: '27 Dec 2017 09:46:36 +0300',
                    content: 'Начать решили с Александра Головина, который хочет стать капитаном команды и в шутку начистил бутсы Игоря Акинфеева.',
                    contentSnippet: 'Начать решили с Александра Головина, который хочет стать капитаном команды и в шутку начистил бутсы Игоря Акинфеева.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=www.championat.com%2Ffootball%2Fnews-2989585-golovin-hochet-stat-kapitanom-cska-i-v-shutku-nachistil-butsy-akinfeeva.html&from=rss',
                    isoDate: '2017-12-27T06:46:36.000Z'
                  },
                  {
                    title: '«Арсенал» предложил за Бензема 40 млн евро',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=www.sovsport.ru%2Ffootball%2Fnews%2F1020770-arsenal-predlozhil-realu-za-benzema-40-mln-evro&from=rss',
                    pubDate: '26 Dec 2017 22:23:00 +0300',
                    content: 'Моуринью уверен, что &quot;Ювентус&quot; отпустит Дибалу в &quot;МЮ&quot; за 60 млн евро По информации источника, на игрока претендует лондонский &quot;Арсенал&quot;, который рассчитывает подписать его по окончании сезона.',
                    contentSnippet: 'Моуринью уверен, что "Ювентус" отпустит Дибалу в "МЮ" за 60 млн евро По информации источника, на игрока претендует лондонский "Арсенал", который рассчитывает подписать его по окончании сезона.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=www.sovsport.ru%2Ffootball%2Fnews%2F1020770-arsenal-predlozhil-realu-za-benzema-40-mln-evro&from=rss',
                    isoDate: '2017-12-26T19:23:00.000Z'
                  }
                ]
            });

            widget.stopwords = '';
            widget.keywords = 'футболист, ЦСКА';
            widget_data = await RSSWidget.getData(widget, group);
            expect(widget_data).deep.eq({
                needShow: true,
                rssData: [
                  {
                    title: 'Экс-футболист Веа стал президентом Либерии',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=russian.rt.com%2Fsport%2Fnews%2F465098-futbolist-vea-prezident-liberiya&from=rss',
                    pubDate: '27 Dec 2017 15:42:59 +0300',
                    content: 'Обладатель «Золотого мяча» 1995 года Джордж Веа победил на президентских выборах в Либерии.',
                    contentSnippet: 'Обладатель «Золотого мяча» 1995 года Джордж Веа победил на президентских выборах в Либерии.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=russian.rt.com%2Fsport%2Fnews%2F465098-futbolist-vea-prezident-liberiya&from=rss',
                    isoDate: '2017-12-27T12:42:59.000Z'
                  },
                  {
                    title: 'В Египте постараются убедить футболистов не держать пост перед ЧМ-2018',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=russian.rt.com%2Fsport%2Fnews%2F464991-rida-ramadan-chm&from=rss',
                    pubDate: '27 Dec 2017 11:34:04 +0300',
                    content: 'Президент Египетской футбольной ассоциации Хани Абу Рида прокомментировал то, что национальная команда Египта будет проводить подготовку к чемпионату мира по футболу в России во время обязательного для мусульман поста — Рамадана.',
                    contentSnippet: 'Президент Египетской футбольной ассоциации Хани Абу Рида прокомментировал то, что национальная команда Египта будет проводить подготовку к чемпионату мира по футболу в России во время обязательного для мусульман поста — Рамадана.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=russian.rt.com%2Fsport%2Fnews%2F464991-rida-ramadan-chm&from=rss',
                    isoDate: '2017-12-27T08:34:04.000Z'
                  },
                  {
                    title: 'Головин хочет стать капитаном ЦСКА и в шутку начистил бутсы Акинфеева',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=www.championat.com%2Ffootball%2Fnews-2989585-golovin-hochet-stat-kapitanom-cska-i-v-shutku-nachistil-butsy-akinfeeva.html&from=rss',
                    pubDate: '27 Dec 2017 09:46:36 +0300',
                    content: 'Начать решили с Александра Головина, который хочет стать капитаном команды и в шутку начистил бутсы Игоря Акинфеева.',
                    contentSnippet: 'Начать решили с Александра Головина, который хочет стать капитаном команды и в шутку начистил бутсы Игоря Акинфеева.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=www.championat.com%2Ffootball%2Fnews-2989585-golovin-hochet-stat-kapitanom-cska-i-v-shutku-nachistil-butsy-akinfeeva.html&from=rss',
                    isoDate: '2017-12-27T06:46:36.000Z'
                  }
                ]
            });

            widget.stopwords = 'президент';
            widget.keywords = 'футболист, ЦСКА';
            widget_data = await RSSWidget.getData(widget, group);
            expect(widget_data).deep.eq({
                needShow: true,
                rssData: [
                  {
                    title: 'В Египте постараются убедить футболистов не держать пост перед ЧМ-2018',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=russian.rt.com%2Fsport%2Fnews%2F464991-rida-ramadan-chm&from=rss',
                    pubDate: '27 Dec 2017 11:34:04 +0300',
                    content: 'Президент Египетской футбольной ассоциации Хани Абу Рида прокомментировал то, что национальная команда Египта будет проводить подготовку к чемпионату мира по футболу в России во время обязательного для мусульман поста — Рамадана.',
                    contentSnippet: 'Президент Египетской футбольной ассоциации Хани Абу Рида прокомментировал то, что национальная команда Египта будет проводить подготовку к чемпионату мира по футболу в России во время обязательного для мусульман поста — Рамадана.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=russian.rt.com%2Fsport%2Fnews%2F464991-rida-ramadan-chm&from=rss',
                    isoDate: '2017-12-27T08:34:04.000Z'
                  },
                  {
                    title: 'Головин хочет стать капитаном ЦСКА и в шутку начистил бутсы Акинфеева',
                    link: 'http://news.yandex.ru/yandsearch?cl4url=www.championat.com%2Ffootball%2Fnews-2989585-golovin-hochet-stat-kapitanom-cska-i-v-shutku-nachistil-butsy-akinfeeva.html&from=rss',
                    pubDate: '27 Dec 2017 09:46:36 +0300',
                    content: 'Начать решили с Александра Головина, который хочет стать капитаном команды и в шутку начистил бутсы Игоря Акинфеева.',
                    contentSnippet: 'Начать решили с Александра Головина, который хочет стать капитаном команды и в шутку начистил бутсы Игоря Акинфеева.',
                    guid: 'http://news.yandex.ru/yandsearch?cl4url=www.championat.com%2Ffootball%2Fnews-2989585-golovin-hochet-stat-kapitanom-cska-i-v-shutku-nachistil-butsy-akinfeeva.html&from=rss',
                    isoDate: '2017-12-27T06:46:36.000Z'
                  }
                ]
            });
        });
        it('Widget', async function() {
            this.timeout(2000);
            const coverRepository = getRepository(Cover);
            const cover = await coverRepository.findOneById(1);
            cover.settings = [
                {
                    name: 'rss',
                    title: 'RSS',
                    isShown: true,
                    size: 16,
                    uppercase: false,
                    fontWeight: 'none',
                    italic: false,
                    font: 'arial',
                    color: '#FFFFFF',
                    textX: 100,
                    textY: 10,

                    rssLink: 'http://news.yandex.ru/football.rss',
                    keywords: '',
                    stopwords: '',
                    newsCount: 4,
                    symbolsCount: 30,
                    indent: 10,

                    showTextTime: false,
                    textStart: '',
                    textEnd: '',
                    gmt: ''
                }
            ];
            await CoverService.generate(cover);
            saveCoverToTMP('rss.png', coverResultPath);
            const resultCache = getHashFromFile(coverResultPath);
            expect(resultCache).to.be.eq('73C1A7F688F7A516250819034EF46A1041E76DAFCBE01B49D0BF25221DC1D686');
        });
    });
});
