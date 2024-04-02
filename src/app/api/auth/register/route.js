import { connectMongoDB } from "@/app/libs/mongodb";
import User from "@/app/models/User";
import { isValidEmail } from "@/utils/ifValidEmail";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request) {
    try {
        await connectMongoDB()
        const body =  await request.json()
        const {email , password ,confirmPassword } = body 

        //validacion de todos los campos
        if( !email || !password || !confirmPassword){
            return NextResponse.json({
                message : messages.error.needProps
            },{
                status : 400
            })
        }

        //validacion si es email
        if( !isValidEmail(email)){
            return NextResponse.json({
                message : messages.error.emailNotValid
            },{
                status:400
            })
        }
        //Validacion de contraseñas
        if( password !== confirmPassword){
            return NextResponse.json({
                message : messages.error.passwordsNotMatch 
            })
        }

        const userFind = await User.findOne({email})

        if(userFind){
            return NextResponse.json({
                message : messages.error.emailExist
            },{
                status:200
            })
        }

        const hashedPssword = await bcrypt.hash(password ,12)
        const newUser = new User({
            email,
            password:hashedPssword
        })

        const{password:userPass, ...rest} = newUser._doc
        await newUser.save()
        const token = jwt.sign({data: rest} , 'secreto',{
            expiresIn:86400
        })

        const response = NextResponse.json({
            newUser: rest,
            message: messages.succes.userCreated
        },{
            status:200
        })

        response.cookies.set("auth_cookie", token ,{
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400,
            path:"/"

        })
         return response
    } catch (error) {
        return NextResponse.json(
            { message : messages.error.errorDefault , error},
            {status: 500}
        )
    }
}