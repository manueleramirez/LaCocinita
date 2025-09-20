import { IoAdd } from "react-icons/io5";
import Button from "./Button";

export default function ListContainer({ children, title, addLabel, handleAdd }) {
  return (
    <div className="w-full p-4 lg:p-6 min-h-screen">
      <div className="bg-slate-50 rounded-lg shadow-md shadow-slate-200 p-4 lg:p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-slate-700">
            {title}
          </h1>
          <div className="flex-shrink-0">
            <Button
              onClick={handleAdd}
              icon={<IoAdd className="text-xl" />}
              label={addLabel}
            />
          </div>
        </div>
        
        {/* Contenido */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}