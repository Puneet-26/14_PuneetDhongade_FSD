/**
 * Mongoose BusPass Schema
 * Course Outcome: CO6 (Full-Stack Database Persistence)
 * Student: Puneet Dhongade | Roll No: 14
 */

const mongoose = require('mongoose');

const busPassSchema = new mongoose.Schema(
  {
    passId: {
      type: String,
      required: [true, 'Pass ID is required'],
      unique: true,
      trim: true,
      index: true
    },
    passengerName: {
      type: String,
      required: [true, 'Passenger name is required'],
      trim: true,
      minlength: [3, 'Passenger name must be at least 3 characters long']
    },
    route: {
      type: String,
      required: [true, 'Bus route description is required'],
      trim: true
    },
    passType: {
      type: String,
      required: true,
      enum: {
        values: ['Student', 'Monthly', 'Senior Citizen', 'General'],
        message: '{VALUE} is not a valid pass category'
      },
      default: 'Monthly'
    },
    validityDays: {
      type: Number,
      required: [true, 'Validity days is required'],
      min: [1, 'Validity must be at least 1 day'],
      default: 30
    },
    price: {
      type: Number,
      required: [true, 'Pass price/fare is required'],
      min: [0, 'Price cannot be negative']
    },
    issueDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: [true, 'Pass expiry date is required']
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Suspended'],
      default: 'Active'
    },
    issuedBy: {
      type: String,
      default: 'BEST Transit Authority'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for checking if pass is currently expired
busPassSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiryDate;
});

module.exports = mongoose.model('BusPass', busPassSchema);

