/**
 * Interface for a modalState object
 */
export interface IModalState {
    readonly: boolean;
    modalTitle: string;
    modalText: string;
    modalPrimaryActionText: string;
    modalSecondaryActionText: string;
    modalPrimaryActionHandler: () => void;
    modalSecondaryActionHandler: () => void;
    closeModal: () => void;
}
