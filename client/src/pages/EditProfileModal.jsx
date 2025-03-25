import React, { useEffect, useState, Fragment, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import defaultProfile from "../assets/default-profile.png";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditProfileModal({
  isOpen = true,
  onClose = () => {},
  onUpdated,
  onDeleted,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const cancelButtonRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.userInfo);

  // Try to get the profile passed via location state.
  const profileFromState = location.state?.profile;
  const [profileData, setProfileData] = useState(profileFromState || null);
  const [isLoading, setIsLoading] = useState(!profileFromState);

  useEffect(() => {
    if (!profileData) {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing.");
        navigate("/login");
        return;
      }
      const storedUser = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const userId = storedUser?.id || storedUser?._id;
      if (!userId) {
        toast.error("User ID not available.");
        navigate("/dashboard");
        return;
      }
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/api/users/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const fullProfile = response.data.data || response.data;
          setProfileData(fullProfile);
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Error fetching profile data.");
          navigate("/dashboard");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [profileData, navigate, location.state]);

  // Form state includes all fields.
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "",
    role2: "",
    imageUrl: "", // for image URL input
    uploadImage: null, // for file input
    phone: "",
    city: "",
    country: "",
    bio: "",
  });

  // Prefill form when profileData is available.
  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        username: profileData.username || "",
        role: profileData.role || "",
        role2: profileData.role2 || "",
        imageUrl: profileData.image || "",
        uploadImage: null,
        phone: profileData.phone || "",
        city: profileData.city || "",
        country: profileData.country || "",
        bio: profileData.bio || "",
      });
    }
  }, [profileData]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Single change handler.
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileData) {
      toast.error("Profile data not loaded yet.");
      return;
    }
    const userId = profileData._id || profileData.id;
    const payload = new FormData();
    // Append all text fields.
    payload.append("firstName", formData.firstName);
    payload.append("lastName", formData.lastName);
    payload.append("email", formData.email);
    payload.append("username", formData.username);
    payload.append("role", formData.role);
    payload.append("role2", formData.role2);
    payload.append("phone", formData.phone);
    payload.append("city", formData.city);
    payload.append("country", formData.country);
    payload.append("bio", formData.bio);
    // Append image field: if a file is chosen, use that; otherwise use the URL.
    if (formData.uploadImage) {
      payload.append("image", formData.uploadImage);
    } else {
      payload.append("image", formData.imageUrl);
    }
    for (let pair of payload.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing.");
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/users/${userId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Profile updated successfully.");
      if (onUpdated) onUpdated(response.data.data);
      navigate("/dashboard/profile");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating the profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
    navigate("/dashboard/profile");
  };

  const handleDelete = async () => {
    if (!profileData) {
      toast.error("Profile data not loaded yet.");
      return;
    }
    const userId = profileData._id || profileData.id;
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing.");
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User deleted successfully.");
      if (onDeleted) onDeleted(profileData);
      navigate("/profile");
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the user."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayImage = formData.imageUrl || defaultProfile;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        initialFocus={cancelButtonRef}
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={handleCancel}
      >
        <div className="flex items-center justify-center min-h-screen p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300 transform"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200 transform"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <div className="relative inline-block w-full max-w-md p-6 overflow-auto text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Loader />
                </div>
              )}
              <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                Edit Profile
              </Dialog.Title>
              <div className="flex justify-center my-4">
                <img
                  src={displayImage}
                  alt="Current Profile"
                  className="object-cover w-32 h-32 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = defaultProfile;
                  }}
                />
              </div>
              <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                {/* Standard text inputs */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                {/* Editable only by admin */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Role"
                    className="w-full px-3 py-2 border rounded"
                    disabled={currentUser.role !== "admin"}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Role2 (optional)
                  </label>
                  <input
                    type="text"
                    name="role2"
                    value={formData.role2}
                    onChange={handleChange}
                    placeholder="Role2"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Bio"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                {/* Image fields */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Image URL (optional)
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Image URL"
                    className="w-full px-3 py-2 border rounded"
                    disabled={!!formData.uploadImage}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Upload Image (optional)
                  </label>
                  <input
                    type="file"
                    name="uploadImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="flex justify-end mt-4 space-x-4">
                  <button
                    ref={cancelButtonRef}
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border rounded"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-white bg-red-600 rounded"
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-white bg-blue-600 rounded"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
