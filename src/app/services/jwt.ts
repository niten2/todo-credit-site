import * as jsonwebtoken from 'jsonwebtoken'
import settings from 'config/settings'

// interface verifyJwtType {
//   user_id: string
//   email: string
// }


export const createJwt = (user: any): any => {
  if (!settings.jwt_secret_key) {
    throw new Error('Jwt Secret Key should be present')
  }

  return jsonwebtoken.sign(
    {
      user_id: user.id,
      email: user.email,
    },
    settings.jwt_secret_key,
    {
      expiresIn: 10000000000
    }
  )
}

// export const verifyJwt = (token: string): verifyJwtType => {
//   return jsonwebtoken.verify(token, settings.jwt_secret_key, {})
// }


export const verifyJwt = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, settings.jwt_secret_key, {}, (err, data) => {
      if (err !== null) {
        return reject(err)
      }

      resolve(data)
    })
  })

   // getStuff(param,function(err,data){
   //       });



  // console.log()
  // new Promise(jsonwebtoken.verify(token, settings.jwt_secret_key, {})
}
