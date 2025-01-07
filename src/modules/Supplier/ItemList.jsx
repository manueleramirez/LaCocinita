import { IoCartOutline } from "react-icons/io5"

const SupplierItemList = ({handleSelect,data}) =>{
    return(
      <div onClick={() => handleSelect(data)} className=" flex bg-white rounded shadow-md text-slate-500 shadow-slate-200 p-4">
          <div className="w-1/5 flex justify-center items-center">
             <IoCartOutline className="text-6xl"/>
          </div>
          <div className="flex flex-col p-2 gap-2 ">
  
            <div>
              <span className="font-bold">Suplidor:</span> {data.name}
            </div>
  
            <div>
              <span className="font-bold">Dirección:</span> {data.address}
            </div>
  
            <div>
              <span className="font-bold">Teléfono:</span> {data.phone}
            </div>
          </div>
        </div>
    )
  }

export default SupplierItemList;