"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface CloudProjectsProps {
  user: User;
  onLoad: (data: any) => void;
  onGetCurrentState: () => any;
}

interface Project {
  id: string;
  name: string;
  updated_at: string;
}

export default function CloudProjects({ user, onLoad, onGetCurrentState }: CloudProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("imovel3d_projects")
      .select("id, name, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [user.id]);

  const handleSaveNew = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const state = onGetCurrentState();

    await supabase.from("imovel3d_projects").insert({
      user_id: user.id,
      name: newName.trim(),
      data: state,
    });

    setNewName("");
    await fetchProjects();
    setSaving(false);
  };

  const handleSaveOver = async (projectId: string) => {
    setSaving(true);
    const state = onGetCurrentState();

    await supabase
      .from("imovel3d_projects")
      .update({ data: state })
      .eq("id", projectId);

    await fetchProjects();
    setSaving(false);
  };

  const handleLoad = async (projectId: string) => {
    const { data } = await supabase
      .from("imovel3d_projects")
      .select("data")
      .eq("id", projectId)
      .single();

    if (data?.data) {
      onLoad(data.data);
    }
  };

  const handleDelete = async (projectId: string) => {
    await supabase.from("imovel3d_projects").delete().eq("id", projectId);
    await fetchProjects();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Projetos na Nuvem</h3>
        <span className="text-xs text-slate-500">{user.email}</span>
      </div>

      {/* Save new */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nome do projeto"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSaveNew()}
          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-700 text-sm text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleSaveNew}
          disabled={saving || !newName.trim()}
          className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {saving ? "..." : "Salvar"}
        </button>
      </div>

      {/* Project list */}
      {loading ? (
        <div className="text-center py-4">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : projects.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-2">
          Nenhum projeto salvo ainda.
        </p>
      ) : (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-2 rounded-lg bg-slate-700/50 flex items-center justify-between group"
            >
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-slate-500">
                  {new Date(p.updated_at).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleLoad(p.id)}
                  className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30"
                >
                  Abrir
                </button>
                <button
                  onClick={() => handleSaveOver(p.id)}
                  className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs hover:bg-green-500/30"
                >
                  Salvar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
