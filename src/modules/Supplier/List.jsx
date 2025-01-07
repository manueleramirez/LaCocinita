import { IoList } from "react-icons/io5";
import ListContainer from "../../components/ListContainer";
import SupplierItemList from "./itemList";


export default function SupplierList({ showForm, handleSelect,suppliers }) {

  
  return (
    <div>
      <ListContainer
        title="Suplidores"
        handleAdd={showForm}
        addLabel={"Agregar"}
      >
        {suppliers.length > 0 ? (
          suppliers.map((supplier) => (
            <SupplierItemList
              handleSelect={handleSelect}
              key={supplier.id}
              data={supplier}
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
