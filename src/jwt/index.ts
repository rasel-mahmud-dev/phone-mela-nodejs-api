import jwt from 'jsonwebtoken'

export const createToken = (_id, role, expiresIn?: string)=> {
  return jwt.sign({
      _id: _id,
      role: role,
    },
    process.env.SECRET_KEY, {expiresIn: expiresIn ? expiresIn : '5h'}
  )
}


export const parseToken = (token)=> {
  return new Promise<{_id: string, role: string}>(async (resolve, reject)=>{
    try {
      if(token) {
        let d = await jwt.verify(token, process.env.SECRET_KEY)
        resolve(d)
      } else {
        reject(new Error("Token not found"))
      }
    } catch (ex){
      reject(ex)
    }
  })
}

export const getToken = (req)=> {
  return req.headers["token"]
}
