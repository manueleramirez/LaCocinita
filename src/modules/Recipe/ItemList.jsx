import { IoReceiptOutline } from "react-icons/io5"

const RecipeItemList = ({handleSelect,data}) =>{
    return(
      <button onClick={() => handleSelect(data)} className=" flex bg-white rounded shadow-md text-slate-500 shadow-slate-200 p-4">
          <div className="w-1/5 flex justify-center items-center">
             <IoReceiptOutline className="text-6xl"/>
          </div>
          <div className="flex flex-col p-2 gap-2 ">
  
            <div>
              <span className="font-bold">Receta:</span> {data.name}
            </div>
  
            <div>
              <span className="font-bold">Precio: 25,000</span> 
            </div>
            <div>
              <span className="font-bold">Porciones: 8</span> 
            </div>
  
          </div>
        </button>
    )
  }

export default RecipeItemList;