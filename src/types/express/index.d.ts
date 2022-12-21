
// to make the file a module and avoid the TypeScript error
export {}

declare global {
    namespace Express {
        export interface Request {
            auth: {
                _id: string,
                role: string
            }
            user?: any // for passport google login
        }
    }
}