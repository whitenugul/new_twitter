import jwt from 'jsonwebtoken'
import * as userRepository from '../data/auth.js'
import { config } from '../config.js'
const AUTH_ERROR = { message: `인증 에러!` };
export const isAuth = async (req, res, next) => {
    // 포스트맨에 겟방식으로 ? 로 이런 토큰을 가지고 있다고 계속 전송해서 만료되지 않으면 로그가 바디에 지저분하게 남는다, 그래서 헤더에 담아서 보냄
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
    // 포스트맨에 key 에는 Authorization, value엔 Bearer 토큰값 을 넣어서 사용
    const authHeader = req.get('Authorization')
    if (!(authHeader && authHeader.startsWith('Bearer '))) {
        return res.status(401).json(AUTH_ERROR);
    }
    const token = authHeader.split(' ')[1];
    console.log(token)
    jwt.verify(
        token,
        config.jwt.secretKey,
        async (error, decode) => {
            if (error) {
                res.status(401).json(AUTH_ERROR)
            }
            console.log(decode)
            const user = await userRepository.findById(decode.id)
            console.log(user)
            if (!user) {
                res.status(401).json(AUTH_ERROR)
            }
            req.userId = user.id;
            next();
        }
    )
}