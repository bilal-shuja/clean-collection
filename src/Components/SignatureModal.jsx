import React from 'react'
import SignatureCanvas from "react-signature-canvas";
import { Modal } from 'pretty-modal'

const SignatureModal = ({ clearSignature, openModal, showRightSideSignaturePad, sigCanvasRight, clearSignatureLeft, openModifiedPdfInNewTab, addSignatures, displayRightSideSignaturePad, showPDFModifiedBtn, singCanvasLeft }) => {
    return (
        <div>

            <Modal open={openModal}>
                <div className="d-flex justify-content-center">

                    <div style={{ display: showRightSideSignaturePad ? 'none' : 'flex' }}>
                        <SignatureCanvas
                            ref={singCanvasLeft}
                            penColor="black"
                            canvasProps={{
                                width: 350,
                                height: 100,
                                className: "signature-canvas border border-dark fw-bolder m-3",
                            }}
                        />
                        <label htmlFor="" className="align-self-center">
                            Pickup Signature
                        </label>
                    </div>
                    
                    {
                        showRightSideSignaturePad && (
                            <>
                                <SignatureCanvas
                                    ref={sigCanvasRight}
                                    penColor="black"
                                    canvasProps={{
                                        width: 350,
                                        height: 100,
                                        className:
                                            "signature-canvas border border-dark fw-bolder m-3",
                                    }}
                                />
                                <label htmlFor="" className="align-self-center">
                                    Staff Signature
                                </label>
                            </>
                        )

                    }
                </div>

                {showRightSideSignaturePad === true ? null : (
                    <button
                        className="btn btn-outline-primary"
                        onClick={displayRightSideSignaturePad}
                    >
                        Next Signature
                    </button>
                )}
                {showRightSideSignaturePad === true ? (
                    <button
                        className="btn btn-outline-warning  btn-sm"
                        onClick={addSignatures}
                    >
                        Add Signatures
                    </button>
                ) : null}
                &nbsp;&nbsp;
                {showPDFModifiedBtn === false ? null : (
                    <button
                        className="btn btn-outline-info  btn-sm"
                        onClick={openModifiedPdfInNewTab}
                        style={{ marginRight: "2em" }}
                    >
                        Open Modified Pdf
                    </button>
                )}
                &nbsp;&nbsp;
                {showRightSideSignaturePad === true ? null : (
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={clearSignatureLeft}
                    >
                        Clear Pickup Signature
                    </button>
                )}
                &nbsp;&nbsp;
                {showRightSideSignaturePad === true ? (
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={clearSignature}
                    >
                        Clear Staff Signature
                    </button>
                ) : null}
            </Modal>

        </div>
    )
}

export default SignatureModal