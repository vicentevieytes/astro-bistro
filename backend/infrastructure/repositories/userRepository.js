import {User} from '../../domain/entities/User.js';

export class UserRepository {
    constructor(models) {
        this.models = models;
    }

    async findById(id) {
        const user = await this.models.User.findByPk(id);
        return user ? new User(user.get({ plain: true })) : null;
    }

}