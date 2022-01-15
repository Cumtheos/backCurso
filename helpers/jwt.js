const jwt = require('jsonwebtoken');


const generarJWT = (uid, name) => {
    //paiload -> información que va a guardar
    const payload = { uid, name };
    console.log(payload);
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_JTW_SEED, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject();

            } else {
                resolve(token);
            }

        });

    });


}

module.exports = {
    generarJWT
}