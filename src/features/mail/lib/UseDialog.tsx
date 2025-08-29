import {useState} from "react";
import {Dialog} from "../ui/Dialog.tsx";

export const useDialog = () => {
  const [dialog, setDialog] = useState<{
    text: string;
    type: 'confirm' | 'alert';
    resolve: (result: boolean) => void
  } | null>(null);

  const showConfirm = (text: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({text, type: 'confirm', resolve});
    });
  };

  const showAlert = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      setDialog({text, type: 'alert', resolve: () => resolve()});
    });
  };

  const dialogComponent = dialog && (<Dialog text={dialog.text} type={dialog.type} onClose={(result) => {
    dialog.resolve(result);
    setDialog(null);
  }}/>);

  return {showConfirm, showAlert, dialogComponent};
};
