import { Labels } from "@messages";
import { Button, Modal } from "react-bootstrap";

export function Confirmation(props: {
  show: boolean;
  title?: string;
  message: string;
  cancel: () => void;
  confirm: () => void;
}) {
  const { show, message, cancel, confirm } = props;
  return <Modal show={show} centered onHide={cancel}>
    <Modal.Header closeButton>
      <Modal.Title>{Labels.ConfirmationDefaultTitle}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{message}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={cancel}>{Labels.ConfirmationCancel}</Button>
      <Button variant="secondary" onClick={confirm}>{Labels.ConfirmationConfirm}</Button>
    </Modal.Footer>
  </Modal>
}