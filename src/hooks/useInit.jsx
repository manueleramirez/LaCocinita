import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSuppliers } from '../modules/Supplier/slice';
import { SupplierRepository } from '../modules/Supplier/repository';
import { supplierAdapter } from '../adapters/supplier.adapter';

export default function useInit() {
    const user = useSelector((state) => state.user.user);
    const repository = new SupplierRepository()
    const dispatcher = useDispatch();

    const initData = async() =>{

        repository.GetSupplier(user.id).then(({data}) =>{
            const supplierAdapted = data.map(supplier => supplierAdapter(supplier))
            dispatcher(setSuppliers(supplierAdapted))
          })

    }

    useEffect(()=>{
        initData()
    })
  
}
