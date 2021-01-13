import { Files } from '@component/files';
import DB from '@db';
import { Partner } from '@entity/Partner';
import { expect, use } from 'chai';
import chaiDateTime = require('chai-datetime');
import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import { getRepository } from 'typeorm';
import { Cover } from '../protected/entities/Cover';
import { SocialGroup } from '../protected/entities/SocialGroup';
import { SocialGroupComment } from '../protected/entities/SocialGroupComment';
import { SocialGroupLike } from '../protected/entities/SocialGroupLike';
import { SocialGroupRepost } from '../protected/entities/SocialGroupRepost';
import { Subscription } from '../protected/entities/Subscription';
import { User } from '../protected/entities/User';
import { GroupService } from '../protected/services/group';
import { UserService } from '../protected/services/user';

use(chaiDateTime);

describe('App', () => {
    it('Clear cache', async function() {
        this.timeout(20000);
        const CachePath = path.join(__dirname, '..', 'protected', 'runtime', 'cache');
        const files = fs.readdirSync(CachePath);
        for (const file of files) {
            if (file !== '.gitignore') {
                Files.rm(path.join(CachePath, file));
            }
        }
        expect(fs.readdirSync(CachePath).length).to.be.eq(1);
    });
    it('Create DB', async function() {
        this.timeout(20000);
        const connection = await DB.getConnection(true);
        expect(connection.isConnected).to.be.eq(true);
    });
    it('Create 2 partners', async () => {
        const partnerRepository = getRepository(Partner);

        const partner8 = new Partner();
        partner8.code = 'partner8';
        partner8.days_count = 8;
        await partnerRepository.save(partner8);

        const partner10 = new Partner();
        partner10.code = 'partner10';
        partner10.days_count = 10;
        await partnerRepository.save(partner10);

        expect(await partnerRepository.count()).to.be.eq(2);
    });
    it('Create 5 users', async () => {
        const subscriptionRepository = getRepository(Subscription);
        const now = moment().utcOffset(0).startOf('day');
        let subscription: Subscription;

        await UserService.authorizeUser(`Test 1`, `Test 1`, `test1@test.test`);
        subscription = await subscriptionRepository.findOneById(1);
        expect(subscription.amount).to.be.eq(1);
        expect(subscription.user.id).to.be.eq(1);
        expect(subscription.isActive()).to.be.eq(true);
        expect(subscription.start_date).to.be.equalDate(now.toDate());
        expect(subscription.end_date).to.be.equalDate(now.clone().add(5, 'days').toDate());

        await UserService.authorizeUser(`Test 2`, `Test 2`, `test2@test.test`, {
            type: 'partner',
            code: 'fakecode'
        });
        subscription = await subscriptionRepository.findOneById(2);
        expect(subscription.amount).to.be.eq(1);
        expect(subscription.user.id).to.be.eq(2);
        expect(subscription.isActive()).to.be.eq(true);
        expect(subscription.start_date).to.be.equalDate(now.toDate());
        expect(subscription.end_date).to.be.equalDate(now.clone().add(5, 'days').toDate());

        await UserService.authorizeUser(`Test 3`, `Test 3`, `test3@test.test`, {
            type: 'partner',
            code: 'partner8'
        });
        subscription = await subscriptionRepository.findOneById(3);
        expect(subscription.amount).to.be.eq(1);
        expect(subscription.user.id).to.be.eq(3);
        expect(subscription.isActive()).to.be.eq(true);
        expect(subscription.start_date).to.be.equalDate(now.toDate());
        expect(subscription.end_date).to.be.equalDate(now.clone().add(8, 'days').toDate());

        await UserService.authorizeUser(`Test 4`, `Test 4`, `test4@test.test`, {
            type: 'partner',
            code: 'partner10'
        });
        subscription = await subscriptionRepository.findOneById(4);
        expect(subscription.amount).to.be.eq(1);
        expect(subscription.user.id).to.be.eq(4);
        expect(subscription.isActive()).to.be.eq(true);
        expect(subscription.start_date).to.be.equalDate(now.toDate());
        expect(subscription.end_date).to.be.equalDate(now.clone().add(10, 'days').toDate());

        await UserService.authorizeUser(`Test 5`, `Test 5`, `test5@test.test`, {
            type: 'referral',
            promocode: 'refTest1'
        });
        subscription = await subscriptionRepository.findOneById(5);
        expect(subscription.amount).to.be.eq(1);
        expect(subscription.user.id).to.be.eq(5);
        expect((await subscription.user.referral_parent).id).to.be.eq(1);
        expect(subscription.isActive()).to.be.eq(true);
        expect(subscription.start_date).to.be.equalDate(now.toDate());
        expect(subscription.end_date).to.be.equalDate(now.clone().add(5, 'days').toDate());

        const userRepository = getRepository(User);
        const user = await userRepository.findOneById(1);
        expect(user.id).to.be.eq(1);
        expect(user.email).to.be.eq('test1@test.test');
        expect(user.firstName).to.be.eq('Name');
        expect(user.img).to.be.eq('https://vk.com/images/camera_200.png');

        expect(await userRepository.count()).to.be.eq(5);
    });
    it('Create groups', async () => {
        const userRepository = getRepository(User);
        for (let user_index = 1; user_index <= await userRepository.count(); user_index++) {
            const user = await userRepository.findOneById(user_index);
            const groupRepository = getRepository(SocialGroup);

            for (let i = 1; i <= 5; i++) {
                const group = new SocialGroup();
                group.access_token = 'test';
                group.connected = true;
                group.group_type = 'group';
                group.social_id = `test${user_index}${i}`;
                group.social_server_id = '1';
                group.title = `Test group ${user_index}${i}`;
                group.is_closed = false;
                group.need_captcha = false;
                group.user = user;
                group.members = 13 * user_index * i;
                group.img = 'https://vk.com/images/community_100.png';
                await GroupService.createCover(group, true);
            }

            for (let i = 1; i <= 5; i++) {
                const group = new SocialGroup();
                group.access_token = 'test';
                group.connected = false;
                group.group_type = 'group';
                group.social_id = `test${user_index - 1}${i}`;
                group.social_server_id = '1';
                group.title = `Test group ${user_index}${i}`;
                group.is_closed = false;
                group.need_captcha = false;
                group.user = user;
                group.members = 13 * user_index * i;
                group.img = 'https://vk.com/images/community_100.png';
                await GroupService.createCover(group, true);
            }

            expect(await groupRepository.count()).to.be.eq(10 * user_index);
        }
    });
    it('Change group owner', async () => {
        const likesRepository = getRepository(SocialGroupLike);
        const repostsRepository = getRepository(SocialGroupRepost);
        const commentsRepository = getRepository(SocialGroupComment);
        const groupRepository = getRepository(SocialGroup);
        const connectedGroup = await groupRepository.findOne({
            where: {
                social_id: 'test11',
                connected: true
            }
        });
        const date = new Date();
        for (let i = 0; i < 25; i++) {
            const comment = new SocialGroupComment();
            comment.comment_id = `${i}`;
            comment.comment_text = `Comment text`;
            comment.date = new Date(date.valueOf() + i * 1000);
            comment.group = connectedGroup;
            comment.likes = 3 * i + (i % 3 * 132);
            comment.post_id = `${i}`;
            comment.user_first_name = `Test ${i % 4 + 1}`;
            comment.user_last_name = `Test ${i % 4 + 1}`;
            comment.user_photo = `https://vk.com/images/camera_200.png`;
            comment.user_social_id = `Test ${i % 4 + 1}`;
            await commentsRepository.save(comment);
        }
        for (let i = 0; i < 21; i++) {
            const repost = new SocialGroupRepost();
            repost.date = new Date(date.valueOf() + i * 1000);
            repost.group = connectedGroup;
            repost.post_id = `${i}`;
            repost.user_first_name = `Test ${i % 4 + 1}`;
            repost.user_last_name = `Test ${i % 4 + 1}`;
            repost.user_photo = `https://vk.com/images/camera_200.png`;
            repost.user_social_id = `Test ${i % 4 + 1}`;
            await repostsRepository.save(repost);
        }
        for (let i = 0; i < 13; i++) {
            const like = new SocialGroupLike();
            like.group = connectedGroup;
            like.post_id = `${i}`;
            like.user_first_name = `Test ${i % 4 + 1}`;
            like.user_last_name = `Test ${i % 4 + 1}`;
            like.user_photo = `https://vk.com/images/camera_200.png`;
            like.user_social_id = `Test ${i % 4 + 1}`;
            await likesRepository.save(like);
        }
        let notConnectedGroup = await groupRepository.findOne({
            where: {
                social_id: 'test11',
                connected: false
            }
        });
        notConnectedGroup.connected = true;
        notConnectedGroup = await GroupService.checkSameGroup(notConnectedGroup);

        expect((await notConnectedGroup.comments).length).to.be.eq(25);
        expect((await notConnectedGroup.reposts).length).to.be.eq(21);
        expect((await notConnectedGroup.likes).length).to.be.eq(13);
        expect((await notConnectedGroup.cover).id).to.be.eq(1);

        await GroupService.checkSameGroup(connectedGroup);
        expect((await connectedGroup.comments).length).to.be.eq(25);
        expect((await connectedGroup.reposts).length).to.be.eq(21);
        expect((await connectedGroup.likes).length).to.be.eq(13);
        expect((await connectedGroup.cover).id).to.be.eq(1);
    });
    it('Check group cache', async () => {
        const coverRepository = getRepository(Cover);
        const groupRepository = getRepository(SocialGroup);
        const group = await groupRepository.findOne({
            where: {
                social_id: 'test11',
                connected: true
            }
        });
        const cover = await group.cover;
        cover.settings = [
            { name: 'commentatorLast', nameX: 674, nameY: 120, title: 'Посл. комментатор', imageX: 564, imageY: 100, lnameX: 674, lnameY: 150, isShown: true, commentX: 110, commentY: 100, nameFont: 'arial', nameShow: true, nameSize: 14, imageSize: 100, lnameFont: 'Arial', lnameShow: true, lnameSize: 14, nameColor: '#ffffff', borderSize: 0, lnameColor: '#ffffff', nameItalic: false, borderColor: '#ffffff', commentFont: 'arial', commentShow: false, commentSize: 14, imageFigure: 'square', lnameItalic: false, commentColor: '#ffffff', absoluteNameX: 110, absoluteNameY: 20, commentItalic: false, nameUppercase: false, absoluteLNameX: 110, absoluteLNameY: 50, lnameUppercase: false, nameFontWeight: 'none', lnameFontWeight: 'none', absoluteCommentX: 110, absoluteCommentY: 100, commentUppercase: false, commentFontWeight: 'none' },
            { name: 'commentatorLikes', likeX: 674, likeY: 80, nameX: 674, nameY: 20, title: 'Комм. по лайкам', imageX: 564, imageY: 0, lnameX: 674, lnameY: 50, period: 1, isShown: true, commentX: 110, commentY: 100, minLikes: 5, nameFont: 'arial', nameShow: true, nameSize: 14, imageSize: 100, likeColor: 'blue', lnameFont: 'Arial', lnameShow: true, lnameSize: 14, nameColor: '#ffffff', borderSize: 0, changeTime: '', lnameColor: '#ffffff', nameItalic: false, borderColor: '#ffffff', commentFont: 'arial', commentShow: false, commentSize: 14, imageFigure: 'square', lnameItalic: false, commentColor: '#ffffff', absoluteLikeX: 110, absoluteLikeY: 80, absoluteNameX: 110, absoluteNameY: 20, commentItalic: false, nameUppercase: false, absoluteLNameX: 110, absoluteLNameY: 50, lnameUppercase: false, nameFontWeight: 'none', lnameFontWeight: 'none', absoluteCommentX: 110, absoluteCommentY: 100, commentUppercase: false, commentFontWeight: 'none' },
            { name: 'commentatorDay', nameX: 309, nameY: 20, title: 'Комментатор дня', imageX: 199, imageY: 0, lnameX: 309, lnameY: 50, isShown: true, commentX: 110, commentY: 100, minLikes: 5, nameFont: 'Arial', nameShow: true, nameSize: 14, imageSize: 100, lnameFont: 'Arial', lnameShow: true, lnameSize: 14, nameColor: '#ffffff', borderSize: 0, changeTime: '', lnameColor: '#ffffff', nameItalic: false, borderColor: '#ffffff', commentFont: 'arial', commentShow: false, commentSize: 14, imageFigure: 'square', lnameItalic: false, commentColor: '#ffffff', CommentCountX: 309, CommentCountY: 80, absoluteNameX: 110, absoluteNameY: 20, commentItalic: false, nameUppercase: false, absoluteLNameX: 110, absoluteLNameY: 50, lnameUppercase: false, nameFontWeight: 'none', lnameFontWeight: 'none', absoluteCommentX: 110, absoluteCommentY: 100, commentCountShow: false, commentIconColor: 'blue', commentUppercase: false, commentFontWeight: 'none', absoluteCommentCountX: 110, absoluteCommentCountY: 80 },
            { name: 'reposterDay', nameX: 492, nameY: 120, title: 'Репостер дня', imageX: 382, imageY: 100, lnameX: 492, lnameY: 150, isShown: true, nameFont: 'Arial', nameShow: true, nameSize: 14, imageSize: 100, lnameFont: 'Arial', lnameShow: true, lnameSize: 14, nameColor: '#ffffff', borderSize: 0, changeTime: '', lnameColor: '#ffffff', minReposts: 0, nameItalic: false, borderColor: '#ffffff', imageFigure: 'square', lnameItalic: false, absoluteNameX: 110, absoluteNameY: 20, nameUppercase: false, repostsCountX: 492, repostsCountY: 180, absoluteLNameX: 110, absoluteLNameY: 50, lnameUppercase: false, nameFontWeight: 'none', lnameFontWeight: 'none', repostsCountShow: true, reposterIconColor: 'blue', absoluteRepostsCountX: 110, absoluteRepostsCountY: 80 },
            { name: 'likerDay', nameX: 492, nameY: 120, title: 'Лайкер дня', imageX: 382, imageY: 100, lnameX: 492, lnameY: 150, isShown: true, nameFont: 'Arial', nameShow: true, nameSize: 14, imageSize: 100, lnameFont: 'Arial', lnameShow: true, lnameSize: 14, nameColor: '#ffffff', borderSize: 0, changeTime: '', lnameColor: '#ffffff', minLikes: 0, nameItalic: false, borderColor: '#ffffff', imageFigure: 'square', lnameItalic: false, absoluteNameX: 110, absoluteNameY: 20, nameUppercase: false, likesCountX: 492, likesCountY: 180, absoluteLNameX: 110, absoluteLNameY: 50, lnameUppercase: false, nameFontWeight: 'none', lnameFontWeight: 'none', likesCountShow: true, likerIconColor: 'blue', absoluteLikesCountX: 110, absoluteLikesCountY: 80 },
            { name: 'reposterLast', nameX: 492, nameY: 20, title: 'Посл. репостер', imageX: 382, imageY: 0, lnameX: 492, lnameY: 50, isShown: true, nameFont: 'arial', nameShow: true, nameSize: 14, imageSize: 100, lnameFont: 'Arial', lnameShow: true, lnameSize: 14, nameColor: '#ffffff', borderSize: 0, lnameColor: '#ffffff', nameItalic: false, borderColor: '#ffffff', imageFigure: 'square', lnameItalic: false, absoluteNameX: 110, absoluteNameY: 20, nameUppercase: false, absoluteLNameX: 110, absoluteLNameY: 50, lnameUppercase: false, nameFontWeight: 'none', lnameFontWeight: 'none' }
        ];
        await coverRepository.save(cover);
        await GroupService.updateCachedData(group, true);
        expect((await group.cache).data).to.be.deep.eq({
            commentatorLikes: {
                first_name: 'Test 4',
                last_name: 'Test 4',
                photo_max: 'https://vk.com/images/camera_200.png',
                likes: 333
            },
            commentatorDay: {
                first_name: 'Test 1',
                last_name: 'Test 1',
                photo_max: 'https://vk.com/images/camera_200.png',
                likes: 324,
                comments_count: 6
            },
            reposterDay: {
                first_name: 'Test 1',
                last_name: 'Test 1',
                photo_max: 'https://vk.com/images/camera_200.png',
                reposts_count: 6
            },
            likerDay: {
                first_name: 'Test 1',
                last_name: 'Test 1',
                photo_max: 'https://vk.com/images/camera_200.png',
                likes_count: 4
            }
        });
    });
    it('Check group captcha', async () => {
        const groupRepository = getRepository(SocialGroup);
        let group = await groupRepository.findOneById(1);

        await GroupService.setNeedCaptcha(group, true);
        group = await groupRepository.findOneById(1);
        expect(group.need_captcha).to.be.eq(true);
        expect(group.set_captcha).not.to.be.eq(null);

        await GroupService.setNeedCaptcha(group, false);
        group = await groupRepository.findOneById(1);
        expect(group.need_captcha).to.be.eq(false);
        expect(group.set_captcha).to.be.eq(null);
    });
    it('Check group captcha removing', async () => {
        const groupRepository = getRepository(SocialGroup);
        let groups = [
            await groupRepository.findOneById(2),
            await groupRepository.findOneById(3),
            await groupRepository.findOneById(4),
            await groupRepository.findOneById(5),
            await groupRepository.findOneById(6)
        ];

        for (let group of groups) {
            group = await GroupService.setNeedCaptcha(group, true);
        }
        groups[1].set_captcha = moment().subtract(20, 'minutes').unix();
        await groupRepository.save(groups[1]);
        groups[2].set_captcha = moment().subtract(15, 'minutes').unix();
        await groupRepository.save(groups[2]);
        groups[3].set_captcha = moment().subtract(5, 'minutes').unix();
        await groupRepository.save(groups[3]);
        groups[4].set_captcha = moment().subtract(40, 'minutes').unix();
        await groupRepository.save(groups[4]);

        await GroupService.removeNeedCaptcha();
        groups = [
            await groupRepository.findOneById(2),
            await groupRepository.findOneById(3),
            await groupRepository.findOneById(4),
            await groupRepository.findOneById(5),
            await groupRepository.findOneById(6)
        ];
        expect(groups[0].need_captcha).to.be.eq(true);
        expect(groups[1].need_captcha).to.be.eq(false);
        expect(groups[2].need_captcha).to.be.eq(false);
        expect(groups[3].need_captcha).to.be.eq(true);
        expect(groups[4].need_captcha).to.be.eq(false);

        for (let group of groups) {
            group = await GroupService.setNeedCaptcha(group, false);
        }
    });
});
