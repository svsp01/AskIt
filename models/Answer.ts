import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Answer = mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);
export default Answer;