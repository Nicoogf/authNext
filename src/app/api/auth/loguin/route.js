import { connectMongoDB } from "@/app/libs/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        await connectMongoDB();

        const body = await request.json()
    }
    catch{

 }
}