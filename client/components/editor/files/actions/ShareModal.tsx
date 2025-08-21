import React, { useState } from "react";
import { X, Copy, Check, Link, Mail, Users, Globe } from "lucide-react";
import { ShareModalProps } from "../types";

export default function ShareModal({ isOpen, onClose, file }: ShareModalProps) {
  const [shareLink, setShareLink] = useState(
    `https://collabify.com/shared/${file?.id || "abc123"}`
  );
  const [permission, setPermission] = useState("view");
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<"link" | "email" | "invite">(
    "link"
  );
  const [emailInput, setEmailInput] = useState("");
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);

  if (!isOpen || !file) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const addEmail = () => {
    if (emailInput.trim() && !inviteEmails.includes(emailInput.trim())) {
      setInviteEmails([...inviteEmails, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter((e) => e !== email));
  };

  const handleShare = () => {
    // TODO: Replace with actual API call
    console.log("Sharing file:", {
      fileId: file.id,
      method: shareMethod,
      permission,
      emails: shareMethod === "invite" ? inviteEmails : undefined,
      email: shareMethod === "email" ? emailInput : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Share "{file.name}"
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Share Method Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setShareMethod("link")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                shareMethod === "link"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Link className="w-4 h-4 inline mr-2" />
              Link
            </button>
            <button
              onClick={() => setShareMethod("email")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                shareMethod === "email"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              onClick={() => setShareMethod("invite")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                shareMethod === "invite"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Invite
            </button>
          </div>

          {/* Permission Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permission Level
            </label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="view">Can view</option>
              <option value="comment">Can comment</option>
              <option value="edit">Can edit</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {permission === "view" &&
                "Recipients can view and download the file"}
              {permission === "comment" &&
                "Recipients can view, download, and add comments"}
              {permission === "edit" &&
                "Recipients can view, download, edit, and share the file"}
            </p>
          </div>

          {/* Share Content */}
          {shareMethod === "link" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Share Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyLink}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      linkCopied
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {linkCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {linkCopied && (
                  <p className="text-sm text-green-600 mt-1">
                    Link copied to clipboard!
                  </p>
                )}
              </div>
            </div>
          )}

          {shareMethod === "email" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {shareMethod === "invite" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite People
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addEmail();
                      }
                    }}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={!emailInput.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>

              {inviteEmails.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Invited People ({inviteEmails.length})
                  </p>
                  <div className="space-y-2">
                    {inviteEmails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{email}</span>
                        <button
                          onClick={() => removeEmail(email)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={
              (shareMethod === "email" && !emailInput.trim()) ||
              (shareMethod === "invite" && inviteEmails.length === 0)
            }
          >
            {shareMethod === "link" ? "Copy Link" : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}
