import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal } from "../redux/Slices/modal.slice";
import { IoCloseCircleOutline } from "react-icons/io5";

export const useModal = () => {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state) => state.modal);
  
    const showModal = () => {
      dispatch(openModal());
    };
  
    const hideModal = () => {
      dispatch(closeModal());
    };
    const Modal = ({children}) => {
      if (!isOpen) return null;
    
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90%] overflow-y-scroll no-scrollbar">
            <button
              className="absolute top-4 right-8 text-gray-500 hover:text-gray-800"
              onClick={hideModal}
            >
              <IoCloseCircleOutline size={30} />
            </button>
            <div>{children}</div>
          </div>
        </div>
      );
    };
  
    return {
      isOpen,
      showModal,
      hideModal,
      Modal
    };
  };