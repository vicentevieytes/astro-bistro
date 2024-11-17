export class User {
    constructor({ user_id, username, created_at }) {
        this.id = user_id;
        this.username = username;
        this.createdAt = created_at;
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            createdAt: this.createdAt
        };
    }
}
