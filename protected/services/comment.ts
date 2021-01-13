'use strict';

import log from '@component/logger';
import Queue from '@component/queue';
import config from '@config';
import { SocialGroup } from '@entity/SocialGroup';
import { SocialGroupComment } from '@entity/SocialGroupComment';
import { IVKComment, IVKProfile, VK } from '@service/vk';
import * as moment from 'moment';
import { getRepository } from 'typeorm';

export class CommentService {

    static async createOrUpdateComment(comment_data: IVKComment, profiles: IVKProfile[], post_id: string, group: SocialGroup) {
        const commentRepository = getRepository(SocialGroupComment);

        let comment = await this.getCommentByCommentIDAndPostID(comment_data.id.toString(), post_id);
        if (!comment) {
            comment = new SocialGroupComment();
            comment.comment_id = comment_data.id.toString();
            comment.post_id = post_id;
        }
        comment.group = group;
        comment.comment_text = comment_data.text;
        comment.likes = comment_data.likes.count;
        comment.date = moment.unix(comment_data.date).toDate();
        for (const profile of profiles) {
            if (profile.id === comment_data.from_id) {
                comment.user_social_id = profile.id.toString();
                comment.user_first_name = profile.first_name;
                comment.user_last_name = profile.last_name;
                comment.user_photo = profile.photo_max;
                break;
            }
        }
        try {
            await commentRepository.save(comment);
        } catch (error) {
            if (error.code !== 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                log.error(error);
            }
        }
    }

    static async getCommentByCommentIDAndPostID(comment_id: string, post_id: string) {
        const commentRepository = getRepository(SocialGroupComment);
        return await commentRepository.findOne({
            post_id,
            comment_id,
        });
    }

    static async getWidgetsCachedData(widgets: any[], group: SocialGroup): Promise<any[]> {
        const data: any = {};
        for (const widget of widgets) {
            if (widget.isShown) {
                switch (widget.name) {
                    case 'commentatorLikes':
                        data.commentatorLikes = await this.getDataByLikes(group, widget);
                        break;
                    case 'commentatorDay':
                        data.commentatorDay = await this.getDayCommentData(group, widget);
                        break;
                }
            }
        }
        return data;
    }

    static async getDataByLikes(group: SocialGroup, widget) {
        const commentRepository = getRepository(SocialGroupComment);
        const comment_query = commentRepository.createQueryBuilder('comment')
            .where('comment.groupId = :groupId', {
                groupId: group.id
            })
            .andWhere('comment.date >= :date', {
                date: moment().subtract(widget.period, 'days').format('YYYY-MM-DD HH:mm:ss')
            })
            .andWhere('comment.likes >= :likes', {
                likes: widget.minLikes
            })
            .orderBy('comment.likes', 'DESC')
            .addOrderBy('comment.date', 'DESC');

        const comment: SocialGroupComment = await comment_query.getOne();

        if (comment) {
            // log.debug('Commentator likes:', JSON.stringify(comment));
            return {
                first_name: comment.user_first_name,
                last_name: comment.user_last_name,
                photo_max: comment.user_photo,
                likes: comment.likes
            };
        }

        return null;
    }

    static async getLastCommentData(group: SocialGroup, widget) {
        const commentRepository = getRepository(SocialGroupComment);
        const comment_query = commentRepository.createQueryBuilder('comment')
            .where('comment.groupId = :groupId', {
                groupId: group.id
            })
            .orderBy('comment.date', 'DESC')
            .addOrderBy('comment.likes', 'DESC');

        const comment: SocialGroupComment = await comment_query.getOne();

        if (comment) {
            return {
                first_name: comment.user_first_name,
                last_name: comment.user_last_name,
                photo_max: comment.user_photo,
                likes: comment.likes
            };
        }
        return null;
    }

    static async getDayCommentData(group: SocialGroup, widget) {
        const commentRepository = getRepository(SocialGroupComment);
        const comment_data_query = commentRepository.createQueryBuilder('comment')
            .select([
                'comment.user_social_id AS user_social_id',
                'COUNT(comment.user_social_id) AS comments_count',
                'SUM(comment.likes) AS likes_sum'
            ])
            .where('comment.groupId = :groupId', {
                groupId: group.id
            })
            .andWhere('comment.date >= :date', {
                date: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
            })
            .andWhere('comment.likes >= :likes', {
                likes: widget.minLikes
            })
            .groupBy('comment.user_social_id')
            .orderBy('comments_count', 'DESC')
            .addOrderBy('likes_sum', 'DESC');

        const comment_data = await comment_data_query.getRawOne();

        if (comment_data) {
            const user_id = comment_data.user_social_id;

            const comment_query = commentRepository.createQueryBuilder('comment')
                .where('comment.user_social_id = :user_social_id', {
                    user_social_id: user_id
                })
                .orderBy('comment.likes', 'DESC');

            const comment: SocialGroupComment = await comment_query.getOne();

            if (comment) {
                return {
                    first_name: comment.user_first_name,
                    last_name: comment.user_last_name,
                    photo_max: comment.user_photo,
                    likes: comment.likes,
                    comments_count: comment_data.comments_count
                };
            }
        }

        return null;
    }

    static async clearOld() {
        const commentRepository = getRepository(SocialGroupComment);
        await commentRepository.createQueryBuilder('social_group_comment')
            .delete()
            .where('social_group_comment.date <= :date', {
                date: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')
            })
            .execute();
        return true;
    }
}
