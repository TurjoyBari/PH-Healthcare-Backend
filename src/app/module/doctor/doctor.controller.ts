import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { ApplyAsDoctorValidationZodSchema } from "./doctor.validation";
import { DoctorServices } from "./doctor.service";

const applyAsDoctor = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  console.log({ files });
  const resume = files?.["resume"] ? files["resume"][0] : null;
  const additionalFiles = files?.["additionalFiles"] || [];

  let rawPayload;
  if (req.body.data) {
    try {
      rawPayload = JSON.parse(req.body.data);
    } catch (parseError) {
      throw new Error("Invalid JSON format inside form-data 'data' field");
    }
  } else {
    rawPayload = req.body;
  }

  const zodValidationResult =
    ApplyAsDoctorValidationZodSchema.safeParse(rawPayload);

  if (!zodValidationResult.success) {
    // This extracts the exact field path (e.g., "user.email" or "doctor.designation")
    const missingFieldPath = zodValidationResult.error.issues[0].path.join(".");
    const errorMessage = zodValidationResult.error.issues[0].message;

    throw new Error(
      `Validation failed on [${missingFieldPath}]: ${errorMessage}`,
    );
  }

  const payload = zodValidationResult.data;

  const result = await DoctorServices.applyAsDoctor(
    payload,
    resume,
    additionalFiles,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Applied As Doctor Successfuly",
    data: result,
  });
});

export const DoctorController = {
  applyAsDoctor,
};
