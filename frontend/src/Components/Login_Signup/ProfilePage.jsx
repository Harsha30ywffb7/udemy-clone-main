import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'photo' | 'privacy'

  // Source-of-truth copies for dirty checking
  const [initialState, setInitialState] = useState(null);

  // Udemy profile form
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    headline: "",
    biography: "",
    biographyMarkdown: "", // Store markdown separately
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
    x: "",
    youtube: "",
    language: "English (US)",
  });

  // Profile picture tab state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Privacy settings tab state
  const [privacy, setPrivacy] = useState({
    showProfileToLoggedIn: true,
    showCoursesOnProfile: true,
  });

  // Load profile on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const user = data?.data?.user || data?.user || {};
        const mapped = {
          firstName: user?.name?.first || "",
          lastName: user?.name?.last || "",
          headline: user?.userProfile?.headline || "",
          biography:
            user?.userProfile?.biography?.format === "markdown" ||
            !user?.userProfile?.biography?.format
              ? user?.userProfile?.biography?.content || ""
              : user?.bio || "",
          biographyMarkdown: user?.userProfile?.biography?.content || "", // Map markdown
          website: user?.socialLinks?.website || "",
          facebook: user?.socialLinks?.facebook || "",
          instagram: user?.socialLinks?.instagram || "",
          linkedin: user?.socialLinks?.linkedin || "",
          tiktok: user?.socialLinks?.tiktok || "",
          x: user?.socialLinks?.x || "",
          youtube: user?.socialLinks?.youtube || "",
          language: user?.userProfile?.language || "English (US)",
        };
        setForm(mapped);
        setPrivacy({
          showProfileToLoggedIn:
            user?.privacySettings?.showProfileToLoggedIn ?? true,
          showCoursesOnProfile:
            user?.privacySettings?.showCoursesOnProfile ?? true,
        });
        setInitialState({ form: mapped, privacy: { ...privacy } });
      })
      .catch(() => {});
  }, []);

  // Dirty state tracking
  const isDirty = useMemo(() => {
    if (!initialState) return false;
    const a = JSON.stringify(initialState.form);
    const b = JSON.stringify(form);
    const c = JSON.stringify(initialState.privacy);
    const d = JSON.stringify(privacy);
    return a !== b || c !== d;
  }, [initialState, form, privacy]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setIsUploading(true);
    // TODO: integrate real upload endpoint
    setTimeout(() => {
      setIsUploading(false);
    }, 1200);
  };

  const formatBiographyForDisplay = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>");
  };

  // Convert display format back to markdown for storage
  const formatBiographyForStorage = (text) => {
    if (!text) return "";
    return text
      .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
      .replace(/<em>(.*?)<\/em>/g, "_$1_");
  };

  // Simple markdown helpers for bold/italic: **bold**, _italic_
  const wrapSelection = (before, after = before) => {
    const div = document.getElementById("biography-input");
    if (!div) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      // Create the formatted element
      const formattedElement = document.createElement(
        before === "**" ? "strong" : "em"
      );
      formattedElement.textContent = selectedText;

      // Replace the selection with formatted text
      range.deleteContents();
      range.insertNode(formattedElement);

      // Update form state
      const html = div.innerHTML;
      const markdown = html
        .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
        .replace(/<em>(.*?)<\/em>/g, "_$1_")
        .replace(/<br>/g, "\n")
        .replace(/<div>/g, "\n")
        .replace(/<\/div>/g, "");

      setForm((prev) => ({
        ...prev,
        biography: html,
        biographyMarkdown: markdown,
      }));
    }
  };

  const saveProfile = async (e) => {
    e?.preventDefault?.();
    if (!isDirty) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = {
      name: { first: form.firstName, last: form.lastName },
      userProfile: {
        headline: form.headline,
        language: form.language,
        biography: {
          content: form.biographyMarkdown, // markdown stored
          format: "markdown",
        },
      },
      socialLinks: {
        website: form.website || null,
        facebook: form.facebook || null,
        instagram: form.instagram || null,
        linkedin: form.linkedin || null,
        tiktok: form.tiktok || null,
        x: form.x || null,
        youtube: form.youtube || null,
      },
      privacySettings: {
        showProfileToLoggedIn: privacy.showProfileToLoggedIn,
        showCoursesOnProfile: privacy.showCoursesOnProfile,
      },
    };

    await axios.put("/api/users/profile", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // After successful save, reset initial state
    setInitialState({ form: { ...form }, privacy: { ...privacy } });
  };

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`pb-3 text-[12px] font-600 transition-colors ${
        activeTab === id
          ? "text-gray-900 border-b-2 border-gray-900"
          : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-5xl px-20 py-10 font-sans text-gray-900">
      {/* Page Title */}
      <h1 className="text-[28px] md:text-[32px] leading-tight font-bold mb-8">
        Profile & settings
      </h1>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 mb-8 font-bold text-[12px]">
        <TabButton id="profile" label="Udemy profile" />
        <TabButton id="photo" label="Profile picture" />
        <TabButton id="privacy" label="Privacy settings" />
      </div>

      {/* Content */}
      {activeTab === "profile" && (
        <form
          onSubmit={saveProfile}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/** Form Input Helper */}
          {[
            { label: "First name", name: "firstName", type: "text" },
            {
              label: "Website",
              name: "website",
              type: "url",
              placeholder: "URL",
            },
            { label: "Last name", name: "lastName", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-[12px] font-medium text-gray-800 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder || ""}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-[12px] placeholder:text-[12px] focus:outline-none focus:ring-[#5624d0] focus:border-[#5624d0] transition"
              />
            </div>
          ))}

          {/* Facebook */}
          <div>
            <label className="block text-[12px] font-medium text-gray-800 mb-1">
              Facebook
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-[12px] rounded-l">
                facebook.com/
              </span>
              <input
                type="text"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-r px-3 py-2 text-[12px] focus:outline-none focus:ring-[#5624d0] focus:border-[#5624d0] transition"
              />
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-[12px] font-medium text-gray-800 mb-1">
              Headline
            </label>
            <input
              type="text"
              name="headline"
              maxLength={60}
              placeholder="Instructor at Udemy"
              value={form.headline}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-[12px] placeholder:text-[12px] focus:outline-none focus:ring-[#5624d0] focus:border-[#5624d0] transition"
            />
            <div className="text-[10px] text-gray-500 text-right mt-1">
              {form.headline.length}/60
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-[12px] font-medium text-gray-800 mb-1">
              Instagram
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-[12px] rounded-l">
                instagram.com/
              </span>
              <input
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-r px-3 py-2 text-[12px] focus:outline-none focus:ring-[#5624d0] focus:border-[#5624d0] transition"
              />
            </div>
          </div>

          {/* Biography */}
          <div className="md:col-span-2">
            <label className="block text-[12px] font-medium text-gray-800 mb-1">
              Biography
            </label>
            {/* Toolbar */}
            <div className="flex space-x-2 mb-1">
              <button
                type="button"
                onClick={() => wrapSelection("**", "**")}
                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 font-bold text-[12px]"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => wrapSelection("_", "_")}
                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 italic text-[12px]"
              >
                I
              </button>
            </div>
            {/* Editable formatted preview */}
            <div
              id="biography-input"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const html = e.target.innerHTML;
                const markdown = html
                  .replace(/<strong>(.*?)<\/strong>/g, "<strong>$1</strong>")
                  .replace(/<em>(.*?)<\/em>/g, "<em>$1</em>")
                  .replace(/<br>/g, "\n")
                  .replace(/<div>/g, "\n")
                  .replace(/<\/div>/g, "");
                setForm((prev) => ({
                  ...prev,
                  biography: html,
                  biographyMarkdown: markdown,
                }));
              }}
              onBlur={(e) => {
                // Ensure proper formatting on blur
                const html = e.target.innerHTML;
                const markdown = html
                  .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
                  .replace(/<em>(.*?)<\/em>/g, "_$1_")
                  .replace(/<br>/g, "\n")
                  .replace(/<div>/g, "\n")
                  .replace(/<\/div>/g, "");
                setForm((prev) => ({
                  ...prev,
                  biographyMarkdown: markdown,
                }));
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 text-[12px] min-h-[100px] focus:outline-none focus:ring-[#5624d0] focus:border-[#5624d0] transition"
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
              dangerouslySetInnerHTML={{
                __html: formatBiographyForDisplay(form.biographyMarkdown),
              }}
            />
            <p className="mt-1 text-[10px] text-gray-500 leading-snug">
              To help learners learn more about you, your bio should reflect
              your Credibility, Empathy, Passion, and Personality. Your
              biography should have at least 50 words, links and coupon codes
              are not permitted.
            </p>
          </div>

          {/* Remaining Socials */}
          {[
            {
              label: "LinkedIn",
              name: "linkedin",
              placeholder: "Public profile URL",
            },
            { label: "TikTok", name: "tiktok", prefix: "tiktok.com/" },
            { label: "X", name: "x", prefix: "x.com/" },
            { label: "YouTube", name: "youtube", prefix: "youtube.com/" },
          ].map((social) => (
            <div key={social.name}>
              <label className="block text-[12px] font-medium text-gray-800 mb-1">
                {social.label}
              </label>
              {social.prefix ? (
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-[12px] rounded-l">
                    {social.prefix}
                  </span>
                  <input
                    type="text"
                    name={social.name}
                    value={form[social.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-r px-3 py-2 text-[12px] focus:outline-none focus:ring-[#5624d0] focus:border-[#5624d0] transition"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  name={social.name}
                  placeholder={social.placeholder || ""}
                  value={form[social.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-[12px] placeholder:text-[12px] focus:outline-none focus:ring-[#5624d0] focus:border-[#5624d0] transition"
                />
              )}
            </div>
          ))}

          {/* Language */}
          <div>
            <label className="block text-[12px] font-medium text-gray-800 mb-1">
              Language
            </label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-[12px] focus:outline-none focus:ring-[#5624d0] focus:border-[#5624d0] transition"
            >
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={!isDirty}
              className="bg-[#5624d0] text-white px-6 py-2 rounded text-[12px] font-bold hover:bg-[#401b9c] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {activeTab === "photo" && (
        <div className="max-w-3xl">
          <p className="text-[10px] text-gray-500 mb-3">
            Minimum 200x200 pixels, Maximum 6000x6000 pixels
          </p>
          <div className="w-full h-56 border border-gray-300 rounded bg-gray-50 flex items-center justify-center mb-4 overflow-hidden">
            {photoPreview ? (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img
                src={photoPreview}
                alt="Profile preview"
                className="h-full object-contain"
              />
            ) : (
              <div className="w-40 h-40 rounded-full border-4 border-gray-300 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14a4 4 0 100-8 4 4 0 000 8zM6 20a6 6 0 1112 0H6z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="bg-[#5624d0] text-white px-4 py-2 rounded text-[12px] font-bold hover:bg-[#401b9c] cursor-pointer">
              Choose file
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </label>
            <button
              onClick={handlePhotoUpload}
              disabled={!photoFile || isUploading}
              className="bg-[#5624d0] text-white px-4 py-2 rounded text-[12px] font-bold hover:bg-[#401b9c] disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload image"}
            </button>
          </div>

          <div className="mt-6">
            <button
              disabled={!photoPreview}
              className="bg-[#5624d0] text-white px-6 py-2 rounded text-[12px] font-bold hover:bg-[#401b9c] disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="max-w-3xl">
          <div className="space-y-4 mb-6">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={privacy.showProfileToLoggedIn}
                onChange={(e) =>
                  setPrivacy({
                    ...privacy,
                    showProfileToLoggedIn: e.target.checked,
                  })
                }
                className="mt-1"
              />
              <span className="text-[12px] text-gray-800">
                Show your profile to logged-in users
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={privacy.showCoursesOnProfile}
                onChange={(e) =>
                  setPrivacy({
                    ...privacy,
                    showCoursesOnProfile: e.target.checked,
                  })
                }
                className="mt-1"
              />
              <span className="text-[12px] text-gray-800">
                Show courses you're taking on your profile page
              </span>
            </label>
          </div>

          <button
            onClick={saveProfile}
            disabled={!isDirty}
            className="bg-[#5624d0] text-white px-6 py-2 rounded text-[12px] font-bold hover:bg-[#401b9c] disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
