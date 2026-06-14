import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseMod = require("pdf-parse");
import Tesseract from "tesseract.js";

async function extractWithPdfParse(buffer) {
    try {
        const data = await pdfParseMod(buffer);
        return data.text || "";
    } catch (e) {
        console.error("pdf-parse error:", e.message);
        return "";
    }
}
async function extractWithPdfJs(buffer) {
    try {
        const data = new Uint8Array(buffer);
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ") + " ";
        }
        return text;
    } catch (e) {
        console.error("pdfjs-dist error:", e.message);
        return "";
    }
}
async function extractWithOCR(buffer) {
    try {
        // Warning: Tesseract cannot directly process PDF buffers without first converting them to images.
        // If the buffer is a PDF, this will fail. We are returning an empty string to gracefully fall back.
        console.warn("OCR fallback requires an image format. Skipping OCR for binary document buffer.");
        return "";
    } catch (e) {
        console.error("OCR error:", e.message);
        return "";
    }
}
/**
 * Extracts text from a buffer containing a PDF, DOCX, or TXT file.
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
        const isTxt = mimetype === 'text/plain' || (fileName && fileName.toLowerCase().endsWith('.txt'));
        if (isPdf) {
            extractedText = await extractWithPdfParse(buffer);
            if (extractedText.trim().length < 100) {
                console.log("pdf-parse extracted less than 100 chars, trying pdfjs-dist...");
                const pdfjsText = await extractWithPdfJs(buffer);
                if (pdfjsText.trim().length > extractedText.trim().length) {
                    extractedText = pdfjsText;
                }
            }
            if (extractedText.trim().length < 100) {
                console.log("pdfjs-dist extracted less than 100 chars, trying OCR fallback...");
                const ocrText = await extractWithOCR(buffer);
                if (ocrText.trim().length > extractedText.trim().length) {
                    extractedText = ocrText;
                }
            }
        } else if (isDocx) {
            const docxData = await mammoth.extractRawText({ buffer });
            extractedText = docxData.value;
        } else if (isTxt) {
            extractedText = buffer.toString('utf8');
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
