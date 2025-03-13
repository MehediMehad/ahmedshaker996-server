import { Class } from "@prisma/client";
import prisma from "../../config/prisma";


const createClassIntoDB = async (payload: Class) => {
    const result  = await prisma.class.create({
        data: payload,
    });
    return result;
};


export const ClassServices = {
    createClassIntoDB
};
