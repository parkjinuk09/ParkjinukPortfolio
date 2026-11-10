import { handleContactRequest } from "@/features/contact/http";
import { insertContactMessage } from "@/features/contact/repository";
import { readSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function POST(request: Request): Promise<Response> {
  const config = readSupabaseConfig();
  const client = config ? createSupabaseServerClient(config) : null;

  return handleContactRequest(request, {
    saveContactMessage: client ? (input) => insertContactMessage(client, input) : null,
  });
}
