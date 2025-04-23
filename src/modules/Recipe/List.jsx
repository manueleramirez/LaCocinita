import { useSelector } from "react-redux";
import ListContainer from "../../components/ListContainer";
import RecipeItemList from "./ItemList";
import { IoList } from "react-icons/io5";

export default function RecipeList({ showForm, handleSelect }) {
  const recipes = useSelector((state) => state.recipes.recipes);
  return (
    <div>
      <ListContainer
        title="Recetas"
        handleAdd={showForm}
        addLabel={"Agregar"}
      >
        {recipes?.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeItemList
              handleSelect={handleSelect}
              key={recipe.id}
              data={recipe}
            />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center p-12">
            <IoList className="text-4xl text-gray-400" />
            <p className="text-lg text-gray-400 text-center font-semibold ">
              No existen datos para mostrar
            </p>
          </div>
        )}
      </ListContainer>
    </div>
  );
}
