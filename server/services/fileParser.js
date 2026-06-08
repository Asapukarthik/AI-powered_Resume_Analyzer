import * as pdfParseMod from 'pdf-parse';
import * as mammothMod from 'mammoth';
const pdfParse = pdfParseMod.default;
const mammoth = mammothMod.default;


/**
 * Extracts text from a buffer containing a PDF or DOCX file.
 * @param {Buffer} buffer - The file buffer
 * @param {string} mimetype - The file MIME type
 * @returns {Promise<string>} The extracted text
 */
export const extractTextFromFile = async (buffer, mimetype, fileName = '') => {
    if (!buffer) {
        throw new Error('No file buffer provided');
    }

    let extractedText = '';

    try {
        const isPdf = mimetype === 'application/pdf' || mimetype === 'application/x-pdf' || (fileName && fileName.toLowerCase().endsWith('.pdf'));
        const isDocx = mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimetype === 'application/msword' || (fileName && (fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc')));

        if (isPdf) {
            const pdfData = await pdfParse(buffer);
            extractedText = pdfData.text;
        } else if (isDocx) {
            const docxData = await mammoth.extractRawText({ buffer });
            extractedText = docxData.value;
        } else {
            throw new Error(`Unsupported file format. Mimetype: ${mimetype}`);
        }

        // Clean up excessive whitespace and special characters to aid LLM parsing
        extractedText = extractedText.replace(/\s+/g, ' ').trim();

        return extractedText;
    } catch (error) {
        console.error('Error extracting text from file:', error);
        throw new Error('Failed to parse document content');
    }
};

