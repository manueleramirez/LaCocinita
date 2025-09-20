import { IoReceiptOutline, IoArrowForward } from "react-icons/io5"

const RecipeItemList = ({handleSelect,data}) =>{
    return(
      <button 
        onClick={() => handleSelect(data)} 
        className="group relative flex items-center bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 p-3 w-full active:scale-[0.98]"
      >
        {/* Icono compacto para mobile */}
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors duration-200">
          <IoReceiptOutline className="text-xl text-primary"/>
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {/* Nombre */}
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-slate-800 text-base truncate pr-2 group-hover:text-primary transition-colors duration-200">
              {data.name}
            </h3>
            <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-200">
              <IoArrowForward className="text-primary text-xs group-hover:text-white transition-colors duration-200" />
            </div>
          </div>
          
          {/* Descripción */}
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-1 mb-2">
            {data.description}
          </p>
          
          {/* Información de precios compacta */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center bg-slate-50 rounded px-2 py-1 group-hover:bg-primary/5 transition-colors duration-200">
              <span className="text-slate-500 mr-1">Total:</span>
              <span className="font-semibold text-primary">
                {data.recommendedSalesPrice.toLocaleString('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 0 })}
              </span>
            </div>
            
            <div className="flex items-center bg-slate-50 rounded px-2 py-1 group-hover:bg-primary/5 transition-colors duration-200">
              <span className="text-slate-500 mr-1">Porción:</span>
              <span className="font-semibold text-primary">
                {data.recommendedSalesPricePerPortion.toLocaleString('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 0 })}
              </span>
            </div>
            
            <div className="flex items-center bg-slate-50 rounded px-2 py-1 group-hover:bg-primary/5 transition-colors duration-200">
              <span className="text-slate-500 mr-1">Cant:</span>
              <span className="font-semibold text-primary">{data.portionPerRecipe}</span>
            </div>
          </div>
        </div>
      </button>
    )
  }

export default RecipeItemList;