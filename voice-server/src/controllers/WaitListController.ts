import {client} from '../config/database';

export async function createWaitlist(req:any,res:any){
    try {
        const email = req.body?.email;

        if(!email){
            res.status(204).json({error:"Email Not found in Request"})
        }

        const response = await client.waitList.create({
            data:{
                email
            }
        })

        res.json({ response });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: "Failed to create Wailtlist" });
    }
}