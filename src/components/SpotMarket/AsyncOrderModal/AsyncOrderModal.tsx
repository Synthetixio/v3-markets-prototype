import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { AsyncOrders } from "./AsyncOrders";

interface Props {
  marketId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AsyncOrderModal({ marketId, isOpen, onClose }: Props) {
  const finalRef = useRef(null);

  return (
    <Modal
      size="4xl"
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Async Orders</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AsyncOrders onClose={onClose} marketId={marketId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
