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
        \\usepackage[a4paper,margin=0.75in]{geometry}
        \\usepackage{graphicx}
        \\usepackage{array}
        \\usepackage{multirow}
        \\usepackage{booktabs}
        \\usepackage[table]{xcolor}  % For colors
        \\usepackage{helvet} % Use Helvetica font
        \\renewcommand{\\familydefault}{\\sfdefault} % Set sans-serif as default



        \\definecolor{headerblue}{RGB}{230, 242, 255} % Light blue for header
        \\definecolor{tableblue}{RGB}{220, 230, 250} % Lighter blue for tables
        \\definecolor{textgray}{RGB}{80, 80, 80}  % Professional gray text

        \\begin{document}

        % Logo and Header
        \\begin{center}
            \\includegraphics[width=3cm]{"C:/Users/04khu/Desktop/New folder (2)/backend/files/logopng1.png"} \\\\[0.5em]  
            {\\Large \\textbf{Invoice}} \\\\[0.5em]
            {\\small Your Trusted Partner in Quality Service}
        \\end{center}

        \\vspace{1em}

        % Invoice Information
        \\color{textgray}
        \\noindent
        \\fbox{%
        \\begin{minipage}{\\textwidth}
        \\renewcommand{\\arraystretch}{1.4}
        \\begin{tabular}{@{}p{4cm}p{8cm}@{}}
            \\textbf{Invoice No:} & ${invoiceData.invoiceNo || 'N/A'} \\\\
            \\textbf{Customer Name:} & ${invoiceData.customerName || 'N/A'} \\\\
            \\textbf{Date:} & ${new Date().toLocaleDateString()} \\\\
            \\textbf{Contact Email:} & ${invoiceData.email || 'N/A'} \\\\
        \\end{tabular}
        \\end{minipage}
        }
        
        \\vspace{2em}

        % Items Table
        \\textbf{Items Purchased:} \\\\[1em]

        \\renewcommand{\\arraystretch}{1.3} % Increase row height for readability
        \\rowcolors{2}{tableblue}{white} % Alternate row colors
        \\begin{tabular}{|c|l|c|}
            \\rowcolor{headerblue} % Set header row color
            \\hline
            \\textbf{No.} & \\textbf{Item Name} & \\textbf{Quantity} \\\\
            \\hline
            ${itemsTableContent}
        \\end{tabular}

        \\vspace{2em}

        % Notes Section
        \\noindent
        \\textbf{Important Notes:} \\\\[0.5em]
        \\begin{quote}
            Thank you for choosing Kashvi. We appreciate your trust and strive to provide the best service.  
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
