import React, { useState, useRef } from "react";
import { Link } from 'react-router-dom'
import SignatureCanvas from "react-signature-canvas";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AdminSignature = () => {
    const fileInputRef = useRef(null);
    const inputRightRef = useRef(null);

    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [openPDF, setOpenPDF] = useState("");

    const sigCanvasRight = useRef(null);
    const singCanvasLeft = useRef(null);

    const [rightInputValue, setRightInputValue] = useState("");
    const [pdfContent, setPdfContent] = useState(null);

    const [showPDFModifiedBtn, setShowPDFModifiedBtn] = useState(false);
    const [showRightSideSignaturePad, setShowRightSideSignaturePad] = useState(false);
    const debouncedUpdatePdfWithText = customDebounce(updatePdfWithText, 500);

    const SharingFile = () => {

    }

    const displayRightSideSignaturePad = () => {
        setShowRightSideSignaturePad(true);
    };
    async function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            const fileUrl = URL.createObjectURL(selectedFile);
            setFile({ file: selectedFile, url: fileUrl });
            setPageNumber(1);
            loadPdfContent(fileUrl);
        } else {
            console.log("Please select a valid PDF file.");
        }
    };

    // Create a custom debounce function(adding delay in input)
    function customDebounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    }

    async function addSignatures() {

        const existingPdfBytes = await fetch(file?.url).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPage(pageNumber - 1);
        const { width, height } = page.getSize();
        const imageSize = { width: 250, height: 60 };

        const signatureDataURLRight = sigCanvasRight.current.toDataURL();
        let signatureDataURLLeft = null;

        if (singCanvasLeft.current) {
            signatureDataURLLeft = singCanvasLeft.current.toDataURL();
        } else {
            console.error("Left-side signature canvas is not available.");
            return; // Exit the function if left-side canvas is not available.
        }

        const pngImageLeft = await pdfDoc.embedPng(signatureDataURLLeft);
        const pngImageRight = await pdfDoc.embedPng(signatureDataURLRight);

        // Add the left signature
        page.drawImage(pngImageLeft, {
            x: width - imageSize.width - 270,
            y: height - imageSize.height - 620,
            width: imageSize.width,
            height: imageSize.height,
            opacity: 1,
        });

        // Add the right signature if the right-side signature pad is shown
        page.drawImage(pngImageRight, {
            x: width - imageSize.width - -20,
            y: height - imageSize.height - 620,
            width: imageSize.width,
            height: imageSize.height,
            opacity: 1,
        });

        const modifiedPdfBytes = await pdfDoc.save();
        const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
            type: "application/pdf",
        });
        const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

        setOpenPDF(modifiedPdfUrl);
        setShowPDFModifiedBtn(true);
    }

    async function loadPdfContent(pdfUrl) {
        const existingPdfBytes = await fetch(pdfUrl).then((res) =>
            res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        setPdfContent(pdfDoc);
    }

    async function handleInputChange(event) {
        const { value } = event.target;
        setRightInputValue(value);
        debouncedUpdatePdfWithText(value, pageNumber);
    }

    async function updatePdfWithText(rightValue, page) {
        if (!pdfContent || !file) return;

        const copiedPdfDoc = await PDFDocument.create();

        // Ensure that the requested page exists
        if (page < 1 || page > pdfContent.getPageCount()) {
            console.log(`Page ${page} does not exist.`);
            return;
        }

        for (let i = 0; i < pdfContent.getPageCount(); i++) {
            const pdfPages = await copiedPdfDoc.copyPages(pdfContent, [i]);
            if (i === page - 1) {
                const copiedPage = pdfPages[0];
                const font = await copiedPdfDoc.embedFont("Courier");
                const fontSize = 16;
                const { width, height } = copiedPage.getSize();
                const xRight = width - 300;
                const y = 50;

                // Clear existing text by drawing a transparent rectangle over it
                copiedPage.drawRectangle({
                    x: xRight - 11,
                    y: height - y - fontSize,
                    width: fontSize * rightValue.length + 22,
                    height: fontSize + 10,
                    color: rgb(1, 1, 1),
                });

                copiedPage.drawText(rightValue, {
                    x: xRight,
                    y: height - y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                });

                copiedPdfDoc.addPage(copiedPage);
            } else {
                const copiedPage = pdfPages[0];
                copiedPdfDoc.addPage(copiedPage);
            }
        }

        const updatedPdfBytes = await copiedPdfDoc.save();
        const updatedPdfUrl = URL.createObjectURL(
            new Blob([updatedPdfBytes], { type: "application/pdf" })
        );

        setPdfContent(copiedPdfDoc);
        setFile({ ...file, url: updatedPdfUrl });
    }

    const openModifiedPdfInNewTab = () => {
        if (file && file.url) {
            window.open(openPDF, "_blank");
        }
    };

    const openModifiedPdfInNewTextTab = () => {
        if (file && file.url) {
            window.open(file?.url, "_blank");
        }
    };

    function clearSignature() {
        sigCanvasRight.current.clear();
    }
    function clearSignatureLeft() {
        singCanvasLeft.current.clear();
    }

    return (
        <>
            <div className="container text-center p-4">
                <p className="text-bold mt-5">
                    Easily add your docs and mark your signature
                </p>

                <div className="d-grid gap-2 col-lg-6 mx-auto mt-5">
                    <button
                        type="file"
                        className="btn btn-outline-light text-white p-4"
                        onClick={handleButtonClick}
                        style={{
                            fill: "#e74c3c",
                            backgroundColor: "#e74c3c",
                            borderRadius: "1em",
                        }}
                    >
                        Choose file
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".pdf"
                    onChange={handleFileChange}
                />

                {file && (
                    <div className="mt-5">
                        <div className="row  mt-4 mb-4">
                            <div className="col-lg-3">
                                <input
                                    ref={inputRightRef}
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Enter text..."
                                    aria-label="Enter text..."
                                    value={rightInputValue}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="col-lg-3">
                                <button
                                    className="btn btn-outline-info  btn-sm"
                                    onClick={openModifiedPdfInNewTextTab}
                                >
                                    Open Modified PDF
                                </button>
                            </div>
                        </div>
                        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page
                                pageNumber={pageNumber}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                        </Document>
                        <p>
                            Page {pageNumber} of {numPages}
                        </p>

                    </div>
                )}

                <div className="d-grid gap-2 col-lg-6 mx-auto mt-5">
                    {file ? (
                        <Link to='/EmployeeSignature' state={{pdfFile: file}}>
                            <button
                                type="file"
                                className="btn btn-outline-light text-white p-4"
                                style={{
                                    fill: "#e74c3c",
                                    backgroundColor: "#e74c3c",
                                    borderRadius: "1em",
                                }}
                            >
                                Share to Employee
                            </button>
                        </Link>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default AdminSignature;
