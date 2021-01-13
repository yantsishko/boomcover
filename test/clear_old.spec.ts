import { Message } from '@entity/Message';
import { SocialGroupComment } from '@entity/SocialGroupComment';
import { SocialGroupRepost } from '@entity/SocialGroupRepost';
import { CommentService } from '@service/comment';
import { MessageService } from '@service/message';
import { RepostService } from '@service/reposts';
import { expect } from 'chai';
import * as moment from 'moment';
import { getRepository } from 'typeorm';

describe('Clear old', () => {
    it('Messages', async () => {
        const messagesRepository = getRepository(Message);
        const messagesCountToAdd = 3;
        for (let i = 0; i < messagesCountToAdd; i++) {
            await MessageService.addMessage(`test${i}`);
        }
        expect(await messagesRepository.count()).to.be.eq(messagesCountToAdd);
        await MessageService.clearOld();
        expect(await messagesRepository.count()).to.be.eq(0);

        for (let i = 0; i < messagesCountToAdd; i++) {
            const message = new Message();
            message.message_key = `test${i}`;
            await messagesRepository.save(message);
            message.create_date = moment().subtract(1, 'days').toDate();
            await messagesRepository.save(message);
        }
        await MessageService.clearAll();
        expect(await messagesRepository.count()).to.be.eq(0);
    });

    it('Reposts', async () => {
        const repostsRepository = getRepository(SocialGroupRepost);
        const oldRepostsCount = await repostsRepository.count();
        const repostsCountToAdd = 3;
        for (let i = 0; i < repostsCountToAdd; i++) {
            const repost = new SocialGroupRepost();
            repost.post_id = `test${i}`;
            repost.user_social_id = `test${i}`;
            repost.user_first_name = `test${i}`;
            repost.user_last_name = `test${i}`;
            repost.user_photo = `test${i}`;
            repost.date = moment().utc().subtract(2, 'days').toDate();
            await repostsRepository.save(repost);
        }
        expect(await repostsRepository.count()).to.be.eq(oldRepostsCount + repostsCountToAdd);
        await RepostService.clearOld();
        expect(await repostsRepository.count()).to.be.eq(oldRepostsCount);
    });

    it('Comments', async () => {
        const commentRepository = getRepository(SocialGroupComment);
        const oldCommentsCount = await commentRepository.count();
        const commentsCountToAdd = 3;
        for (let i = 0; i < commentsCountToAdd; i++) {
            const comment = new SocialGroupComment();
            comment.post_id = `test${i}`;
            comment.comment_id = `test${i}`;
            comment.comment_text = `test${i}`;
            comment.likes = 5;
            comment.user_social_id = `test${i}`;
            comment.user_first_name = `test${i}`;
            comment.user_last_name = `test${i}`;
            comment.user_photo = `test${i}`;
            comment.date = moment().utc().subtract(2, 'days').toDate();
            await commentRepository.save(comment);
        }
        expect(await commentRepository.count()).to.be.eq(oldCommentsCount + commentsCountToAdd);
        await CommentService.clearOld();
        expect(await commentRepository.count()).to.be.eq(oldCommentsCount);
    });
});
