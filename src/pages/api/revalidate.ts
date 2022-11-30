import AuthService from "../../services/AuthService";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send({message: 'Only POST requests allowed'})
        return
    }
    const {id} = req.body
    if (!id) {
        res.status(400).send({message: 'Missing id'})
        return
    }
    // Get the Authorization header
    const auth = req.headers.authorization
    if (!auth) {
        res.status(401).send({message: 'Missing Authorization header'})
        return
    }
    // get bearer token
    const token = auth.split(' ')[1]
    // Check if the Authorization header is valid
    const tokenCheckRes = await AuthService.checkToken(token);
    const a = tokenCheckRes.data.success;
    if (!a) {
        res.status(401).send({message: 'Unauthorized'})
        return
    }
    let idStr = id.toString()
    if (!idStr.startsWith('/')) {
        idStr = '/' + idStr
    }
    idStr = '/blog' + idStr
    console.log('Revalidating', idStr)
    await res.revalidate(idStr)
    return res.json({success: true})
}
