import { connectMongoDB } from "@/app/libs/mongodb";
import User from "@/app/models/User";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs"

export async function POST(request) {
    try{
        await connectMongoDB();

        const body = await request.json()
        const { email , password } = body

        //validacion que no falten datos en el loguin
        if( !email || !password ){
            return NextResponse.json({
                message : messages.error.needProps
            },{
                status : 400
            })
        }

        const userFind = await User.findOne({email})

        //validacion de que el usuario existe
        if(!userFind){
            return NextResponse.json({
                message: messages.error.userNotFound
            })
        }

        const isCorrect = await bcryptjs.compare(
            password,
            userFind.password
        )
        

        if(!isCorrect){
            return NextResponse.json({
                messages: messages.error.incorrectPassword
            })
        }
    }
    catch{

 }
}