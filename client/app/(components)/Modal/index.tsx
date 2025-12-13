import React from 'react'
import Header from '../Header';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

type Props = {
    isOpen: boolean 
    onClose: ()=> void 
    children: React.ReactNode; 
    name: string
}

const Modal = ({isOpen, onClose, children, name}: Props) => {

    if(!isOpen){
        return null
    }



  return createPortal(
   <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600/50 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary">
        <Header
          name={name}
          buttonComponent={
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-primary text-white hover:bg-blue-600"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          }
          isSmallText
        />
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal