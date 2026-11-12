import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, deleteUser, fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import styles from "../styles";
import { getCurrentUser } from "aws-amplify/auth";

function Dashboard() {
    const navigate = useNavigate();
    const [hasFiltered, setHasFiltered] = useState(false);
    const [productName, setProductName] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [vendor, setVendor] = useState("");
    const [cost, setCost] = useState("");
    const [quantity, setQuantity] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    let [purchasedBy, setPurchasedBy] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [editMode, setEditMode] = useState(false);
    const [editModeId, setEditModeId] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [product, setProduct] = useState("");
    const [range, setRange] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [cheapest, setCheapest] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState("");
    const [selectedPurchase, setSelectedPurchase] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);

    const totalSpend = purchases.reduce((sum, p) => sum + p.cost, 0);

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);

        const sorted = [...purchases].sort((a, b) => {
            let valA = a[field];
            let valB = b[field];
            if (valA == null) return 1;
            if (valB == null) return -1;
            if (field === "cost" || field === "quantity") {
                return order === "asc" ? valA - valB : valB - valA;
            }
            if (field === "date") {
                const parseDate = (d) => {
                    if (d.includes("-")) return new Date(d);
                    if (d.includes("/")) {
                        const [day, month, year] = d.split("/");
                        return new Date(year, month - 1, day);
                    }
                    return new Date(d);
                };
                const dateA = parseDate(a.date);
                const dateB = parseDate(b.date);
                return order === "asc" ? dateA - dateB : dateB - dateA;
            }
            return order === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });
        setPurchases(sorted);
    };

    const getHeaderStyle = (field) => ({
        ...styles.th,
        backgroundColor: sortField === field ? "#1f3b73" : "#2a5298",
    });

    const toggleEditMode = () => {
        setEditMode(!editMode);
        if (editMode) {
            setSelectedRows([]);
        }
    };

    const handleRowSelection = (purchaseId) => {
        if (selectedRows.includes(purchaseId)) {
            setSelectedRows(selectedRows.filter((id) => id !== purchaseId));
        } else {
            setSelectedRows([...selectedRows, purchaseId]);
        }
    };

    const handleDeleteSelected = () => {
        alert(`${selectedRows.length} purchase(s) selected. Backend not implemented yet.`);
    };

    const handleReset = () => {
        setProduct("");
        setRange("");
        setFromDate("");
        setToDate("");
        setCheapest(false);
        tokenFetch();
    };

    const tokenFetch = async () => {
        try {
            const res = await axios.get("http://localhost:8080/purchase/filter?RANGE=LAST_MONTH", {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            });
            setHasFiltered(false);
            setPurchases(res.data);
        } catch (error) {
            console.error(error);
            alert("Failed to reset data");
        }
    };

    const fetchFiltered = async () => {
        const token =          await getToken();

        let url = "http://localhost:8080/purchase/filter?";
        if (product) url += `product=${product}&`;
        if (range) url += `range=${range}&`;
        if (fromDate && toDate) url += `fromDate=${fromDate}&toDate=${toDate}&`;
        if (cheapest) url += "cheapest=true&";

        try {
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHasFiltered(true);
            setPurchases(res.data);
        } catch (error) {
            console.error(error);
            alert(JSON.stringify(error.response?.data));

        }
    };

    const getToken = async () => {
        const session = await fetchAuthSession();
        return session.tokens?.accessToken?.toString();
    };

    const handleLogout = async () => {
        try {
            await signOut();
            sessionStorage.removeItem("isLoggedIn");
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            try {
                await deleteUser();
                sessionStorage.removeItem("isLoggedIn");
                navigate("/");
            } catch (error) {
                console.error(error);
            }
        }
    };

    const fetchPurchases = async () => {
        try {
            const token = await getToken();
            const res = await axios.get("http://localhost:8080/purchase/fetchAll", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPurchases(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addPurchase = async () => {

         purchasedBy =
    purchasedBy.trim() === ""
        ? loggedInUser
        : purchasedBy;
        
        try {
            const token = await getToken();
            await axios.post(
                "http://localhost:8080/purchase/add",
                { productName, purchaseDate, vendor, cost, quantity, paymentMode, purchasedBy },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("✅ Purchase added successfully");
            setProductName("");
            setPurchaseDate("");
            setVendor("");
            setCost("");
            setQuantity("");
            setPaymentMode("");
            setPurchasedBy("");
            fetchPurchases();
        } catch (error) {
          console.error("Error Response:", error.response);
console.error("Error Data:", error.response?.data);
            alert(error.response?.data || "❌ Failed to add purchase");
        }
    };

    useEffect(() => {

            const loadUser = async () => {
        const user = await getCurrentUser();
        setLoggedInUser(user.username);
    };

    loadUser();

        fetchPurchases();
        if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
            sessionStorage.clear();
            navigate("/");
        }
    }, [navigate]);

    return (
    <div>
        <div style={styles.topBar}>
      <h2>Purchase Dashboard</h2>
      <div>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDelete}>Delete User</button>
      </div>
      </div>
    <div style={styles.container}>
        
      <h3>Add Purchase</h3>
      <input style={styles.input} placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
      <input style={styles.input} type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
      <input style={styles.input} placeholder="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
      <input style={styles.input} placeholder="Cost" value={cost} onChange={(e) => setCost(e.target.value)} />
      <input style={styles.input} placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <input style={styles.input} placeholder="Payment Mode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} />
      <input style={styles.input} placeholder="Purchased By" value={purchasedBy} onChange={(e) => setPurchasedBy(e.target.value)} />
      <button onClick={addPurchase}>Add Purchase</button>

      <h3>Purchase List</h3>
      { cheapest && <div style={{ marginTop: "10px", fontWeight: "bold" }}>Total Spend (Last Month): ₹{totalSpend}</div> }

    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
        <input placeholder="Search Product" value={product} onChange={(e) => setProduct(e.target.value)} />
        <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="">Custom</option>
            <option value="LastWeek">Last Week</option>
            <option value="LastMonth">Last Month</option>
            <option value="LastYear">Last Year</option>
        </select>
        <input type="date" value={fromDate} disabled={range !== ""} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} disabled={range !== ""} onChange={(e) => setToDate(e.target.value)} />

        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input type="checkbox" checked={cheapest} onChange={(e) => setCheapest(e.target.checked)} />
            Cheapest
        </label>
        <div>

        <button onClick={fetchFiltered}>Apply</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={fetchPurchases}>Refresh</button>
        <button onClick={toggleEditMode}>{editMode ? "Done" : "Edit"}</button>
        {editMode && <button onClick={handleDeleteSelected}>Delete Selected</button>}
        </div>
    </div>

    {
        purchases.length === 0 ? (
            <p>No purchases yet</p>
        ) : (
        <table>
            <thead>
                <tr>

                    {editMode && <th>Select</th>}
                    <th style={getHeaderStyle("productName")} onClick={() => handleSort("productName")}>
                        Product {sortField === "productName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th style={getHeaderStyle("date")} onClick={() => handleSort("date")}>
                        Date {sortField === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th style={getHeaderStyle("cost")} onClick={() => handleSort("cost")}>
                        Cost {sortField === "cost" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th style={getHeaderStyle("quantity")} onClick={() => handleSort("quantity")}>
                        Quantity {sortField === "quantity" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                     <th style={getHeaderStyle("vendor")} onClick={() => handleSort("vendor")}>
                        Vendor {sortField === "vendor" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>       
                    <th style={getHeaderStyle("paymentMode")} onClick={() => handleSort("paymentMode")}>
                        Payment Mode {sortField === "paymentMode" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>       
                    <th style={getHeaderStyle("purchasedBy")} onClick={() => handleSort("purchasedBy")}>
                        Purchased By {sortField === "purchasedBy" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
<th>Action</th>

                </tr>
            </thead>
            <tbody>
                {purchases.map((p, index) => (
                    <tr
                        key={index}
                        style={styles.row}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f5f7fa"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                    >
                         {editMode && (
                            <td>
                                <input type="checkbox" checked={selectedRows.includes(p)} onChange={() => handleRowSelection(p)} />
                            </td>
                        )} 
                        <td>{p.productName}</td>
                        <td>{p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : ""}</td>
                        <td>₹{p.cost}</td>
                        <td>{p.quantity}</td>
                        <td>{p.vendor}</td>
                        <td>{p.paymentMode}</td>
                        <td>{p.purchasedBy}</td>
                        <td>
    <button
        onClick={() => {
            setSelectedPurchase({ ...p });
            setShowEditModal(true);
        }}
    >
        Edit
    </button>
</td>
                    </tr>
                ))}
            </tbody>
</table>

)}

{
    showEditModal && (
        <div
    style={{
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "5px"
}}
>
            <h3>Edit Purchase</h3>

          <div style={{ marginBottom: "15px" }}>
    <label>Product Name</label>

    <input
        style={styles.input}
        value={selectedPurchase?.productName || ""}
        onChange={(e) =>
            setSelectedPurchase({
                ...selectedPurchase,
                productName: e.target.value
            })
        }
    />
</div><div style={{ marginBottom: "15px" }}>
    <label>Vendor</label>

    <input
        style={styles.input}
        value={selectedPurchase?.vendor || ""}
        onChange={(e) =>
            setSelectedPurchase({
                ...selectedPurchase,
                vendor: e.target.value
            })
        }
    />
</div>

<div style={{ marginBottom: "15px" }}>
    <label>Cost</label>
    <input
        style={styles.input}
        value={selectedPurchase?.cost || ""}
        onChange={(e) =>
            setSelectedPurchase({
            ...selectedPurchase,
            cost: e.target.value
        })
    }
/>
</div>

<div style={{ marginBottom: "15px" }}>
    <label>Quantity</label>
    <input
        style={styles.input}
        value={selectedPurchase?.quantity || ""}
    onChange={(e) =>
        setSelectedPurchase({
            ...selectedPurchase,
            quantity: e.target.value
        })
    }
/>
</div>

<div style={{ marginBottom: "15px" }}>
    <label>Payment Mode</label>
    <input
    style={styles.input}
    value={selectedPurchase?.paymentMode || ""}
    onChange={(e) =>
        setSelectedPurchase({
            ...selectedPurchase,
            paymentMode: e.target.value
        })
    }
/>
</div>

<div style={{ marginBottom: "15px" }}>
    <label>Purchased By</label>
    <input
        style={styles.input}
        value={selectedPurchase?.purchasedBy || ""}
        onChange={(e) =>
            setSelectedPurchase({
            ...selectedPurchase,
            purchasedBy: e.target.value
        })
    }
/>
</div>
<br/>


            <button
                onClick={() => setShowEditModal(false)}
            >
                Close
            </button>
        </div>
    )
}

</div>
</div>

                        );
}
                        export default Dashboard;
