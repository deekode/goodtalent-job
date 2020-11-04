/* eslint-disable require-jsdoc */

export default function BookingDb(Booking) {
	const fetchBookingById = bookingId => Booking.findById(bookingId);

	const fetchBooking = (query, options = {}) =>
		Booking.findOne(query, options);

	const createBooking = bookingDetails => Booking.create(bookingDetails);

	const updateBooking = (BookingId, bookingDetails, options = {}) =>
		Booking.findOneAndUpdate(BookingId, bookingDetails, options);

	const updateOrCreate = (query, details, options = {}) =>
		Booking.findOneAndUpdate(query, details, options);

	const countBookings = (query = {}) => Booking.countDocuments(query);

	const fetchBookings = (query, options = {}) =>
		Booking.find(query, {}, options);

	const deleteBooking = query => Booking.delete(query);

	return {
		fetchBookingById,
		fetchBooking,
		countBookings,
		updateOrCreate,
		createBooking,
		updateBooking,
		fetchBookings,
		deleteBooking
	};
}
