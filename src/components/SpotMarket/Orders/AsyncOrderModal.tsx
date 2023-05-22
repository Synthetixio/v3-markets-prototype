import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { useRef } from "react";
import { AsyncOrders } from "./AsyncOrders";

interface Props {
  marketId: number;
  isOpen: boolean;
  onClose: () => void;
  defaultIndex?: number;
}

export function AsyncOrderModal({
  marketId,
  isOpen,
  onClose,
  defaultIndex,
}: Props) {
  const finalRef = useRef(null);

  return (
    <Modal
      size="5xl"
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody my={6} mx={2}>
          <AsyncOrders marketId={marketId} defaultIndex={defaultIndex} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
