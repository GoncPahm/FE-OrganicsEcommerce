import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { actionComplete, actionFailure, actionStart } from "../redux/user/userSlice";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import ConfirmDelete from "../components/ConfirmDelete";

export default function DetailsUserListing() {
    const { id } = useParams();
    const [files, setFiles] = useState([]);
    console.log("mount");
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        address: "",
        description: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 10,
        offer: false,
        parking: false,
        furnished: false,
        userRef: currentUser._id,
    });
    const handleHiddenPopup = useCallback(() => {
        setShowPopup(false);
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/user/details-listing/${id}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success === false) {
                    console.log(data.message);
                    return;
                }
                setFormData(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    // console.log("lis", formData.imageUrls.length);

    const handleImageSubmit = (e) => {
        e.preventDefault();
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploadLoading(true);
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ...urls] });
                    setFiles([]);
                    setUploadLoading(false);
                })
                .catch((error) => {
                    dispatch(actionFailure("Image upload failed (max 2MB per image)"));
                    setUploadLoading(false);
                });
        } else {
            dispatch(actionFailure("Please choose images of product (max 6 images)"));
        }
    };

    const handleRemoveImageUploaded = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progess = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log(progess);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((dowloadURL) => {
                        resolve(dowloadURL);
                    });
                }
            );
        });
    };

    const handleChange = (e) => {
        if (e.target.id === "rent" || e.target.id === "sale") {
            setFormData({ ...formData, type: e.target.id });
        } else if (e.target.id === "furnished" || e.target.id === "parking" || e.target.id === "offer") {
            setFormData({ ...formData, [e.target.id]: e.target.checked });
        } else setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmitUpdateListing = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            dispatch(actionStart());
            const res = await fetch(`http://localhost:3001/api/listings/update/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(actionFailure("Please check the information again!!!!"));
                return;
            }
            console.log(data);
            dispatch(actionComplete());
            navigate(`/listings/${currentUser._id}`);
        } catch (error) {
            dispatch(actionFailure(error.message));
        }
    };
    return (
        <div>
            {formData && (
                <>
                    {/* {error && <Error errors={error} />} */}
                    {showPopup && <ConfirmDelete onHidden={handleHiddenPopup} listingID={id} />}
                    <div className="max-w-4xl mx-auto mt-16 text-center">
                        <h1 className="my-6 text-2xl font-bold">Detail Listing</h1>
                        <form onSubmit={handleSubmitUpdateListing} className="flex gap-4">
                            <div className="flex-1 flex flex-col gap-3">
                                <input
                                    id="name"
                                    type="text"
                                    className="p-3 rounded-md border border-slate-300"
                                    placeholder="Name"
                                    onChange={handleChange}
                                    value={formData.name}
                                />
                                <textarea
                                    id="description"
                                    className="p-3 rounded-md border border-slate-300"
                                    rows="3"
                                    placeholder="Description"
                                    onChange={handleChange}
                                    value={formData.description}
                                ></textarea>
                                <input
                                    id="address"
                                    type="text"
                                    className="p-3 rounded-md border border-slate-300"
                                    placeholder="Address"
                                    onChange={handleChange}
                                    value={formData.address}
                                />
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex gap-2">
                                        <input
                                            id="sale"
                                            type="checkbox"
                                            className="w-5"
                                            onChange={handleChange}
                                            checked={formData.type === "sale"}
                                        />
                                        <span>Sale</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            id="rent"
                                            type="checkbox"
                                            className="w-5"
                                            onChange={handleChange}
                                            checked={formData.type === "rent"}
                                        />
                                        <span>Rent</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            id="parking"
                                            type="checkbox"
                                            className="w-5"
                                            onChange={handleChange}
                                            checked={formData.parking}
                                        />
                                        <span>Parking spot</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            id="furnished"
                                            type="checkbox"
                                            className="w-5"
                                            onChange={handleChange}
                                            checked={formData.furnished}
                                        />
                                        <span>Furnished</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            id="offer"
                                            type="checkbox"
                                            className="w-5"
                                            onChange={handleChange}
                                            checked={formData.offer}
                                        />
                                        <span>Offer</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex gap-2 items-center">
                                        <input
                                            id="bedrooms"
                                            type="number"
                                            min={1}
                                            max={10}
                                            className="p-3 border border-slate-300 rounded-md"
                                            onChange={handleChange}
                                            value={formData.bedrooms}
                                        />
                                        <span>Beds</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            id="bathrooms"
                                            type="number"
                                            min={1}
                                            max={10}
                                            className="p-3 border border-slate-300 rounded-md"
                                            onChange={handleChange}
                                            value={formData.bathrooms}
                                        />
                                        <span>Baths</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            id="regularPrice"
                                            type="number"
                                            min={50}
                                            max={1000000}
                                            className="p-3 border border-slate-300 rounded-md"
                                            onChange={handleChange}
                                            value={formData.regularPrice}
                                        />
                                        <span>
                                            Regular price
                                            <br />
                                            <span className="text-xs">($ / Month)</span>
                                        </span>
                                    </div>
                                    <div className=" flex gap-2 items-center">
                                        <input
                                            id="discountPrice"
                                            type="number"
                                            min={10}
                                            name="discountPrice"
                                            max={1000000}
                                            className="p-3 border border-slate-300 rounded-md"
                                            onChange={handleChange}
                                            value={formData.discountPrice}
                                        />
                                        <span>Discount price</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-4">
                                <p className="text-start">
                                    <span className="font-bold text-start">Images</span>: The first image will be the
                                    cover (max 6)
                                </p>
                                <div className="flex gap-2 justify-between">
                                    <input
                                        id="imageUrls"
                                        onChange={(e) => setFiles(e.target.files)}
                                        accept="image/*"
                                        type="file"
                                        multiple
                                        className="border border-slate-300 p-3 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        className="border border-slate-300 p-3 rounded-md hover:shadow-lg transition-all"
                                        onClick={handleImageSubmit}
                                    >
                                        {uploadLoading ? "UPLOADING...." : "UPLOAD"}
                                    </button>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {formData.imageUrls &&
                                        formData.imageUrls.map((url, index) => (
                                            <div
                                                key={index}
                                                className="border border-slate-300 p-3 rounded-md flex items-center justify-between overflow-hidden"
                                            >
                                                <img
                                                    src={url}
                                                    alt="Image"
                                                    className="w-20 h-20 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    className="text-red-400 cursor-pointer"
                                                    onClick={() => handleRemoveImageUploaded(index)}
                                                >
                                                    DELETE
                                                </button>
                                            </div>
                                        ))}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-slate-600 p-3 rounded-lg text-white cursor-pointer hover:shadow-lg transition-all"
                                >
                                    {loading ? "UPDATING...." : "UPDATE LISTING"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPopup(true)}
                                    className="bg-orange-400 p-3 rounded-lg text-white cursor-pointer hover:shadow-lg transition-all"
                                >
                                    DELETE LISTING
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
