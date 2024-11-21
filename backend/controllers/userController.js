export class UserController {
    constructor(orderService) {
        this.service = orderService;
    }

    async getUserById(req, res, next) {
        try {
            const userId = req.params.id;

            const user = await this.service.getUserById(userId);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}