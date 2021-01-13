'use strict';

import log from '@component/logger';
import config from '@config';
import { Partner } from '@entity/Partner';
import { Payment } from '@entity/Payment';
import { SocialGroup } from '@entity/SocialGroup';
import { Subscription } from '@entity/Subscription';
import { User } from '@entity/User';
import { GroupService } from '@service/group';
import { IVkGroup, VK, VKState } from '@service/vk';
import * as crypto from 'crypto';
import * as moment from 'moment';
import { getRepository } from 'typeorm';

export interface ISubscriptionData {
    amount: number;
    start_date: Date;
    end_date: Date;
}

export class UserService {

    static async getUserById(user_id: string | number): Promise<User> {
        const userRepository = getRepository(User);
        return await userRepository.findOneById(user_id);
    }

    static async authorizeUser(
        vk_access_token: string,
        vk_user_id: string,
        email?: string,
        state?: VKState
    ): Promise<string> {
        const userRepository = getRepository(User);
        let user = await userRepository.findOne({ vk_id: vk_user_id });
        let isNewUser = false;
        if (!user) {
            user = new User();
            isNewUser = true;
        }

        const token = crypto.randomBytes(16).toString('hex');

        user.vk_id = vk_user_id;
        user.vk_token = vk_access_token;
        user.email = email;
        user.token = token;

        if (!user.img) {
            if (config.isTest) {
                user.img = 'https://vk.com/images/camera_200.png';
                user.firstName = 'Name';
                user.lastName = 'Surname';
            } else {
                const vk_user_response = await VK.getUserInfo(user);
                if (vk_user_response) {
                    user.img = vk_user_response.photo_200;
                    user.firstName = vk_user_response.first_name;
                    user.lastName = vk_user_response.last_name;
                }
            }
        }
        if (state && state.type === 'referral') {
            const refUser = await userRepository.findOne({
                where: {
                    referral_code: state.promocode
                }
            });
            if (refUser) {
                user.referral_parent = Promise.resolve(refUser);
            }
        }

        user = await userRepository.save(user);
        if (isNewUser) {
            let subscribeDays = 5;
            if (state && state.type === 'partner') {
                const partner = await getRepository(Partner).findOne({
                    where: {
                        code: state.code
                    }
                });
                if (partner) {
                    subscribeDays = partner.days_count;
                }
            }
            await this.subscribe(user, 1, subscribeDays);
        }
        return user.token;
    }

    static async logout(user: User): Promise<User> {
        const userRepository = getRepository(User);

        user.token = null;

        user = await userRepository.save(user);
        return user;
    }

    static async updateGroups(user: User, vk_groups: IVkGroup[]): Promise<User> {
        const userRepository = getRepository(User);

        const user_social_groups: SocialGroup[] = [];
        for (const vk_group of vk_groups) {
            let social_group = new SocialGroup();
            for (const user_social_group of await user.social_groups) {
                if (user_social_group.social_id === vk_group.id.toString()) {
                    social_group = user_social_group;
                    break;
                }
            }

            social_group.social_id = vk_group.id.toString();
            social_group.img = vk_group.photo_100;
            social_group.members = vk_group.members_count || 0;
            social_group.title = vk_group.name;
            social_group.user = user;
            social_group.connected = social_group.connected || false;
            social_group.group_type = vk_group.type;
            social_group.is_closed = !!vk_group.is_closed;

            user_social_groups.push(social_group);
        }

        user.social_groups = Promise.resolve(user_social_groups);

        user = await userRepository.save(user);
        return user;
    }

    static async subscribe(user: User, groupsCount: number, daysCount: number) {
        const subscriptionRepository = getRepository(Subscription);
        const now = moment().utcOffset(0).startOf('day');

        const subscription = new Subscription();
        subscription.amount = groupsCount;
        subscription.start_date = now.toDate();
        subscription.end_date = now.add(daysCount, 'days').toDate();
        subscription.user = user;

        await subscriptionRepository.save(subscription);
    }

    static async unconnectUnpayedGroups() {
        const userRepository = getRepository(User);
        const groupRepository = getRepository(SocialGroup);
        const users = await userRepository.find();
        for (const user of users) {
            const availableActiveGroupsCount = await user.availableActiveGroupsCount();
            const currentActiveGroupsCount = await groupRepository.count({
                where: {
                    user: user.id,
                    connected: true
                }
            });
            if (availableActiveGroupsCount < currentActiveGroupsCount) {
                const currentActiveGroups = await groupRepository.createQueryBuilder('group')
                    .where('group.user = :user')
                    .andWhere('group.connected = :connected')
                    .setParameters({
                        user: user.id,
                        connected: true
                    })
                    .orderBy('group.members', 'ASC')
                    .getMany();
                for (let i = availableActiveGroupsCount; i < currentActiveGroupsCount; i++) {
                    try {
                        await GroupService.unconnectGroup(currentActiveGroups[i - availableActiveGroupsCount]);
                    } catch (e) {
                        log.warn(`Error when unconnect group ${currentActiveGroups[i - availableActiveGroupsCount].id}`);
                    }
                }
                if (availableActiveGroupsCount === 0) {
                    await VK.sendMessage(user.vk_id, `Здравствуйте, Ваш период использования сервиса динамических обложек Boomcover закончился. Продлите его по ссылке ${config.site_url}/price`);
                }
            }
        }
    }

    static async sendSubscriptionNotfications() {
        const endDate = moment().utcOffset(0).startOf('day').add(2, 'days');
        const subscriptionsRepository = getRepository(Subscription);
        const subscriptions = await subscriptionsRepository.find({
            where: {
                end_date: endDate.format('YYYY-MM-DD HH:mm:ss')
            }
        });
        for (const subscription of subscriptions) {
            await VK.sendMessage(subscription.user.vk_id, `Здравствуйте, Ваш период использования сервиса динамических обложек Boomcover закончится через 2 дня. Продлите его по ссылке ${config.site_url}/price`);
        }
    }
}
