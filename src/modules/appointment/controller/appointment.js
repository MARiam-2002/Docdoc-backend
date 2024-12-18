import AppointmentModel from "../../../../DB/models/Appointment .model.js";
import paymentModel from "../../../../DB/models/payment.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import moment from "moment";

async function processCreditCardPayment(amount, currency, cardInfo) {
  return {
    status: "success",
    message: "Payment processCreditCardPayment successfully",
    data: { status: "success", transactionId: "123ABC", amount, currency },
    code: 200,
  };
}

async function processBankTransfer(amount, currency, bankDetails) {
  return {
    status: "success",
    message: "Payment processBankTransfer successfully",
    data: { status: "pending", transactionId: "456DEF", amount, currency },
    code: 200,
  };
}

async function processPayPalPayment(amount, currency, paypalInfo) {
  return {
    status: "success",
    message: "Payment processPayPalPayment successfully",
    data: { status: "completed", transactionId: "789GHI", amount, currency },
    code: 200,
  };
}

export const bookAppointment = asyncHandler(async (req, res) => {
  const { date, time, type, doctorId } = req.body;
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({
      message: "Doctor not found",
      status: false,
      code: 404,
      data: [],
    });
  }
  const parsedDate = moment(date, "ddd DD", true);

  if (
    !parsedDate.isValid() ||
    parsedDate.date() !== parseInt(date.split(" ")[1], 10)
  ) {
    return res.status(400).json({
      message:
        "Invalid date format. Please check day of week and day of month.",
      status: false,
    });
  }

  // Set the year and month to the current month and year
  parsedDate.year(new Date().getFullYear());
  parsedDate.month(new Date().getMonth());

  // Check if the parsed day of the week matches the input
  if (parsedDate.format("ddd") !== date.split(" ")[0]) {
    return res.status(400).json({
      message:
        "Invalid date format. Please check day of week and day of month.",
      status: false,
      code: 404,
      data: [],
    });
  }

  const appointment = new AppointmentModel({
    date: parsedDate.toDate(),
    time,
    type,
    doctor: doctorId,
    user: req.user._id,
  });

  await appointment.save();

  return res.status(201).json({
    message: "Appointment booked successfully",
    status: true,
    code: 201,
    data: appointment,
  });
});

export const confirmAppointment = asyncHandler(async (req, res) => {
  const { appointmentId, paymentId } = req.body;
  const appointment = await AppointmentModel.findByIdAndUpdate(
    appointmentId,
    { payment: paymentId },
    { new: true }
  );
  res.status(200).json({
    message: "Appointment confirmed",
    status: true,
    code: 200,
    data: appointment,
  });
});

export const handlePayment = asyncHandler(async (req, res) => {
  const { amount, currency, paymentMethod, cardInfo, bankDetails, paypalInfo } =
    req.body;

  if (!amount || !currency || !paymentMethod) {
    return res.status(400).json({
      status: "false",
      message: "Payment details are incomplete.",
      code: 400,
      data: [],
    });
  }

  let paymentResponse;

  switch (paymentMethod) {
    case "credit_card":
      if (!cardInfo || !cardInfo.number || !cardInfo.expiry || !cardInfo.cvc) {
        return res.status(400).json({
          status: "false",
          message: "Credit card details are incomplete.",
          code: 400,
        });
      }
      paymentResponse = await processCreditCardPayment(
        amount,
        currency,
        cardInfo
      );
      break;

    case "bank_transfer":
      if (!bankDetails || !bankDetails.accountNumber || !bankDetails.bankName) {
        return res.status(400).json({
          status: "false",
          message: "Bank transfer details are incomplete.",
          code,
        });
      }
      paymentResponse = await processBankTransfer(
        amount,
        currency,
        bankDetails
      );
      break;

    case "paypal":
      if (!paypalInfo || !paypalInfo.email) {
        return res.status(400).json({
          status: "false",
          message: "PayPal details are incomplete.",
          code: 400,
        });
      }
      paymentResponse = await processPayPalPayment(
        amount,
        currency,
        paypalInfo
      );
      break;

    default:
      return res.status(400).json({
        message: "Invalid payment method.",
        status: false,
        code: 404,
        data: [],
      });
  }

  res.status(200).json({
    status: "true",
    message: paymentResponse.message,
    code: 200,
    data: paymentResponse.data,
  });
});
