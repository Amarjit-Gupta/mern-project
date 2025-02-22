import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Footer from "./Footer";
import { URL } from "../URL";
const UpdateProduct = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");


    const params = useParams();
    const index = params.id;
    // console.log(index);

    const navigate = useNavigate();

    const getData = async () => {
        try{
            let result = await fetch(`${URL}/update/${index}`);
            let data = await result.json();
            // console.log(data);
            setName(data.name);
            setPrice(data.price);
            setCategory(data.category);
            setCompany(data.company);
        }
        catch(err){
            console.log("error: ",err);
        }
        
    }

    useEffect(() => {
        getData();
    }, []);

    const handleUpdate = async (event) => {
        event.preventDefault();
        // console.log(name, price, category, company);
        try{
            let result = await fetch(`${URL}/update/${index}`,{
                method: "put",
                body: JSON.stringify({ name, price, category, company }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            let data = await result.json();
            // console.log(data);
            if (data) {
                navigate("/");
            }
        }
        catch(err){
            console.log("error: ",err);
            // alert("data not update try again.");
        }
    }

    return (
        <div className="main-signup">
        <div className="signup">
            <h1>Update Product</h1>
            <form onSubmit={handleUpdate}>
                <input type="text" className="input-Box" placeholder="Enter product Name" value={name} onChange={(event) => setName(event.target.value)} />
                <input type="number" className="input-Box" placeholder="Enter product price" value={price} onChange={(event) => setPrice(event.target.value)} />
                <input type="text" className="input-Box" placeholder="Enter product category" value={category} onChange={(event) => setCategory(event.target.value)} />
                <input type="text" className="input-Box" placeholder="Enter product company" value={company} onChange={(event) => setCompany(event.target.value)} />
                <button type="submit" className="btn">Update</button>
            </form>
        </div>
        <Footer/>
        </div>
    );
};
export default UpdateProduct;