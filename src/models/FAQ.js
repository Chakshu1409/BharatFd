const mongoose = require('mongoose');
const FAQSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true, // Will store HTML content from WYSIWYG
    },
    // Translated fields
    question_hi: { type: String , default: ""},
    answer_hi: { type: String ,default: ""},
    question_bn: { type: String ,default: ""},
    answer_bn: { type: String , default: ""},
    // Add more languages as needed...
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
// A model method to get translated question/answer dynamically
FAQSchema.methods.getTranslatedContent = function (lang) {
    // e.g., for Hindi (hi) or Bengali (bn), fallback to English if not found
    const fallbackQuestion = this.question;
    const fallbackAnswer = this.answer;

    const questionKey = `question_${lang}`;
    const answerKey = `answer_${lang}`;
    const questionTranslated = this[questionKey] ?
        this[questionKey] : fallbackQuestion;
    const answerTranslated = this[answerKey] ?
        this[answerKey] : fallbackAnswer;
    return { questionTranslated, answerTranslated };
};
module.exports = mongoose.model('FAQ', FAQSchema)