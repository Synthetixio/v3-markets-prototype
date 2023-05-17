import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import { useRef } from "react";
import { SettledOrders } from "./SettledOrders";

interface Props {
  marketId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function SettledOrderModal({ marketId, isOpen, onClose }: Props) {
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
          <SettledOrders marketId={marketId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
