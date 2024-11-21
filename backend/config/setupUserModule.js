import { UserRepository } from '../infrastructure/repositories/userRepository.js';
import { UserController } from '../controllers/userController.js';
import { createUserRouter } from '../routes/userRoutes.js';
import { UserService } from '../domain/services/userService.js';


export function setupUserModule(models) {
    const userRepository = new UserRepository(models);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    const userRouter = createUserRouter(userController);

    return {
        repository: userRepository,
        service: userService,
        controller: userController,
        router: userRouter,
    };
}
