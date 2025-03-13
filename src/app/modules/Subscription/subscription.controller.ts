import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { SubscriptionServices } from "./subscription.service";

const createSubscription = catchAsync(async (req, res) => {
    console.log("Users===>",req.user);
    
  const result = await SubscriptionServices.createSubscriptionIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Subscription created successfully",
    data: result
  });
});

export const SubscriptionControllers = {
  createSubscription,
};
