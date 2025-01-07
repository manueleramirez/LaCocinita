import { supabase } from "../../infrastructure/supabaseClient";

export class SupplierRepository {
    async GetSupplier(userId) {
        const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', userId)
      
          if (error) {
            console.error('Error signing in user:', error);
            return {isSuccess: false, data:error};
          }
      
          return {isSuccess:true,data:data}; 
    }

    async CreateSupplier(data) {
        const { data:response, error } = await supabase
        .from('suppliers')
        .insert(data)

          if (error) {
            console.error('Error signing in user:', error);
            return {isSuccess: false, data:error};
          }

          return {isSuccess:true,data:response};
    }

    async UpdateSupplier(userId, data) {
        let { data:response, error } = await supabase
        .from('suppliers')
        .update({ ...data })
        .eq('user_id', userId)
        .eq('id', data.id)

          if (error) {
            console.log('🤖🤖🤖 ~ Document:repository.js LN:39', JSON.stringify(error,null,'\t'))
            console.error('Error signing in user:', error);
            return {isSuccess: false, data:error};
          }

          return {isSuccess:true,data:response};
    }

    async DeleteSupplier(id) {
        let { data:response, error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id',id)


        if (error) {
            console.error('Error signing in user:', error);
            return {isSuccess: false, data:error};
          }
        return {isSuccess:true,data:response};

    }

}