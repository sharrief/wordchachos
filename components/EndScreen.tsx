import { Modal } from "react-bootstrap";
import {Labels} from "messages";

export function EndScreen(props: {
  show: boolean;
  win: boolean;
  loss: boolean;
  onHide: () => void;
  guesses: number;
  answer: string;
}) {
  const { show, win, loss, onHide, guesses, answer } = props;
  return (<Modal show={show} centered onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>
        {win && Labels.WinTitle(guesses)}
        {loss && Labels.LossTitle}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>
        {win && Labels.WinSubtitle(guesses)}
        {loss && Labels.LossSubtitle}
      </h4>
      <h5>The answer was {answer}</h5>
      <p>
        {win && `Share this game with your friends!`}
        {loss && `Maybe don't share this game with your friends!`}
      </p>
    </Modal.Body>
  </Modal>)
}