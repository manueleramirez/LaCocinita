import { useEffect, useState } from "react";
import { IoPricetagOutline } from "react-icons/io5";

const IngredientItemList = ({handleSelect,data,units}) =>{
    const [unitOfItem, setUnitOfItem] = useState({});

    useEffect(() => {
      setUnitOfItem(units.filter(unit => unit.id === data.unitId)[0])
    },[data,units])

    return(
      <button onClick={() => handleSelect(data)} className="flex justify-center items-center bg-white rounded shadow-md text-slate-500 shadow-slate-200 p-4 h-auto w-full">
          <div className="w-1/5 flex justify-center items-center">
             <IoPricetagOutline className="text-6xl"/>
          </div>
          <div className="flex flex-col p-2 gap-2 ">
  
            <div>
              <span className="font-bold">Producto:</span> {data.name}
            </div>
  
            <div>
              <span className="font-bold">precio:</span> {data.price}
            </div>
  
            <div>
              <span className="font-bold">Disponible:</span> {data.quantity} {data.quantity != 1 ? unitOfItem?.pluralName : unitOfItem?.singularName}
            </div>
          </div>
        </button>
    )
  }

export default IngredientItemList;