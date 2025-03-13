
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

const generateToken = (payload: any, secret: Secret, expiresIn: any) => {

    // const token = jwt.sign(payload, secret, options);
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn, algorithm: 'HS256', });

    return token;
};



const verifyToken = (token: string, secret: Secret) => {
    console.log("Verifying token", token, secret);
    
    return jwt.verify(token, secret) as JwtPayload;
}

export const jwtHelpers = {
    generateToken,
    verifyToken
}


