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
}

export function AsyncOrderModal({ marketId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const finalRef = useRef(null);

  return (
    <Modal
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Orders</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AsyncOrders onClose={() => setIsOpen(false)} marketId={marketId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
