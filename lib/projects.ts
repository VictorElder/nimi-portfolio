import { createClient } from "@supabase/supabase-js";
import { projects as fallbackProjects, type Project } from "@/data/projects";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabasePublicConfig, isSupabaseConfigured } from "@/lib/supabase/config";

type ProjectRow = {
  id: string;
  title: string;
  type: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_published: boolean;
};

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    description: row.description,
    image: row.image_url,
    sortOrder: row.sort_order,
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return fallbackProjects;

  const { url, key } = getSupabasePublicConfig();
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase
    .from("design_projects")
    .select("id, title, type, description, image_url, sort_order, is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Could not load published designs from Supabase.", error.message);
    return fallbackProjects;
  }
  return ((data ?? []) as ProjectRow[]).map(toProject);
}

export async function getAdminProjects(): Promise<(Project & { isPublished: boolean })[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("design_projects")
    .select("id, title, type, description, image_url, sort_order, is_published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Could not load designs: ${error.message}`);
  return ((data ?? []) as ProjectRow[]).map((row) => ({
    ...toProject(row),
    isPublished: row.is_published,
  }));
}
