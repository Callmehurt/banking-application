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

    app.get('/auth/user/logout', async (req, res, next) => {
        try{

            //on client, also delete the access token
            const cookie = req.cookies;

            if(!cookie?.jwt){
                return res.status(500).json({
                    message: 'Invalid token'
                });            
            }

            const refreshToken = cookie.jwt;
            const user = await authService.logoutUser(refreshToken);
            if(!user){
                res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
                return res.status(204).json({
                    message: 'Invalid token'
                });
            }
            res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
            return res.status(200).json({
                message: 'Logout successfull'
            })

        }catch(err){
            return res.status(500).json(err);
        }
    })

}