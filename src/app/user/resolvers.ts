  import { GetOmit } from '@prisma/client/runtime/library';
import axios from 'axios'  
import { prismaClient } from '../../clients/db';
import JWTService from '../../services/jwt';
import { GraphqlContext } from '../../interfaces';
  
  interface GoogleTokenResu1t {
    
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?:string; 
    name? :string;
    picture? : string;
    given_name: string;
    family_name?: string;
    iat?:string;
    exp?:string;
    alg?:string;
    jti?:string; 
    kid? :string;
    typ?:string;
    
  }

  const  queries = {
 
  verifyGoogleToken:async(parent: any , {token}:{token: string })=>{
    const googleToken= token;
    const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo")
    googleOauthURL.searchParams.set('id_token',googleToken)

    const {data}= await axios.get<GoogleTokenResu1t>(googleOauthURL.toString(),{

      responseType: "json",
    })

    const user = await prismaClient.user.findUnique({
      where:{email: data.email },
    });

    if(!user){
      await prismaClient.user.create({
        data:{
          email:data.email,
          firstName:data.given_name,
          lastName:data.family_name,
          profileImageURL:data.picture,
        }
      })
    }
     const userInDb = await prismaClient.user.findUnique({where:{email: data.email }})
     if (!userInDb){throw new Error('User email not found')}
     const userToken = JWTService.generateTokenForUser(userInDb)
    return userToken;
  },
 
};

export const resolvers = {queries};