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
      size="2xl"
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settled Orders</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SettledOrders onClose={onClose} marketId={marketId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
