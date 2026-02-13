import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  email: { // <--- ADD THIS FIELD
    type: String,
    required: true
  },
  sessionId: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '7d' // This auto-deletes the session after 7 days
  }
});

// IMPORTANT: This export style is required for Next.js
const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);
export default Session;