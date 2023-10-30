import React from 'react';
import SignatureCanvas from "react-signature-canvas";
import { Modal } from 'pretty-modal';

const PickupSignatureModal = ({
  clearSignatureLeft,
  showRightSideSignaturePad,
  clearSignature,
  addSignatures,
  displayRightSideSignaturePad,
  showPDFModifiedBtn,
  openModifiedPdfInNewTab,
  sigCanvasRight,
  singCanvasLeft,
  openModal,
}) => {
  return (
    <div>
      <Modal open={openModal}>
        <div className="d-flex justify-content-center">
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

        <button
          className="btn btn-outline-primary"
          onClick={displayRightSideSignaturePad}
        >
          Next Signature
        </button>
      </Modal>
    </div>
  );
};

export default PickupSignatureModal;
