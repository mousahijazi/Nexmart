import { supabase } from "../../lib/supabase";

export async function subscribeToNewsletter(email) {
  try {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      if (error.code === "23505") {
        return { success: false, message: "هذا البريد الإلكتروني مُشترك بالفعل!" };
      }
      return { success: false, message: error.message };
    }

    return { success: true, order: data };
  } catch (err) {
    return { success: false, message: "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً." };
  }
}