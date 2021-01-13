'use strict';

import { SocialGroup } from '@entity/SocialGroup';
import { SocialGroupLike } from '@entity/SocialGroupLike';
import { IVkUser, VK } from '@service/vk';
import * as moment from 'moment';
import { getRepository } from 'typeorm';

export class LikeService {

    static async createOrUpdateLikeByVkUserId(postId: string, vkUserId: number, group: SocialGroup) {
        const likeRepository = getRepository(SocialGroupLike);
        let like = await likeRepository.findOne({
            where: {
                post_id: postId,
                user_social_id: vkUserId.toString(),
                group: group.id
            }
        });
        if (!like) {
            like = new SocialGroupLike();
            like.group = group;
            like.post_id = postId;
            like.user_social_id = vkUserId.toString();

            const user_data = await VK.getUserInfoById(vkUserId, group.access_token);
            if (!user_data) {
                return;
            }
            like.user_first_name = user_data.first_name;
            like.user_last_name = user_data.last_name;
            like.user_photo = user_data.photo_max;
            likeRepository.save(like);
        }
    }

    static async getWidgetsCachedData(widgets: any[], group: SocialGroup): Promise<any[]> {
        const data: any = {};
        for (const widget of widgets) {
            if (widget.isShown) {
                switch (widget.name) {
                    case 'likerDay':
                        data.likerDay = await this.getDayLikeData(group, widget);
                        break;
                }
            }
        }
        return data;
    }

    static async getDayLikeData(group: SocialGroup, widget) {
        const likeRepository = getRepository(SocialGroupLike);
        const likeDataQuery = likeRepository.createQueryBuilder('like')
            .select([
                'like.user_social_id AS user_social_id',
                'COUNT(like.user_social_id) AS likes_count'
            ])
            .where('like.groupId = :groupId', {
                groupId: group.id
            })
            .andWhere('like.create_date >= :date', {
                date: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
            })
            .groupBy('like.user_social_id')
            .orderBy('likes_count', 'DESC')
            .having('likes_count >= :likes_count', {
                likes_count: widget.minLikes
            });

        const likeData = await likeDataQuery.getRawOne();

        if (likeData) {
            const userId = likeData.user_social_id;

            const likeQuery = likeRepository.createQueryBuilder('like')
                .where('like.user_social_id = :user_social_id', {
                    user_social_id: userId
                });

            const like: SocialGroupLike = await likeQuery.getOne();

            if (like) {
                return {
                    first_name: like.user_first_name,
                    last_name: like.user_last_name,
                    photo_max: like.user_photo,
                    likes_count: likeData.likes_count
                };
            }
        }

        return null;
    }

    static async clearOld() {
        const likeRepository = getRepository(SocialGroupLike);
        await likeRepository.createQueryBuilder('social_group_like')
            .delete()
            .where('social_group_like.create_date <= :date', {
                date: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')
            })
            .execute();
        return true;
    }
}
