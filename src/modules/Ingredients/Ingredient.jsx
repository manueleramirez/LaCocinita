import { useDispatch, useSelector } from "react-redux";
import IngredientForm from "./Form";
import { getIngredient, selectIngredient } from "./slice";
import IngredientList from "./List";
import { useModal } from "../../hooks/useModal";
import { IngredientRepository } from "./repository";

export default function Ingredient() {
  const { showModal,hideModal,Modal } = useModal();
  const dispatcher = useDispatch();
  const Ingredient = useSelector((state) => state.Ingredient.Ingredient);
  const units = useSelector(state => state.units.units)
  const user = useSelector((state) => state.user.user);
  const repository = new IngredientRepository();


  const handleGetIngredient = async()=>{
    const {isSuccess, data} = await repository.GetIngredients(user.id)
    if(isSuccess){
      dispatcher(getIngredient(data))
    }
  }

  const handleAddIngredient = async (values) => {
    const {isSuccess} = await repository.CreateIngredient(user.id,values)
    if(isSuccess){
      await handleGetIngredient();
      hideModal();
    }else{
      alert("Error al crear el ingrediente")
    }
  };

  const handleEditIngredient = async (values) => {
    const {isSuccess} = await repository.UpdateIngredient(user.id,values)
    if(isSuccess){
      await handleGetIngredient();
      hideModal();
    }else{
      alert("Error al editar el ingrediente")
    }
  };

  const  handleDeleteIngredient = async (id) => {
    const {isSuccess} = await repository.DeleteIngredient(id)
    if(isSuccess){
      await handleGetIngredient();
      hideModal();
    }else{
      alert("Error al eliminar el ingrediente")
    }
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
