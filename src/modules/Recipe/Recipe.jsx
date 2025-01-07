import { useDispatch } from "react-redux";
import { useModal } from "../../hooks/useModal";
import RecipeForm from "./Form";
import RecipeList from "./List";
import useInit from "../../hooks/useInit";

export default function Recipe() {
  const {hideModal,showModal,Modal} = useModal();
  useInit();
   const handleAdd = (values) => {
      console.log(values)
      hideModal();
    };
  
    const handleEdit = (values) => {
      hideModal();
    };
  
    const  handleDelete = (id) => {
      hideModal();
    };
    
    const handleSelect = (recipe) => {
      showModal()
    };
  
    const handleOpenForm = () => {
      showModal();
    };
  

  return (
    <div>
      <Modal>
        <RecipeForm add={handleAdd} edit={handleEdit} remove={handleDelete}/>
      </Modal>
      <RecipeList showForm={showModal}/>
    </div>
  )
}
