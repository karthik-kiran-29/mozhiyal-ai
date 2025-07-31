import { hash } from 'bcrypt';
import { client } from '../config/database';

export async function createUser(req:any, res:any) {
  try {
    const { name, email, password } = req.body;
    
    const hashedPassword = await hash(password, 10);
    
    const response = await client.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword
      }
    });
    
    res.json({ response });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}