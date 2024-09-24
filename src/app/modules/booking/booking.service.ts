import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Slot } from '../slots/slot.model';
import { TBooking } from './booking.interface';
import { Booking, BookingStatus } from './booking.model';
import { Room } from '../room/room.model';
import { User } from '../user/user.model';

import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { initiatePayment } from '../payment/payment.utils';
import { TUser } from '../user/user.interface';





/////
// export const createBookingFromSlot = async (payload:TBooking) => {
//   const { room, slots, user, date, promoCode } = payload;

//   // Validate required fields
//   if (!room || !slots || !user || !date) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'All fields are required');
//   }

//   // Check if slots exist for the given date
//   const isDateExists = await Slot.exists({ date, room });
//   if (!isDateExists) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       'No slots found for the given date',
//     );
//   }

//   // Validate slots
//   for (const slotId of slots) {
//     const slot = await Slot.findById(slotId);
//     if (!slot || slot.isDeleted || slot.isBooked) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         `Slot ${slotId} is not available`,
//       );
//     }
//   }

//   // Check if room exists and is not deleted
//   const roomInfo = await Room.findById(room);
//   if (!roomInfo || roomInfo.isDeleted) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Room not found or is deleted');
//   }

//   // Check if the room is already booked for the given date
//   const isRoomAlreadyBooked = await Slot.findOne({
//     room,
//     date,
//     slots,
//     isBooked: true,
//   });

//   if (isRoomAlreadyBooked) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'Room is already booked for the given date',
//     );
//   }

//   // Check if user exists
//   const userInfo = await User.findById(user);
//   if (!userInfo) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   // Calculate total amount and apply promo code discount if applicable
//   let totalAmount = slots.length * roomInfo.pricePerSlot;
//   let discountAmount = 0;

//   if (promoCode) {
//     if (promoCode === 'FIRST10') {
//       discountAmount = totalAmount * 0.1; // 10% discount
//     }
//   }

//   totalAmount -= discountAmount; // Apply discount to total amount

//   // Create the booking
//   const createdBooking = await Booking.create({
//     date,
//     slots,
//     room,
//     user,
//     totalAmount,
//     promoCode: promoCode || null,
//     discountAmount,
//     isConfirmed: BookingStatus.unconfirmed,
//   });

//   // Integrate payment, ensure it's handled properly
//   await initiatePayment(); // Ensure this is an async function that returns a promise

//   return await Booking.findById(createdBooking._id)
//     .populate('room')
//     .populate('slots')
//     .populate('user');
// };


////

// const getAllBookingsFromDB = async () => {
//  return await Booking.find()
//     .populate('room')
//     .populate('slots')
//     .populate('user');
  
// };
export const createBookingFromSlot = async (payload: TBooking) => {
  const { room, slots, user: userId, date, promoCode } = payload;

  // Validate required fields
  if (!room || !slots || !userId || !date) {
    throw new AppError(httpStatus.BAD_REQUEST, 'All fields are required');
  }

  // Check if the room exists and is not deleted
  const roomInfo = await Room.findById(room);
  if (!roomInfo || roomInfo.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found or is deleted');
  }

  // Check if slots exist for the given date
  const isDateExists = await Slot.exists({ date, room });
  if (!isDateExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No slots found for the given date',
    );
  }

  // Validate slots and check for availability
  const unavailableSlots: string[] = [];
  for (const slotId of slots) {
    const slot = await Slot.findById(slotId);
    if (!slot || slot.isDeleted || slot.isBooked) {
      unavailableSlots.push(slotId);
    }
  }

  if (unavailableSlots.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Slots ${unavailableSlots.join(', ')} are not available`,
    );
  }

  // Check if user has an existing booking for the same room on the same date
  const existingUserBooking = await Booking.findOne({
    user: userId,
    room,
    date,
  });
  if (existingUserBooking) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User already has a booking for this room on the selected date.`,
    );
  }

  // Fetch user data
  const userInfo = (await User.findById(userId)) as TUser; // Cast to TUser interface
  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Calculate total amount and apply promo code discount if applicable
  let totalAmount = slots.length * roomInfo.pricePerSlot;
  let discountAmount = 0;

  if (promoCode) {
    if (promoCode === 'FIRST10') {
      discountAmount = totalAmount * 0.1; // 10% discount
    }
  }

  totalAmount -= discountAmount; // Apply discount to total amount

  // Generate a transaction ID
  const generateTransactionId = () => {
    const date = new Date();
    const timestamp = date.getTime(); // Get the current timestamp
    return `TXN-${timestamp}`;
  };
  const transactionId = generateTransactionId();

  // Create the booking
  const createdBooking = await Booking.create({
    date,
    slots,
    room,
    user: userId, // Store the ObjectId reference
    totalAmount,
    promoCode: promoCode || null,
    discountAmount,
    isConfirmed: BookingStatus.unconfirmed,
    transactionId,
  });

  // Prepare payment data including user information
  const paymentData = {
    transactionId,
    totalAmount,
    customerName: userInfo.name,
    customerEmail: userInfo.email,
    customerPhone: userInfo.phone,
    customerAddress: userInfo.address,
  };

  // Integrate payment, ensure it's handled properly
  const paymentSession = await initiatePayment(paymentData);
  console.log(paymentSession);

  // Optionally populate the created booking and return it with payment session
  const populatedBooking = await Booking.findById(createdBooking._id)
    .populate('room')
    .populate('slots')
    .populate('user');

  return {
    booking: populatedBooking, // Return the populated booking
    paymentSession, // Return the payment session
  };
};

const getAllBookingsFromDB = async () => {
  try {
    const bookings = await Booking.find({ isDeleted: false })
      .populate('room')
      .populate({
        path: 'user',
        select: '-password -__v',
      })
      .exec();

    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const detailedSlots = await Promise.all(
            booking.slots.map((slotId) => Slot.findById(slotId).exec()),
          );
          return {
            ...booking.toObject(),
            slots: detailedSlots,
          };
        } catch (error) {
          console.error(
            `Error populating slots for booking ${booking._id}:`,
            error,
          );
          return booking.toObject(); // Return booking without slots if error occurs
        }
      }),
    );

    return populatedBookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

const getMyBookingsFromDB = async(payload:JwtPayload) => {
  try {
   
    if (!payload || typeof payload !== 'object' || !payload.userEmail) {
     
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token payload');
    }

   

    const userExist = await User.findOne({ email: payload.userEmail });
   

    if (!userExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'No Bookings Found for this user ');
    }

    const bookings = await Booking.find({ user: userExist._id })
      .populate('room')
      .populate({
        path: 'slots',
        select: '-__v', // You can exclude other fields as needed
      })
      .select('-user -__v')
      .exec();


    if (!bookings || bookings.length === 0) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'No bookings found for this user',
      );
    }

   
    return bookings;
  } catch (error) {
  
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while fetching bookings');
  }
};
const updateSingleBookingFromDB = async (id: string) => {
  const isBookingExist = await Booking.findById(id);

  if (!isBookingExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  // Checking if the booking is deleted
  const isDeletedBooking = isBookingExist?.isDeleted;

  if (isDeletedBooking) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Booking is already deleted');
  }

  // Determine the new status based on the current status
  let newStatus: BookingStatus;

  if (isBookingExist.isConfirmed === BookingStatus.unconfirmed) {
    // Example logic to determine new status; adjust as needed
    newStatus = BookingStatus.confirmed; // Default to confirmed, adjust logic if needed
  } else if (isBookingExist.isConfirmed === BookingStatus.confirmed) {
    newStatus = BookingStatus.canceled; // Example logic, can also be set by other conditions
  } else {
    newStatus = isBookingExist.isConfirmed; // Retain current status if no update needed
  }

  const result = await Booking.findByIdAndUpdate(
    id,
    { isConfirmed: newStatus },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  // Update slots to set isBooked to true if confirmed
  if (newStatus === BookingStatus.confirmed) {
    await Promise.all(
      result.slots.map(async (slotId: ObjectId) => {
        // Use ObjectId here
        await Slot.findByIdAndUpdate(slotId, { isBooked: true }, { new: true });
      }),
    );
  }

  return result;
};

// Function to validate ObjectId
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

const deleteBookingFromDB = async (id: string) => {
  // Validate the ID
  if (!isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid booking ID');
  }

  const isBookingExist = await Booking.findById(id);

  if (!isBookingExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  if (isBookingExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Booking is already deleted');
  }

  const result = await Booking.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    }
  );
  
  return result;
};

export const BookingServices = {
  createBookingFromSlot,
  getAllBookingsFromDB,
  getMyBookingsFromDB,
  updateSingleBookingFromDB,
  deleteBookingFromDB,
};
