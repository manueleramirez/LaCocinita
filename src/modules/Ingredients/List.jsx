import { IoList } from "react-icons/io5";
import ListContainer from "../../components/ListContainer";
import IngredientItemList from "./itemList";

export default function IngredientList({ showForm, handleSelect,Ingredient,units }) {

  return (
    <div>
      <ListContainer
        title="Inventario"
        handleAdd={showForm}
        addLabel={"Agregar"}
      >
        {Ingredient.length > 0 ? (
          Ingredient.map((product) => (
            <IngredientItemList
              handleSelect={handleSelect}
              key={product.id}
              data={product}
              units={units}
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
