import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/UserQuiz";
import bcrypt from "bcryptjs";
import { otpStore } from "@/lib/otpMemory";
import Session from "@/models/Session";
import { apiRequest } from '@/lib/api';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { userId, sessionId } = await req.json();
        const { email, otpInput, newPassword } = await req.json();

        const activeSession = await Session.findOne({ userId, sessionId });

        if (!activeSession) {
            // If the session was deleted (from password reset or account delete)
            return NextResponse.json(
                { message: "Logged out from all devices" }, 
                { status: 401 }
            );
        }
        // 1. Check if the OTP exists in our memory store
        const record = otpStore[email];

        if (!record) {
            return NextResponse.json(
                { success: false, message: "Session expired. Please request a new code." },
                { status: 400 }
            );
        }

        // 2. Verify OTP and Expiry
        const isOtpValid = record.otp === otpInput;
        const isNotExpired = Date.now() < record.expires;

        if (!isOtpValid) {
            return NextResponse.json({ success: false, message: "Invalid code" }, { status: 400 });
        }

        if (!isNotExpired) {
            delete otpStore[email]; // Clean up expired data
            return NextResponse.json({ success: false, message: "Code has expired" }, { status: 400 });
        }

        // 3. Update the Database (MongoDB)
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        await Session.deleteMany({ userId: user._id });
        // 4. Cleanup Memory (Crucial: Delete OTP so it can't be reused)
        delete otpStore[email];

        return NextResponse.json({
            success: true,
            message: "Password updated successfully!"
        }, { status: 200 });


    } catch (error) {
        console.error("RESET_ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}