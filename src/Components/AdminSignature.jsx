import React, { useState, useRef } from "react";
import { Link } from 'react-router-dom'
import SignatureCanvas from "react-signature-canvas";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

toast.configure();
const AdminSignature = () => {
    const fileInputRef = useRef(null);
    const inputRightRef = useRef(null);

    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);

    const [identifier, setIdentifier] = useState("")

    const sigCanvasRight = useRef(null);
    const singCanvasLeft = useRef(null);

    const [rightInputValue, setRightInputValue] = useState("");
    const [pdfContent, setPdfContent] = useState(null);

    const [showPDFModifiedBtn, setShowPDFModifiedBtn] = useState(false);
    const [showRightSideSignaturePad, setShowRightSideSignaturePad] = useState(false);
    const debouncedUpdatePdfWithText = customDebounce(updatePdfWithText, 500);

    const uploadFile = () => {
        setLoading(true)
        var formdata = new FormData();
        // formdata.append("pdf", fileInput.files[0], "/C:/Users/HP/Downloads/626423.png");
        formdata.append("pdf", file);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://pdf.tradingtube.net/api/post_file", requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoading(false)
                if (result.status === 401) {
                    toast("Please enter a valid pdf file");
                }
                else if (result.status === "200") {
                    console.log(result)
                    setIdentifier(result.user_identifier)
                    toast("Uploaded Successfully");
                }
            })
            .catch(error => {
                setLoading(false)
                console.log('error', error)
                toast("Something went wrong");
            });
    }

    async function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };


    const handleFileChange = () => {

        const selectedFile = fileInputRef.current.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            const fileUrl = URL.createObjectURL(selectedFile);
            setFile(selectedFile);
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


    const openModifiedPdfInNewTextTab = () => {
        if (file && file.url) {
            window.open(file?.url, "_blank");
        }
    };


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
                    {
                        loading === true ? (
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>

                        ) : (
                            <div>
                                {file ? (

                                    <button
                                        onClick={uploadFile}
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

                                ) : null}
                            </div>
                        )

                    }






                </div>
            </div>
        </>
    );
};

export default AdminSignature;
