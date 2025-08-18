"use client";

import React, { useEffect, useState } from "react";
import {
  Eye,
  Users,
  Hash,
  Calendar,
  Palette,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import api from "@/lib/axios";

interface FormData {
  name: string;
  description: string;
  visibility: "Private" | "Public" | "Team";
  projectType: "Personal" | "Team" | "Client";
  startDate: string;
  dueDate: string;
  members: string[];
  tags: string[];
  color: string;
}

interface Errors {
  [key: string]: string;
}

const ProjectCreationForm: React.FC = () => {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    visibility: "Private",
    projectType: "Personal",
    startDate: getTodayDate(),
    dueDate: "",
    members: [],
    tags: [],
    color: "#4ade80",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [memberInput, setMemberInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);


  const colorOptions = [
    "#4ade80", // green
    "#60a5fa", // blue
    "#f87171", // red
    "#fbbf24", // yellow
    "#a78bfa", // purple
    "#fb7185", // pink
    "#34d399", // emerald
    "#fcd34d", // amber
  ];

  // Simulate API call to search users
  const searchUsers = async (query: string): Promise<string[]> => {
    setIsSearching(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const response = await api.get(`/users/search?q=${query}&limit=5`);
      const users = response.data; // array of objects: { id, email, name }

      // Filter out already added members and match query
      const filteredUsers = users
        .filter(
          (user: { email: string }) =>
            typeof user.email === "string" &&
            user.email.toLowerCase().includes(query.toLowerCase()) &&
            !formData.members.includes(user.email)
        )
        .map((user: { email: string }) => user.email); // map to string array

      setIsSearching(false);
      return filteredUsers.slice(0, 5); // limit to 5 suggestions
    } catch (error) {
      console.error("Error searching users:", error);
      setIsSearching(false);
      return [];
    }
  };
  
  useEffect(() => {
    if (memberInput.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchUsers(memberInput); // your fixed searchUsers
      // console.log(results)
      console.log("search User Called....");
      setSuggestions(results);
      setShowDropdown(results.length > 0);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(handler); // cleanup on input change
  }, [memberInput]);
  const handleMemberInputChange = async (value: string) => {
    setMemberInput(value);

    // Clear any previous errors
    if (errors.memberInput) {
      setErrors((prev) => ({ ...prev, memberInput: "" }));
    }
  };

  const selectSuggestion = (email: string) => {
    if (!formData.members.includes(email)) {
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, email],
      }));
    }

    setMemberInput("");
    setSuggestions([]);
    setShowDropdown(false);
    setErrors((prev) => ({ ...prev, memberInput: "" }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const addMember = () => {
    const email = memberInput.trim();

    if (!email) return;

    if (!validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        memberInput: "Please enter a valid email address",
      }));
      return;
    }

    // Check if email exists in mock database
    if (!suggestions.includes(email)) {
      setErrors((prev) => ({
        ...prev,
        memberInput: "User not found in database",
      }));
      return;
    }

    if (formData.members.includes(email)) {
      setErrors((prev) => ({
        ...prev,
        memberInput: "This member is already added",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, email],
    }));
    setMemberInput("");
    setSuggestions([]);
    setShowDropdown(false);
    setErrors((prev) => ({ ...prev, memberInput: "" }));
  };

  const removeMember = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== email),
    }));
  };

  const handleClickOutside = () => {
    setShowDropdown(false);
  };

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (formData.tags.includes(tag)) {
      setErrors((prev) => ({ ...prev, tagInput: "This tag already exists" }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
    setTagInput("");
    setErrors((prev) => ({ ...prev, tagInput: "" }));
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      visibility: "Private",
      projectType: "Personal",
      startDate: getTodayDate(),
      dueDate: "",
      members: [],
      tags: [],
      color: "#4ade80",
    });
    setMemberInput("");
    setTagInput("");
    setSuggestions([]);
    setShowDropdown(false);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const {
      name,
      description,
      visibility,
      projectType,
      members,
      startDate,
      dueDate,
      tags,
      color,
    } = formData;

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(suggestions)
      // In real implementation, replace with:
      await api.post("/projects/new", {
        name,
        description,
        members,
        visibility,
        projectType,
        startDate,
        dueDate,
        tags,
        color,
      });

      resetForm();
      alert("Project created successfully!");
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        submit:
          error?.response?.data?.message ||
          "Failed to create project. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    //   <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Project
            </h1>
            <p className="text-gray-600">
              Set up your new project with all the details and team members.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Name */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  placeholder="Enter project name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Visibility */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Eye className="inline w-4 h-4 mr-1" />
                  Visibility
                </label>
                <select
                  value={formData.visibility}
                  onChange={handleInputChange("visibility")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Team">Team</option>
                </select>
              </div>

              {/* Description */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  placeholder="Describe your project..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                />
              </div>

              {/* Project Type */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={handleInputChange("projectType")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Personal">Personal</option>
                  <option value="Team">Team</option>
                  <option value="Client">Client</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange("startDate")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Due Date */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Due Date / Deadline
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange("dueDate")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Team Members with Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-1" />
                Add Members
              </label>
              <div className="relative">
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={memberInput}
                      onChange={(e) => handleMemberInputChange(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addMember)}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowDropdown(true);
                      }}
                      placeholder="Type email to search users..."
                      className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.memberInput
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={addMember}
                    className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                  <div
                    className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto"
                    style={{ top: "100%" }}
                  >
                    {suggestions.map((email, index) => (
                      <div
                        key={email}
                        onClick={() => selectSuggestion(email)}
                        className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 ${
                          index === 0 ? "rounded-t-lg" : ""
                        } ${
                          index === suggestions.length - 1 ? "rounded-b-lg" : ""
                        }`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {email}
                          </div>
                          <div className="text-xs text-gray-500">
                            Click to add
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Click Outside Handler */}
                {showDropdown && (
                  <div
                    className="fixed inset-0 z-0"
                    onClick={handleClickOutside}
                  />
                )}
              </div>

              {errors.memberInput && (
                <p className="text-red-500 text-sm mb-3">
                  {errors.memberInput}
                </p>
              )}

              {/* Selected Members */}
              {formData.members.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Selected Members ({formData.members.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.members.map((member, index) => (
                      <div
                        key={member}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm animate-in fade-in slide-in-from-left-2 duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {member.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-blue-900 font-medium">
                          {member}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMember(member)}
                          className="text-blue-600 hover:text-red-500 transition-colors hover:bg-red-100 rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tags / Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline w-4 h-4 mr-1" />
                Tags / Categories
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    if (errors.tagInput) {
                      setErrors((prev) => ({ ...prev, tagInput: "" }));
                    }
                  }}
                  onKeyPress={(e) => handleKeyPress(e, addTag)}
                  placeholder="Add a tag"
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.tagInput ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {errors.tagInput && (
                <p className="text-red-500 text-sm mb-3">{errors.tagInput}</p>
              )}

              {/* Existing Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="inline w-4 h-4 mr-1" />
                Project Color
              </label>
              <div className="flex gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      formData.color === color
                        ? "border-gray-700 shadow-lg"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="flex items-center ml-4 text-sm text-gray-600">
                  <span className="font-mono">{formData.color}</span>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </button>
            </div>
          </div>
        </div>
    //   </div>
    // </div>
  );
};

export default ProjectCreationForm;
