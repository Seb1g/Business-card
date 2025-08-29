import React from "react";
import "./dialog.scss";

interface DialogProps {
  text: string;
  type: "confirm" | "alert";
  onClose: (result: boolean) => void;
}

export const Dialog: React.FC<DialogProps> = ({ text, type, onClose }) => {
  return (
    <div className="dialog">
      <div className="dialog__overlay" onClick={() => onClose(false)} />
      <div className="dialog__content">
        <p>{text}</p>
        <div className="dialog__actions">
          {type === "confirm" ? (
            <>
              <button className="dialog__btn" onClick={() => onClose(true)}>
                OK
              </button>
              <button className="dialog__btn dialog__btn--secondary" onClick={() => onClose(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button className="dialog__btn" onClick={() => onClose(false)}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
