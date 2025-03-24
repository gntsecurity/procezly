"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { FileText, Search, PlusCircle } from "lucide-react";

const AuditTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch audit templates from Supabase
  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase.from("audit_templates").select("*");
      if (error) console.error("Error fetching audit templates:", error);
      else setTemplates(data || []);
    };
    fetchTemplates();
  }, []);

  // Search Logic
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-900">Audit Templates</h1>
      <p className="text-gray-600 mt-2">Manage standardized audit templates for consistency.</p>

      {/* Controls: Search & Create Template */}
      <div className="flex items-center justify-between mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} />
          <span>Create Template</span>
        </button>
      </div>

      {/* Template List */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit Template Library</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Template Name</th>
              <th className="text-left px-4 py-2">Category</th>
              <th className="text-left px-4 py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredTemplates.map((template) => (
              <tr key={template.id} className="border-t">
                <td className="px-4 py-2">{template.id}</td>
                <td className="px-4 py-2">{template.name}</td>
                <td className="px-4 py-2">{template.category}</td>
                <td className="px-4 py-2">{template.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTemplates;
