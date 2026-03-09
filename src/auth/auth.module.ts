import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/users.entity";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";
import {AuthService} from "./auth.service";
import {JwtStrategy} from "./jwt.strategy";
import {AuthController} from "./auth.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: () => {
                const expiresIn = '15m';

                return {
                    secret: 'JWT_SECRET',
                    signOptions: {
                        expiresIn: expiresIn as any
                    }
                };
            }
        })
    ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    controllers: [
        AuthController,
    ],
    exports: [
        AuthService,
        JwtModule,
    ],
})
export class AuthModule {}