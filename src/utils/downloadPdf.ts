// utils/downloadPdf.ts
import html2pdf, { type HTML2PDFOptions } from 'html2pdf.js'
// REMOVE THIS LINE: import { HTML2PDFOptions } from '../types/html2pdf'

/**
 * Downloads the content of a specified HTML element as a PDF.
 * @param elementId The ID of the HTML element to convert (e.g., 'response-content').
 * @param filename The name of the PDF file.
 */
export const downloadHtmlAsPdf = (
  elementId: string,
  filename: string = 'document.pdf'
) => {
  const element = document.getElementById(elementId)

  if (!element) {
    console.error(
      `Element with ID "${elementId}" not found for PDF conversion.`
    )
    return
  }

  // Configuration for html2pdf.js
  const opt: HTML2PDFOptions = {
    // <--- HTML2PDFOptions is now globally available when html2pdf is imported
    margin: 10, // Margins in mm
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 }, // Higher scale for better image quality
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }

  html2pdf().set(opt).from(element).save()
}
