import { Subscription } from "@prisma/client";
import prisma from "../../config/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";


const createSubscriptionIntoDB = async (payload: Subscription) => {
    console.log('Payload',payload);
    const subscriptions = await prisma.subscription.findFirst({
        where: {
            plan: payload.plan,
        },
    })
    if(subscriptions) throw new ApiError( httpStatus.CONFLICT ,'Subscription already exists');
    
    const result  = await prisma.subscription.create({
        data: payload,
    });
    return result;
};


export const SubscriptionServices = {
    createSubscriptionIntoDB
};