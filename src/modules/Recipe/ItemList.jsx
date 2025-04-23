import { IoReceiptOutline } from "react-icons/io5"

const RecipeItemList = ({handleSelect,data}) =>{
    return(
      <button onClick={() => handleSelect(data)} className="flex justify-center items-center bg-white rounded shadow-md text-slate-500 shadow-slate-200 p-4 h-auto w-full">
          <div className="w-1/5 flex justify-center items-center">
             <IoReceiptOutline className="text-6xl font-semibold text-primary"/>
          </div>
          <div className="flex flex-col p-2 gap-2 ">
  
            <div>
              <span className="font-bold text-primary text-2xl">{data.name}</span> 
            </div>
            <div>
              <span className=" font-semibold text-primary">{data.description}</span> 
            </div>
            <div>
              <span className="font-bold">Precio recomendado: </span> 
              <span className="font-semibold text-primary"> {data.recommendedSalesPrice.toLocaleString('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 2 })}</span> 
            </div>
            <div>
              <span className="font-bold">Precio por porción: </span> 
              <span className="font-semibold text-primary">{data.recommendedSalesPricePerPortion.toLocaleString('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 2 })}</span> 
            </div>
            <div>
              <span className="font-bold">Porciones: </span> 
              <span className="font-semibold text-primary">{data.portionPerRecipe}</span> 
            </div>
          </div>
        </button>
    )
  }

export default RecipeItemList;