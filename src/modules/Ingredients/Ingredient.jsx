import { useDispatch, useSelector } from "react-redux";
import IngredientForm from "./Form";
import { addIngredient, deleteIngredient, selectIngredient, updateIngredient } from "./slice";
import IngredientList from "./List";
import { useModal } from "../../hooks/useModal";
import { useEffect } from "react";

export default function Ingredient() {
  const { showModal,hideModal,Modal } = useModal();
  const dispatcher = useDispatch();
  const Ingredient = useSelector((state) => state.Ingredient.Ingredient);
  const units = useSelector(state => state.units.units)
  const user = useSelector((state) => state.user.user);

    useEffect(()=>{
      handleGetIngredient()
    },[user])

  const handleGetIngredient = async()=>{

  }

  const handleAddIngredient = (values) => {
    console.log(values)
    dispatcher(addIngredient(values));
    hideModal();
  };

  const handleEditIngredient = (values) => {
    dispatcher(updateIngredient(values));
    hideModal();
  };

  const  handleDeleteIngredient = (id) => {
    dispatcher(deleteIngredient(id))
    hideModal();
  };
  
  const handleSelectIngredient = (Ingredient) => {
    dispatcher(selectIngredient(Ingredient));
    showModal()
  };

  const handleOpenForm = () => {
    dispatcher(selectIngredient(null));
    showModal();
  };

  return (
    <div>
      <Modal>
        <IngredientForm add={handleAddIngredient} edit={handleEditIngredient} remove={handleDeleteIngredient}  />
      </Modal>
     <IngredientList showForm={handleOpenForm} handleSelect={handleSelectIngredient} Ingredient={Ingredient} units={units} />
    </div>
  )
}
