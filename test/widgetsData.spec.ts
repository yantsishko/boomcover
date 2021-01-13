import DB from '@db';
import { SocialGroup } from '@entity/SocialGroup';
import { CommentService } from '@service/comment';
import { LikeService } from '@service/like';
import { RepostService } from '@service/reposts';
import { expect } from 'chai';
import { getRepository } from 'typeorm';

describe('Widget Data', () => {
    it('CommentatorDay', async () => {
        const groupRepository = getRepository(SocialGroup);
        const group = await groupRepository.findOneById(1);
        const result = await CommentService.getDayCommentData(group, {minLikes: 0});
        expect(result).to.be.deep.eq({
            first_name: 'Test 1',
            last_name: 'Test 1',
            photo_max: 'https://vk.com/images/camera_200.png',
            likes: 324,
            comments_count: 7
        });
    });
    it('LastComment', async () => {
        const groupRepository = getRepository(SocialGroup);
        const group = await groupRepository.findOneById(1);
        const result = await CommentService.getLastCommentData(group, {});
        expect(result).to.be.deep.eq({
            first_name: 'Test 1',
            last_name: 'Test 1',
            photo_max: 'https://vk.com/images/camera_200.png',
            likes: 72
        });
    });
    it('LikesComment', async () => {
        const groupRepository = getRepository(SocialGroup);
        const group = await groupRepository.findOneById(1);
        const result = await CommentService.getDataByLikes(group, {period: 1, minLikes: 0});
        expect(result).to.be.deep.eq({
            first_name: 'Test 4',
            last_name: 'Test 4',
            photo_max: 'https://vk.com/images/camera_200.png',
            likes: 333
        });
    });
    it('LastRepost', async () => {
        const groupRepository = getRepository(SocialGroup);
        const group = await groupRepository.findOneById(1);
        const result = await RepostService.getLastRepostData(group, {});
        expect(result).to.be.deep.eq({
            first_name: 'Test 1',
            last_name: 'Test 1',
            photo_max: 'https://vk.com/images/camera_200.png'
        });
    });
    it('DayRepost', async () => {
        const groupRepository = getRepository(SocialGroup);
        const group = await groupRepository.findOneById(1);
        const result = await RepostService.getDayRepostData(group, {minReposts: 0});
        expect(result).to.be.deep.eq({
            first_name: 'Test 1',
            last_name: 'Test 1',
            photo_max: 'https://vk.com/images/camera_200.png',
            reposts_count: 6
        });
    });
    it('DayLike', async () => {
        const groupRepository = getRepository(SocialGroup);
        const group = await groupRepository.findOneById(1);
        const result = await LikeService.getDayLikeData(group, {minLikes: 0});
        expect(result).to.be.deep.eq({
            first_name: 'Test 1',
            last_name: 'Test 1',
            photo_max: 'https://vk.com/images/camera_200.png',
            likes_count: 4
        });
    });
});
