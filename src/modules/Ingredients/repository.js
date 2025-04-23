import { supabase } from "../../infrastructure/supabaseClient";

export class IngredientRepository {
    async GetIngredients(userId) {
        const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('userId', userId)
      
          if (error) {
            console.error('Error signing in ingredient:', error);
            return {isSuccess: false, data:error};
          }
      
          return {isSuccess:true,data:data}; 
    }

    async CreateIngredient(userId, data) {
        const { data:response, error } = await supabase
        .from('ingredients')
        .insert([
            { userId: userId, ...data }
        ])

          if (error) {
            console.error('Error signing in ingredient:', error);
            return {isSuccess: false, data:error};
          }

          return {isSuccess:true,data:response};
    }

    async UpdateIngredient(userId, data) {
      console.log(data)
        let { data:response, error } = await supabase
        .from('ingredients')
        .update({ ...data })
        .eq('userId', userId)
        .eq('id', data.id) 

          if (error) {
            console.error('Error signing in ingredient:', error);
            return {isSuccess: false, data:error};
          }

          return {isSuccess:true,data:response};
    }

    async DeleteIngredient(id) {
        let { data:response, error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id',id)


        if (error) {
            console.error('Error signing in ingredient:', error);
            return {isSuccess: false, data:error};
          }
        return {isSuccess:true,data:response};

    }

}