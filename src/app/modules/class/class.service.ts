import { Class } from "@prisma/client";
import prisma from "../../config/prisma";


const createClassIntoDB = async (payload: Class) => {
    const result  = await prisma.class.create({
        data: payload,
        select: {
            id:true,
            instructor: true,
            title: true,
            type:true,
            capacity: true,
            price: true,
            duration: true,
            endTime: true,
            coverImage: true,
        }
    });
    return result;
};


export const ClassServices = {
    createClassIntoDB
};
