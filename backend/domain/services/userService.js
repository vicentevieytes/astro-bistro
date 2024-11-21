export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getUserById(userId) {
        return await this.userRepository.findById(userId);
    }
}