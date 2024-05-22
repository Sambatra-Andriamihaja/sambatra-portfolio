"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import Image, { StaticImageData } from "next/image";

export interface InfoDiploma {
  title: string;
  diploma: StaticImageData;
}

interface IDiploma {
  infoDiploma: InfoDiploma;
  isOpen: boolean;
  onClose: () => void;
}

export const Diploma = (props: IDiploma) => {
  const { infoDiploma, isOpen, onClose } = props;

  return (
    <>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex justify-center items-center">
                  {infoDiploma.title}
                </ModalHeader>
                <ModalBody className="flex justify-center items-center">
                  <Image
                    alt={infoDiploma.title}
                    src={infoDiploma.diploma}
                    width={infoDiploma.diploma.width}
                    height={infoDiploma.diploma.height}
                    layout="responsive"
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
