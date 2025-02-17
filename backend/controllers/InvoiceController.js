import fs from 'fs';
import latex from 'node-latex';
import path from 'path';
import { sendMail } from "../utils/sendEmail.js";
import dotenv from 'dotenv';

dotenv.config();


async function generateInvoice(req, res) {
    try {
        const invoiceData = req.body;
        console.log(invoiceData);

        const dirName = path.dirname("C:\\Users\\04khu\\Desktop\\Invoice Integration\\backend\\files");
        // Define output PDF path
        const outputTexPath = path.join(dirName, 'files', 'output_invoice.tex');
        const outputPdfPath = path.join(dirName, 'files', 'invoice.pdf');

        // Construct dynamic LaTeX template
        const latexTemplate = `
        \\documentclass{article}
        \\usepackage[a4paper,margin=1in]{geometry}
        \\usepackage{graphicx}
        \\usepackage{array}
        \\usepackage{multirow}
        \\usepackage{booktabs}

        \\begin{document}

        \\begin{center}
            {\\Huge \\textbf{Invoice}} \\\\[1em]
        \\end{center}

        \\noindent
        \\begin{tabular}{@{}ll@{}}
            \\textbf{Invoice No:} & \\texttt{${invoiceData.invoiceNo || 'N/A'}} \\\\
            \\textbf{Customer Name:} & \\texttt{${invoiceData.customerName || 'N/A'}} \\\\
            \\textbf{Date:} & \\texttt{${new Date().toLocaleDateString()}} \\\\
        \\end{tabular}

        \\vspace{2em}

        \\textbf{Items Purchased:} \\\\

        \\begin{tabular}{|c|l|c|}
            \\hline
            \\textbf{No.} & \\textbf{Item Name} & \\textbf{Quantity} \\\\
            \\hline
            ${invoiceData.items.map((item, index) => `${index + 1} & ${item.name} & ${item.qty} \\\\ \\hline`).join('\n')}
        \\end{tabular}

        \\vspace{2em}

        \\noindent
        \\textbf{Notes:} \\\\
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        \\vspace{1em}

        \\noindent
        \\begin{tabular}{@{}p{0.5\\textwidth}p{0.5\\textwidth}@{}}
            \\textbf{Authorized Signature:} & \\textbf{Company Stamp:} \\\\
            \\vspace{2cm} & \\vspace{2cm} \\\\
        \\end{tabular}

        \\end{document}
        `;

        // Write LaTeX content to file
        fs.writeFileSync(outputTexPath, latexTemplate, 'utf8');

        // Compile LaTeX to PDF
        const input = fs.createReadStream(outputTexPath);
        const output = fs.createWriteStream(outputPdfPath);
        const pdf = latex(input);

        pdf.pipe(output);

        pdf.on('error', (err) => {
            console.error('❌ LaTeX compilation failed:', err);
            return res.status(500).json({ error: 'LaTeX compilation failed', details: err.message });
        });

        pdf.on('finish', async () => {
            console.log('✅ Invoice PDF generated successfully:', outputPdfPath);

            // Send email with invoice PDF attached
            try {
                await sendMail(
                    invoiceData.email, // Recipient's email
                    "Your Invoice from Our Store",
                    "Thank you for your Visit. Please find your invoice attached.",
                    "<p>Thank you for your purchase. Please find your invoice attached.</p>",
                    outputPdfPath
                );

                return res.status(200).json({
                    message: 'Invoice generated and sent successfully',
                    filePath: outputPdfPath
                });

            } catch (emailError) {
                console.error('❌ Error sending invoice email:', emailError);
                return res.status(500).json({ error: 'Failed to send invoice email' });
            }
        });

    } catch (err) {
        console.error('❌ Error generating invoice:', err);
        return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

export { generateInvoice };
