const AuthService = require('../services/auth-service');

module.exports = (app) => {
    const authService = new AuthService();

    app.post('/auth/user/signin', async (req, res, next) => {
        try{

            const data = await authService.staffSignin(req.body);
            if(!data){
                return res.status(401).json({
                    error: true,
                    message: "Invalid credentials"
                })
            }
            res.cookie('jwt', data.refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
            return res.json(data);


        }catch(err){
            return res.json(err).status(500);
        }
    })


    app.get('/auth/user/refresh-token', async (req, res, next) => {
        try{
            const cookie = req.cookies;
            if(!cookie?.jwt){
                return res.status(401).json({
                    message: 'Unauthorized'
                })
            }
            const refreshToken = cookie.jwt;
            const data = await authService.staffRefreshToken(refreshToken);
            return res.json(data);
        }catch(err){
            return res.status(500).json(err);
        }
    })

}