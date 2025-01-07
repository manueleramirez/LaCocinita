import { IoAdd } from "react-icons/io5";
import Button from "./Button";
export default function ListContainer({ children, title,addLabel, handleAdd }) {
  return (
    <div className=" md:w-[120%] pt-20 md:p-5">
      <div className="overflow-hidden bg-slate-50 rounded shadow-md shadow-slate-200 p-12 h-full lg:w-[90%]">
        <div className="text-xl font-bold text-slate-400 flex justify-between mb-4">
          <p>{title}</p>
          <div className="">
            <Button
              onClick={handleAdd}
              icon={<IoAdd className="text-xl" />}
              label={addLabel}
            />
          </div>
        </div>
        <div className=" p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 max-h-[90%] overflow-y-scroll no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
