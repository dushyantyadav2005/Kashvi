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

        const dirName = "C:\\Users\\04khu\\Desktop\\New folder (2)\\backend\\files";
        const outputTexPath = path.join(dirName, 'output_invoice.tex');
        const outputPdfPath = path.join(dirName, 'invoice.pdf');

        // Generate LaTeX table content separately
        const itemsTableContent = invoiceData.items.map((item, index) =>
            `${index + 1} & ${item.name} & ${item.qty} \\\\ \\hline`
        ).join('\n');

        const latexTemplate = `
        \\documentclass{article}
        \\usepackage[a4paper,margin=1in]{geometry}
        \\usepackage{graphicx}
        \\usepackage{array}
        \\usepackage{multirow}
        \\usepackage{booktabs}

        \\begin{document}

        % Logo and Company Name
        \\begin{center}
            \\includegraphics[width=3cm]{"C:/Users/04khu/Desktop/New folder (2)/backend/files/logopng1.png"} \\\\[1em]  
            {\\large Your Trusted Partner} \\\\[2em]
        \\end{center}

        % Invoice Details
        \\noindent
        \\begin{tabular}{@{}ll@{}}
            \\textbf{Invoice No:} & \\texttt{\\textbf{${invoiceData.invoiceNo || 'N/A'}}} \\\\
            \\textbf{Customer Name:} & \\texttt{\\textbf{${invoiceData.customerName || 'N/A'}}} \\\\
            \\textbf{Date:} & \\texttt{\\textbf{${new Date().toLocaleDateString()}}} \\\\
        \\end{tabular}

        \\vspace{2em}

        % Items Table
        \\textbf{Items Purchased:} \\\\[1em]

        \\begin{tabular}{|c|l|c|}
            \\hline
            \\textbf{No.} & \\textbf{Item Name} & \\textbf{Quantity} \\\\
            \\hline
            ${itemsTableContent}
        \\end{tabular}

        \\vspace{2em}

        % Notes Section
        \\noindent
        \\textbf{Notes:} \\\\[0.5em]
        \\begin{quote}
            Thank you for choosing Kashvi. We value your trust and are committed to providing the best service.  
            For any inquiries, please contact our customer support.  
            All items are non-refundable unless stated otherwise.  
            Please retain this invoice for future reference.  
            If you have any concerns, feel free to reach out to us within 7 days of purchase.
        \\end{quote}

        \\vspace{1em}

        % Signature and Stamp Section
        \\noindent
        \\begin{tabular}{@{}p{0.45\\textwidth}p{0.45\\textwidth}@{}}
            \\textbf{Authorized Signature:} & \\textbf{Company Stamp:} \\\\
            \\vspace{2cm} & \\vspace{2cm} \\\\
        \\end{tabular}

        \\end{document}
        `;

        fs.writeFileSync(outputTexPath, latexTemplate, 'utf8');

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

            if (!invoiceData.email) {
                return res.status(400).json({ error: 'No email provided for sending invoice' });
            }

            try {
                await sendMail(
                    invoiceData.email,
                    "Your Invoice from Kashvi",
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
