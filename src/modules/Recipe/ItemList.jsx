import { IoReceiptOutline } from "react-icons/io5"

const RecipeItemList = ({handleSelect,data}) =>{
    return(
      <button 
        onClick={() => handleSelect(data)} 
        className="flex flex-col sm:flex-row items-start sm:items-center bg-white rounded-lg shadow-md text-slate-500 shadow-slate-200 p-4 h-auto w-full hover:shadow-lg transition-shadow duration-200"
      >
        {/* Icono */}
        <div className="w-full sm:w-1/5 flex justify-center items-center mb-3 sm:mb-0">
           <IoReceiptOutline className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary"/>
        </div>
        
        {/* Contenido */}
        <div className="flex flex-col flex-1 gap-2 text-sm sm:text-base">
          {/* Nombre */}
          <div className="text-center sm:text-left">
            <span className="font-bold text-primary text-lg sm:text-xl lg:text-2xl break-words">
              {data.name}
            </span> 
          </div>
          
          {/* Descripción */}
          <div className="text-center sm:text-left">
            <span className="font-semibold text-slate-600 text-ellipsis line-clamp-2">
              {data.description}
            </span> 
          </div>
          
          {/* Información de precios */}
          <div className="space-y-1 text-center sm:text-left">
            <div>
              <span className="font-bold text-slate-700">Precio recomendado: </span> 
              <span className="font-semibold text-primary">
                {data.recommendedSalesPrice.toLocaleString('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 2 })}
              </span> 
            </div>
            <div>
              <span className="font-bold text-slate-700">Precio por porción: </span> 
              <span className="font-semibold text-primary">
                {data.recommendedSalesPricePerPortion.toLocaleString('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 2 })}
              </span> 
            </div>
            <div>
              <span className="font-bold text-slate-700">Porciones: </span> 
              <span className="font-semibold text-primary">{data.portionPerRecipe}</span> 
            </div>
          </div>
        </div>
      </button>
    )
  }

export default RecipeItemList;