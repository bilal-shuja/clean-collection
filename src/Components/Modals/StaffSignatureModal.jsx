import React from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Modal } from 'pretty-modal';

const StaffSignatureModal = ({
  clearStaffSignature,
  openStaffModal,
  addStaffSignature,
  addSignatures, 
  onCloseStaffModal,
}) => {
  const handleAddStaffSignature = () => {
    // Add the staff signature
    addSignatures();
    // Close the staff signature modal
    onCloseStaffModal();
  };
  return (
    <Modal open={openStaffModal}>
      <div className="d-flex justify-content-center">
        <SignatureCanvas
          ref={clearStaffSignature}
          penColor="black"
          canvasProps={{
            width: 350,
            height: 100,
            className: 'signature-canvas border border-dark fw-bolder m-3',
          }}
        />
        <label htmlFor="" className="align-self-center">
          Staff Signature
        </label>
      </div>

      <button
        className="btn btn-outline-danger btn-sm"
        onClick={handleAddStaffSignature}
      >
        Add Staff Signature
      </button>

      <button className="btn btn-outline-danger btn-sm" onClick={onCloseStaffModal}>
        Close
      </button>
    </Modal>
  );
};

export default StaffSignatureModal;
