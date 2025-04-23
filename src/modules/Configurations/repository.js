import { supabase } from "../supabaseClient";

export class ConfigRepository {
    async GetConfig(userId) {
        const { data, error } = await supabase
        .from('config')
        .select('*')
        .eq('user_id', userId)
      
          if (error) {
            return {isSuccess: false, data:error};
          }
      
          return {isSuccess:true,data:data}; 
    }

    async CreateConfig(userId, data) {
        const { data:response, error } = await supabase
        .from('config')
        .insert([
            { user_id: userId, ...data }
        ])

          if (error) {
            return {isSuccess: false, data:error};
          }

          return {isSuccess:true,data:response};
    }

    async UpdateConfig(userId, data) {
        let { data:response, error } = await supabase
        .from('config')
        .update({ ...data })
        .eq('user_id', userId)

          if (error) {
            return {isSuccess: false, data:error};
          }

          return {isSuccess:true,data:response};
    }


}