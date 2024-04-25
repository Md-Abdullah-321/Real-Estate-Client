import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const fileRef = useRef(null);

  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(
        `https://real-estate-server-ezx7.onrender.com/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: 'include',
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to update user.");
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3 * 1000);
    } catch (error) {
      dispatch(updateUserFailure(error.message || "Failed to update user."));

      setTimeout(() => {
        dispatch(updateUserFailure(""));
      }, 5 * 1000);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(
        `https://real-estate-server-ezx7.onrender.com/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: 'include',
        }
      );

      const data = await res.json();

      console.log(data);
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user.");
      }

      dispatch(deleteUserSuccess(data));
      alert(data);
    } catch (error) {
      dispatch(deleteUserFailure(error.message || "Failed to delete user."));
    }
  };

  const handleUserSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch(
        `https://real-estate-server-ezx7.onrender.com/api/auth/signout`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to sign out user.");
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message || "Failed to sign out user."));
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(`https://real-estate-server-ezx7.onrender.com/api/user/listings/${currentUser._id}`, {
        credentials: "include"
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch user listings. Status: " + res.status);
      }
  
      const data = await res.json();
      console.log(data);
      setUserListings(data);
      setShowListingsError(false);
    } catch (error) {
      setShowListingsError(true);
      console.error("Error fetching user listings:", error);
    }
  };
  
  
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `https://real-estate-server-ezx7.onrender.com/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
          credentials: true,
        }
      );

      const data = res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete listing.");
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full object-cover h-24 w-24 cursor-pointer self-center mt-2"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}% `}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          name="username"
          value={formData.username || currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          name="email"
          value={formData.email || currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          name="password"
          value={formData.password}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>

        <span
          className="text-red-700 cursor-pointer"
          onClick={handleUserSignOut}
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error && error && console.log(error)}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess && "User is updated successfully"}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError && "Error showing listings"}
      </p>

      {userListings && userListings.length > 0 && (
        <div className=" flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => {
            return (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="flex-1 text-slate-700 font-semibold hover:underline truncate"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>

                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Profile;
