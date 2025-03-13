import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ClassServices } from "./class.service";

const createClass = catchAsync(async (req, res) => {
    const result = await ClassServices.createClassIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Class created successfully",
        data: result,
      });
});

export const ClassControllers = {
    createClass
}
