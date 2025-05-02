import { useModal } from "../../hooks/useModal";
import RecipeForm from "./Form";
import RecipeList from "./List";
import useInit from "../../hooks/useInit";
import { RecipeRepository } from "./repository";
import { selectRecipe, setIsEditing } from "./slice";
import { useDispatch, useSelector } from "react-redux";

export default function Recipe() {
  const {hideModal,showModal,Modal} = useModal();
  const dispatch = useDispatch();
  const recipes  = useSelector((state) => state.recipes);
  const { selected, isEditing } = recipes;
  const repository = new RecipeRepository();
  useInit();
  const handleAdd = async (values) => {
    await repository.CreateRecipe(values)
    hideModal();
  };

  const handleEdit = (values) => {
    console.log("Editing recipe:", values);
    hideModal();
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    console.log("Deleting recipe:", id);
    hideModal();
  };

  const handleSelect = (recipe) => {
    dispatch(selectRecipe(recipe))
    dispatch(setIsEditing(false));
    showModal();
  };

  const handleOpenForm = () => {
    dispatch(selectRecipe(null));
    dispatch(setIsEditing(false));
    showModal();
  };

  const handleEditRecipe = () => {
    dispatch(setIsEditing(true));
  };
  

  return (
    <div>
      <Modal>
        {selected && !isEditing ? (
          <RecipeDetail 
            recipe={selected} 
            onEdit={handleEditRecipe} 
            onClose={()=>{hideModal(); setIsEditing(false); }}
          />
        ) : (
          <RecipeForm 
            recipes={recipes}
            add={handleAdd} 
            edit={handleEdit} 
            remove={handleDelete}
          />
        )}
      </Modal>
      <RecipeList showForm={handleOpenForm} handleSelect={handleSelect}/>
    </div>
  )
}

const RecipeDetail = ({ recipe, onEdit, onClose }) => {
  return (
    <div className="overflow-y-auto no-scrollbar">
      <h2 className="text-xl font-semibold">{recipe.name}</h2>
      
      <div className="recipe-details">
        <div>
          <strong className="text-primary">Ingredientes:</strong>
          <ul>
            {recipe.ingredients?.map((ingredient, index) => (

              <li key={index}>
                {ingredient.name} - {ingredient.quantity} {ingredient.unitId}
              </li>
            ))}
          </ul>
        </div>
        <article className="text-balance w-full">
          <strong className="text-primary">Descripción:</strong>
          <p >{recipe.description}</p>
        </article>
        <article>
          <strong className="text-primary">Instrucciones:</strong>
          <p>{recipe.instructions}</p>
        </article>
        <div>
          <strong className="text-primary">Tiempo de preparación:</strong>
          <p>{recipe.preparationTime} minutos</p>
        </div>
        <div>
          <strong className="text-primary">Pociones por Receta:</strong>
          <p>{recipe.portionPerRecipe} {recipe.portionPerRecipe == 1 ? 'porción': 'porciones'}</p>
        </div>
      </div>

      <div className=" w-full h-full p-4">
        <h3 className="text-xl font-semibold border-b-2 border-primary text-primary">Ingredientes</h3>
        <ul>
          {recipe.ingredients?.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} {item.unitId}
            </li>
          ))}
        </ul>
        </div>
      <div className="flex gap-2 mt-2">
        <button onClick={onEdit} className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600">
          Editar
        </button>
        <button onClick={onClose} className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
          Cerrar
        </button>
      </div>
    </div>
  );
};