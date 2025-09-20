import { useEffect, useState } from "react";
import { IoPricetagOutline } from "react-icons/io5";

const IngredientItemList = ({handleSelect,data,units}) =>{
    const [unitOfItem, setUnitOfItem] = useState({});

    useEffect(() => {
      setUnitOfItem(units.filter(unit => unit.id === data.unitId)[0])
    },[data,units])

    return(
      <button 
        onClick={() => handleSelect(data)} 
        className="flex flex-col sm:flex-row items-start sm:items-center bg-white rounded-lg shadow-md text-slate-500 shadow-slate-200 p-4 h-auto w-full hover:shadow-lg transition-shadow duration-200"
      >
        {/* Icono */}
        <div className="w-full sm:w-1/5 flex justify-center items-center mb-3 sm:mb-0">
           <IoPricetagOutline className="text-4xl sm:text-5xl lg:text-6xl text-primary"/>
        </div>
        
        {/* Contenido */}
        <div className="flex flex-col flex-1 gap-2 text-sm sm:text-base">
          {/* Nombre del producto */}
          <div className="text-center sm:text-left">
            <span className="font-bold text-slate-700">Producto: </span> 
            <span className="font-semibold text-primary break-words">
              {data.name}
            </span>
          </div>

          {/* Precio */}
          <div className="text-center sm:text-left">
            <span className="font-bold text-slate-700">Precio: </span> 
            <span className="font-semibold text-primary">
              {data.price.toLocaleString('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Cantidad disponible */}
          <div className="text-center sm:text-left">
            <span className="font-bold text-slate-700">Disponible: </span> 
            <span className="font-semibold text-primary">
              {data.quantity} {data.quantity != 1 ? unitOfItem?.pluralName : unitOfItem?.singularName}
            </span>
          </div>
        </div>
      </button>
    )
  }

export default IngredientItemList;