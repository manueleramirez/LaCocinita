import { supabase } from "../supabaseClient";

export class CustomerRepository {
    async GetCustomer(userId) {
        const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
      
          if (error) {
            console.error('Error signing in user:', error);
            return {isSuccess: false, data:error};
          }
      
          return {isSuccess:true,data:data}; 
    }

    async CreateCustomer(userId, data) {
        const { data:response, error } = await supabase
        .from('customers')
        .insert([
            { user_id: userId, ...data }
        ])

          if (error) {
            console.error('Error signing in user:', error);
            return {isSuccess: false, data:error};
          }

          return {isSuccess:true,data:response};
    }

    async UpdateCustomer(userId, data) {
        let { data:response, error } = await supabase
        .from('customers')
        .update({ ...data })
        .eq('user_id', userId)

          if (error) {
            console.error('Error signing in user:', error);
            return {isSuccess: false, data:error};
          }

          return {isSuccess:true,data:response};
    }

    async DeleteCustomer(id) {
        let { data:response, error } = await supabase
        .from('customers')
        .delete()
        .eq('id',id)


        if (error) {
            console.error('Error signing in user:', error);
            return {isSuccess: false, data:error};
          }
        return {isSuccess:true,data:response};

    }

}