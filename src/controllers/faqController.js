const FAQ = require('../models/FAQ');
const translate = require('google-translate-api');
const redis = require('../config/redis');


// Helper function to translate text into multiple languages
async function translateAllLanguages(text) {
    // Extend this array with the language codes you want
    const languages = ['hi', 'bn'];
    const translations = {};
    for (const lang of languages) {
        try {
            console.log(`Translating to ${lang}:`, text);
            const result = await translate(text, { to: lang });
            console.log(`Translated (${lang}):`, result);
            translations[lang] = result;
        } catch (err) {
            console.error(`Translation failed for lang=${lang}:`,err);
            translations[lang] = ''; // or fallback to original
        }
    }
    return translations;
}
// CREATE FAQ
exports.createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;

        // Ensure translation function is working
        console.log("Original Question:", question);
        console.log("Original Answer:", answer);

        // Translate question & answer
        const questionTranslations = await translateAllLanguages(question);
        const answerTranslations = await translateAllLanguages(answer);

        console.log("Question Translations:", questionTranslations);
        console.log("Answer Translations:", answerTranslations);

        const faq = new FAQ({
            question,
            answer,
            question_hi: questionTranslations.hi,
            answer_hi: answerTranslations.hi,
            question_bn: questionTranslations.bn,
            answer_bn: answerTranslations.bn
        });
        const savedFAQ = await faq.save();
        // Clear cache for FAQ list if needed
        await redis.del('faqs');
        return res.status(201).json({
            message: 'FAQ created successfully',
            data: savedFAQ,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllFAQs = async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        console.log(lang);
        // Check Redis cache first
        const cacheKey = `faqs?lang=${lang}`;
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                message: 'FAQs retrieved from cache',
                data: JSON.parse(cachedData),
            });
        }
        const faqs = await FAQ.find({});
        const transformedFAQs = faqs.map((faq) => {
            const { questionTranslated, answerTranslated } =
                faq.getTranslatedContent(lang);
            return {
                _id: faq._id,
                question: questionTranslated,
                answer: answerTranslated,
            };
        });
        // Cache the result
        await redis.set(cacheKey,
            JSON.stringify(transformedFAQs), 'EX', 60); // 60s expiration
        return res.status(200).json({
            message: 'FAQs retrieved from DB',
            data: transformedFAQs,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

