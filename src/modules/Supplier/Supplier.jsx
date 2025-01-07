import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supplierAdapter, supplierCreateAdapter, supplierUpdateAdapter } from "../../adapters/supplier.adapter";
import { useModal } from "../../hooks/useModal";
import SupplierForm from "./Form";
import SupplierList from "./List";
import { SupplierRepository } from "./repository";
import { selectSupplier, setSuppliers } from "./slice";

export default function Supplier() {
  const { showModal,hideModal,Modal } = useModal();
  const repository = new SupplierRepository()
  const dispatcher = useDispatch()
  const suppliers = useSelector((state) => state.supplier.suppliers);
  const user = useSelector((state) => state.user.user);
  
  useEffect(()=>{
    handleGetSupplier()
  },[user])

  const handleGetSupplier = async () =>{
    repository.GetSupplier(user.id).then(({data}) =>{
      const supplierAdapted = data.map(supplier => supplierAdapter(supplier))
      dispatcher(setSuppliers(supplierAdapted))
    })
  }

  const handleAddSupplier = async (values) => {
    await repository.CreateSupplier(supplierCreateAdapter(values))
    await handleGetSupplier();
    hideModal();
  };

  const handleEditSupplier = async (values) => {
    await repository.UpdateSupplier(user.id,supplierUpdateAdapter({userId:user.id , ...values}))
    await handleGetSupplier();
    hideModal();
  };
  
  const  handleDeleteSupplier = async (id) => {
    await repository.DeleteSupplier(id)
    await handleGetSupplier();
    hideModal();
  };
  
  const handleSelectSupplier = (supplier) => {
    dispatcher(selectSupplier(supplier));
    showModal()
  };

  const handleOpenForm = () => {
    dispatcher(selectSupplier(null));
    showModal();
  };

  return (
    <div>
      <Modal>
        <SupplierForm add={handleAddSupplier} edit={handleEditSupplier} remove={handleDeleteSupplier} />
      </Modal>
     <SupplierList showForm={handleOpenForm} handleSelect={handleSelectSupplier} suppliers={suppliers} />
    </div>
  )
}
