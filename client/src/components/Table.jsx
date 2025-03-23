// Table.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import { HiOutlineRefresh } from "react-icons/hi";
import { ImBin } from "react-icons/im";
import { Link } from "react-router-dom";
// Import apiClient instead of axios
import apiClient from "../services/apiClient";
import Search from "./search";
import {
  deleteProduct,
  setProducts,
} from "../features/api/products/productSlice";

export default function Table() {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use apiClient without headers; token is handled by interceptor
        const response = await apiClient.get("/products");
        console.log("Products Response:", response.data);

        if (response.status === 200) {
          dispatch(setProducts(response.data.products));
          console.log("Products Response:", response.data.products);
        }
      } catch (error) {
        console.error("Error Fetching Products", error);

        // Additional error details
        if (error.response) {
          console.error("Response Data:", error.response.data);
          console.error("Response Status:", error.response.status);
          console.error("Response Headers:", error.response.headers);
        } else if (error.request) {
          console.error("No Response Received:", error.request);
        } else {
          console.error("Error Message:", error.message);
        }
      }
    };
    fetchProducts();
  }, [dispatch]);

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
    setShowModal(false);
  };

  return (
    <div>
      <div className="bg-white h-[15%] w-[98%] flex items-center justify-center">
        <Search value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex flex-col items-center justify-start h-[55vh] mt-3 w-[98%] ">
        <table className="w-full text-center table-auto ">
          <thead>
            <tr className="border-t-2 border-b-2 border-black">
              <th className="w-[5%]">S/N</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          {/*Table rows */}
          <tbody className=" h-[300px] overflow-y-auto ">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product, index) => (
                <tr
                  key={product?._id}
                  className="h-[40px] bg-gray-100 border-b-2 border-white"
                >
                  <td>{index + 1}</td>
                  <td>{product?.name || "-"}</td>
                  <td>{product?.category || "-"}</td>
                  <td>#{product?.price || "-"}</td>
                  <td>{product?.quantity || "-"}</td>
                  <td>#{product?.value || "-"}</td>
                  <td className="flex items-center justify-center gap-3 mt-3">
                    <p>
                      <Link to={`/dashboard/products/${product?._id}`}>
                        <BsEye className="text-[#0F1377]" />
                      </Link>
                    </p>
                    <p>
                      <Link to={`/dashboard/editproduct/${product?._id}`}>
                        <HiOutlineRefresh className="text-[#0A6502]" />
                      </Link>
                    </p>
                    <p>
                      <button onClick={() => setShowModal(true)}>
                        <ImBin className="text-[#850707]" />
                      </button>
                    </p>
                  </td>

                  {showModal ? (
                    <>
                      {/*Delete Confirmation Modal*/}
                      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                        <div className="relative w-auto max-w-3xl mx-auto my-6">
                          <div className="border-0 rounded-lg shadow-lg relative flex flex-col items-center justify-center w-[40vw] h-[40vh] bg-white outline-none focus:outline-none">
                            <p>Hey Joshua!</p>
                            <p>Are you sure you want to delete this?</p>
                            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                              <button
                                className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-green-500 rounded outline-none background-transparent focus:outline-none hover:bg-green-300"
                                type="button"
                                onClick={() => handleDeleteProduct(product._id)}
                              >
                                Delete
                              </button>
                              <button
                                className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-red-500 rounded shadow outline-none hover:bg-red-300 hover:shadow-lg focus:outline-none"
                                type="button"
                                onClick={() => setShowModal(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No products found</td>
              </tr>
            )}
            <tr></tr>
          </tbody>
        </table>
        <p className="w-full text-center text-slate-400">
          by MusCo ©️ <span>{new Date().getFullYear()}</span>2024
        </p>
      </div>
    </div>
  );
}
