import { useModal } from "../../hooks/useModal";
import RecipeForm from "./Form";
import RecipeList from "./List";
import useInit from "../../hooks/useInit";
import { RecipeRepository } from "./repository";
import { selectRecipe, setIsEditing } from "./slice";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";

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
    window.location.reload();
  };

  const handleEdit = (values) => {
    repository.UpdateRecipe(values).then(()=>{
      hideModal();
      setIsEditing(false);
      window.location.reload();
    }).catch(e =>{
      console.log(e)
    });
  };

  const handleDelete =  (id) => {
    console.log(id)
    repository.DeleteRecipe(id).then(()=>{
      hideModal();
      window.location.reload();
    }).catch(e =>{
      console.log(e)
    });
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
  const formatTime = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutos`;
    } else if (hours === 1) {
      return "1 hora";
    } else {
      return `${hours} horas`;
    }
  };

  return (
    <div className="overflow-y-auto no-scrollbar max-h-[90vh] p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight flex-1 pr-2">
            {recipe.name}
          </h1>
        </div>
      </div>

      {/* Recipe Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        {/* Preparation Time */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Tiempo de preparación</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{formatTime(recipe.preparationTime)}</p>
            </div>
          </div>
        </div>

        {/* Portions */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Porciones</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {recipe.portionPerRecipe} {recipe.portionPerRecipe === 1 ? 'porción' : 'porciones'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {recipe.description && (
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descripción
          </h2>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{recipe.description}</p>
          </div>
        </div>
      )}

      {/* Ingredients */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Ingredientes
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {recipe.ingredients?.map((ingredient, index) => (
              <div key={ingredient.id || index} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{ingredient.name}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">
                    {ingredient.quantity} {ingredient.unitId}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {recipe.instructions && (
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Instrucciones
          </h2>
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{recipe.instructions}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white border-t border-gray-200 pt-4 mt-4 sm:mt-6 -mx-4 md:-mx-6 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            label="Editar Receta"
            onClick={onEdit}
            variant="primary"
            size="lg"
            className="flex-1"
          />
          <Button
            label="Cerrar"
            onClick={onClose}
            variant="secondary"
            size="lg"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};